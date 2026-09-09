import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { logger, setGlobalOptions } from "firebase-functions";
import { defineSecret } from "firebase-functions/params";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { google } from "googleapis";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 2 });

initializeApp();

const gmailClientId = defineSecret("GMAIL_CLIENT_ID");
const gmailClientSecret = defineSecret("GMAIL_CLIENT_SECRET");
const gmailRefreshToken = defineSecret("GMAIL_REFRESH_TOKEN");

const APPROVAL_STATUSES = ["Approved", "Denied", "Archived"] as const;
type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];
type EmailStatus = "pending" | "sent" | "not sent" | "failed";

interface Approval {
    author: string
    date: string
    comment: string
    status: ApprovalStatus
    email: {
        status: EmailStatus
        sentAt: string
        failedAt: string
        gmailMessageId: string | null
    }
}

interface ApprovalInput {
    subjectUid: string;
    status: ApprovalStatus;
    comment: string;
    sendEmail: boolean;
}

interface CharacterData {
    email?: unknown;
    heroName?: unknown;
    player?: unknown;
}

function isApprovalInput(value: unknown): value is ApprovalInput {
    if (!value || typeof value !== "object") return false;

    const input = value as Record<string, unknown>;
    return (
        typeof input.subjectUid === "string" &&
        input.subjectUid.length > 0 &&
        typeof input.status === "string" &&
        (APPROVAL_STATUSES as readonly string[]).includes(input.status) &&
        typeof input.comment === "string"
    );
}

function escapeHtml(value: string): string {
    return value.replace(/[&<>'"]/g, (character) => {
        const entities: Record<string, string> = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            '"': "&quot;",
        };
        return entities[character];
    });
}

function createEmailMessage({
    recipient,
    sender,
    characterName,
    status,
    comment,
}: {
    recipient: string;
    sender: string;
    characterName: string;
    status: ApprovalStatus;
    comment: string;
}): string {
    let subject = 'Concord Character Submission'
    switch (status) {
        case "Approved":
            subject = "Approved - Concord Character Submission";
            break;
        case "Denied":
            subject = "Changes Requested - Concord Character Submission";
            break;
    }

    const heroNameCallout = `The review for ${characterName} has been completed.`;

    const text = [heroNameCallout, comment].join("\n") || "";
    const html = `<p>${escapeHtml(text).replace(/\n/g, "<br>")}</p>`;

    const rawMessage = [
        `To: ${recipient}`,
        `From: ${sender}`,
        `Subject: ${subject}`,
        "MIME-Version: 1.0",
        'Content-Type: multipart/alternative; boundary="approval-boundary"',
        "",
        "--approval-boundary",
        'Content-Type: text/plain; charset="UTF-8"',
        "",
        text,
        "--approval-boundary",
        'Content-Type: text/html; charset="UTF-8"',
        "",
        html,
        "--approval-boundary--",
    ].join("\r\n");

    return Buffer.from(rawMessage).toString("base64url");
}

function getGmailErrorDetails(error: unknown): Record<string, unknown> {
    if (!(error instanceof Error)) return { error };

    const apiError = error as Error & {
        code?: unknown;
        response?: { status?: unknown; data?: unknown };
    };
    return {
        errorMessage: error.message,
        errorCode: apiError.code,
        httpStatus: apiError.response?.status,
        apiError: apiError.response?.data,
    };
}

export const submitApproval = onCall(
    {
        secrets: [gmailClientId, gmailClientSecret, gmailRefreshToken],
    },
    async (request) => {
        // Check if the request is authenticated
        if (!request.auth) {
            throw new HttpsError("unauthenticated", "Sign in is required.");
        }
        if (!isApprovalInput(request.data)) {
            throw new HttpsError("invalid-argument", "Invalid approval data.");
        }
        if (request.data.status !== "Approved" && request.data.comment.trim().length === 0) {
            throw new HttpsError("invalid-argument", "Denied and archived approvals require a comment.");
        }

        // Get the Firestore database instance and the reviewer's information to check if they're aactually a reviewer
        const database = getFirestore();
        const reviewerSnapshot = await database.doc(`users/${request.auth.uid}`).get();
        const reviewer = reviewerSnapshot.data();
        if (typeof reviewer?.role !== 'number' || reviewer.role < 3) {
            throw new HttpsError("permission-denied", "Administrator access is required.");
        }

        // Get the hero submission they're reviewing
        const characterReference = database.doc(`characters/${request.data.subjectUid}`);
        const approvalReference = database.doc(`approvals/${request.data.subjectUid}`);
        const characterSnapshot = await characterReference.get();
        if (!characterSnapshot.exists) {
            throw new HttpsError("not-found", "Character submission not found.");
        }

        const character = characterSnapshot.data() as CharacterData;
        if (typeof character.email !== "string" || !character.email) {
            throw new HttpsError("failed-precondition", "Character submission has no email address.");
        }
        if (typeof character.heroName !== "string" || !character.heroName) {
            throw new HttpsError("failed-precondition", "Character submission has no hero name.");
        }

        // First we set the approval for the character submission
        const shouldSendEmail = request.data.sendEmail;
        const date = new Date().toISOString();
        const approval: Approval = {
            author: typeof reviewer.name === "string" ? reviewer.name : "Player Support Team",
            date,
            comment: request.data.comment,
            status: request.data.status,
            email: { status: shouldSendEmail ? "pending" : "not sent", sentAt: "", failedAt: "", gmailMessageId: null },
        };

        await database.runTransaction(async (transaction) => {
            transaction.set(approvalReference, approval);
            transaction.update(characterReference, { changes: null });
        });


        if (!shouldSendEmail) {
            return {
                approval
            }
        }

        // Then we attempt to send the approval email to the player's email address
        try {
            const oauthClient = new google.auth.OAuth2(
                gmailClientId.value(),
                gmailClientSecret.value(),
            );
            oauthClient.setCredentials({ refresh_token: gmailRefreshToken.value() });
            const gmail = google.gmail({ version: "v1", auth: oauthClient });
            const profile = await gmail.users.getProfile({ userId: "me" });
            const sender = profile.data.emailAddress;
            if (!sender) throw new Error("The authorized Gmail account has no email address.");

            const result = await gmail.users.messages.send({
                userId: "me",
                requestBody: {
                    raw: createEmailMessage({
                        recipient: character.email,
                        sender,
                        characterName: character.heroName,
                        status: request.data.status,
                        comment: request.data.comment,
                    }),
                },
            });

            const email = {
                ...approval.email,
                status: "sent",
                sentAt: new Date().toISOString(),
                gmailMessageId: result.data.id ?? null,
            };
            await approvalReference.update({ email });
            return { approval: { ...approval, email } };
        } catch (error) {
			const errorDetails = getGmailErrorDetails(error);
            logger.error("Approval email failed to send", {
				subjectUid: request.data.subjectUid,
				...errorDetails,
			});
            const email = {
                ...approval.email,
                status: "failed",
                failedAt: new Date().toISOString(),
            };
            await approvalReference.update({ email });
            return { approval: { ...approval, email } };
        }
    },
);

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
