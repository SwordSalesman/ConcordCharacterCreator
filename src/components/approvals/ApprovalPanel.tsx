import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TextArea } from "../common/Input/Input";
import { Button } from "../common/Button/Button";
import useUserContext from "../../hooks/use-user-context";
import { saveApproval } from "../../hooks/use-firebase";
import toast from "react-hot-toast";
import { APPROVED, ARCHIVED, DENIED } from "../../utils/constants";
import { prettifyDate } from "../../utils/date-helper";
import { ApprovalRecord, Character, ApprovalStatus } from "./types";
import { cn } from "@/lib/utils";
import { stringToNode } from "@/utils/data-helper";
import { CharacterSheet } from "../characterCreator/CharacterSheet";
import { characterToFormState } from "@/utils/character-to-form-state";
import { AiOutlineCopy, AiOutlineSend } from "react-icons/ai";
import { LuClipboardPaste, LuMailCheck, LuMailX } from "react-icons/lu";
import { Modal } from "../common/Modal/Modal";
import { Chip } from "../common/Chip/Chip";
import { getApprovalTemplate } from "./approvalTemplates";

const EMAIL_STYLE_PROPS = [
	"font-size",
	"font-weight",
	"font-family",
	"font-style",
	"gap",
	"padding",
	"margin",
	"display",
	"flex-direction",
	"justify-content",
	"align-items",
	"border",
	"border-radius",
	"max-width",
];

function inlineComputedStyles(source: Element, clone: Element) {
	if (source instanceof HTMLElement && clone instanceof HTMLElement) {
		const computed = window.getComputedStyle(source);
		const inlined = EMAIL_STYLE_PROPS.map((p) => `${p}:${computed.getPropertyValue(p)}`).join(
			";",
		);
		clone.setAttribute("style", inlined);
	}
	for (let i = 0; i < source.children.length; i++) {
		inlineComputedStyles(source.children[i], clone.children[i]);
	}
}

interface Props {
	character: Character | null;
	handleApproval: (approval: ApprovalRecord) => void;
	sendEmailOption: boolean;
	setSendEmailOption: (value: boolean) => void;
}

function ApprovalPanel({ character, handleApproval, sendEmailOption, setSendEmailOption }: Props) {
	const [loading, setLoading] = useState(false);
	const [copying, setCopying] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const sheetRef = useRef<HTMLDivElement>(null);
	useEffect(() => setIsMounted(true), []);

	const [confirmModal, setConfirmModal] = useState(false);
	const [comment, setComment] = useState("");
	const [status, setStatus] = useState<ApprovalStatus | null>(null);
	const shouldSendEmail = status !== ARCHIVED && sendEmailOption;
	const [date, setDate] = useState(character?.approval?.date ?? "");
	const [author, setAuthor] = useState(character?.approval?.author ?? "");
	const lastEmail = character?.approval?.email;
	const { comment: previousComment, status: previousStatus } = character?.approval || {
		comment: "",
		status: null,
	};

	useEffect(() => {
		setComment("");
		setStatus(null);
	}, [character]);

	const { name } = useUserContext();
	const [validInputs, setValidInputs] = useState({
		validStatus: true,
		validComment: true,
	});
	const disabled = !character || loading;
	const [archiveConfirm, setArchiveConfirm] = useState(false);

	async function handleSubmit() {
		const valid = validateInputs();
		if (!valid) return;
		if (!status) return;

		setLoading(true);
		toast.promise(
			saveApproval({
				name,
				comment,
				status: status,
				subjectUid: character!.id,
				sendEmail: shouldSendEmail,
			}),
			{
				success: ({ approval }) => {
					setLoading(false);
					handleApproval({ ...approval, id: character!.id });
					setAuthor(name);
					setDate(approval.date);

					let approvalMessage = "";
					switch (approval.status) {
						case APPROVED:
							approvalMessage = "Approval submitted.";
							break;
						case DENIED:
							approvalMessage = "Changes requested.";
							break;
						case ARCHIVED:
							approvalMessage = "Character archived.";
							break;
						default:
							approvalMessage = "Unexpected status. Verify approval.";
					}
					let emailMessage = "";
					if (shouldSendEmail) {
						switch (approval.email.status) {
							case "failed":
								emailMessage = "Failed to send email.";
								break;
							case "not sent":
								emailMessage = "Email not sent.";
								break;
							case "pending":
								emailMessage = "Email pending.";
								break;
							case "sent":
								emailMessage = "Email sent.";
								break;
							default:
								emailMessage = "Unexpected status. Verify email.";
						}
					}

					return `${approvalMessage}${emailMessage ? ` ${emailMessage}` : ""}`;
				},
				loading: "Submitting...",
				error: (err) => {
					setLoading(false);
					return `Failed to submit approval, ${err}`;
				},
			},
			{
				success: {
					icon: undefined,
				},
			},
		);
	}

	const validateInputs = () => {
		const validStatus = status !== null;
		const validComment = status === APPROVED || comment.length > 0;
		setValidInputs({ validStatus, validComment });
		return validStatus && validComment;
	};

	async function getCharSheetHtml() {
		if (!sheetRef.current || !character) return;
		try {
			const clone = sheetRef.current.cloneNode(true) as HTMLElement;
			inlineComputedStyles(sheetRef.current, clone);
			return clone.outerHTML;
		} catch {
			toast.error("Failed to generate character sheet html");
			return undefined;
		}
	}

	async function copyEmailContent() {
		if (!sheetRef.current || !character) return;
		setCopying(true);

		const sheetHtml = await getCharSheetHtml();
		if (!sheetHtml) {
			setCopying(false);
			return;
		}

		try {
			const comment = `<p>${previousComment.replace(/\n/g, "<br>")}</p>`;
			const divider = `<p>~~~~~~~~~</p><p>Here's the latest character you submitted:</p>`;
			const htmlContent = `${comment}${divider}${sheetHtml}`;

			await navigator.clipboard.write([
				new ClipboardItem({
					"text/html": new Blob([htmlContent], { type: "text/html" }),
					"text/plain": new Blob([previousComment], { type: "text/plain" }),
				}),
			]);
			toast.success("Email content copied!");
		} catch {
			toast.error("Failed to copy email content");
		} finally {
			setCopying(false);
		}
	}

	function applyTemplate() {
		if (!status || !character) return;

		function getFirstName(fullName: string) {
			const parts = fullName.trim().split(" ");
			return parts.length > 0 ? parts[0] : fullName;
		}

		const template = getApprovalTemplate({
			approvalStatus: status,
			playerName: getFirstName(character.player),
			approverName: getFirstName(name),
		});
		setComment(template);
	}

	const approvalOptions = [
		{
			status: APPROVED,
			label: "Approved",
			icon: <p>👍</p>,
			activeClass: "bg-green-600! text-white!",
		},
		{
			status: DENIED,
			label: "Changed Requested",
			icon: <p>👎</p>,
			activeClass: "bg-destructive! text-white!",
		},
		{
			status: ARCHIVED,
			label: "Archived",
			icon: <p>🗑️</p>,
			activeClass: "bg-primary! text-white!",
		},
	].map((s) => {
		const active = status === s.status;
		return (
			<Button
				key={s.status}
				onClick={(e) => {
					e.preventDefault();
					setStatus(status === s.status ? null : (s.status as ApprovalStatus));
				}}
				size="sm"
				disabled={disabled}
				className={active ? s.activeClass : ""}
			>
				{s.icon}
				<p>{s.label}</p>
			</Button>
		);
	});

	const sheetData = character ? characterToFormState(character) : null;

	return (
		<div className="relative">
			{/* Portal to body: rendered off-screen so computed styles (including CSS variable resolution) are available */}
			{isMounted &&
				sheetData &&
				createPortal(
					<div
						ref={sheetRef}
						aria-hidden
						className="fixed top-0 left-0 w-[480px] p-3 max-w-[480px] text-xs pointer-events-none border-1 rounded-xl"
						style={{ opacity: 0, zIndex: -1 }}
					>
						<CharacterSheet data={sheetData} full simple />
					</div>,
					document.body,
				)}
			{/* Gradient fade effect above the panel */}

			<div className="w-full h-10 absolute -top-8 bg-gradient-to-t from-background-raised to-transparent" />

			<div
				className="border rounded-tl-lg rounded-tr-lg h-[100%] sm:max-h-[450px] relative overflow-scroll
			text-sm p-3 flex flex-col gap-5 z-1 bg-background
			[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
			>
				{author && date ? (
					<div>
						<h2 className="text-lg font-bold">Previous Approval</h2>
						<div className="flex flex-col gap-1">
							<p>
								{previousStatus === APPROVED
									? "Approved"
									: previousStatus === DENIED
										? "Changes Requested"
										: "Archived"}{" "}
								by {author} on {prettifyDate(date)}
							</p>
							<blockquote
								className={`pl-2 border-l-4 border-primary italic text-wrap break-words`}
							>
								{previousComment ? (
									stringToNode(previousComment)
								) : (
									<i className="text-muted-foreground">No comment</i>
								)}
							</blockquote>
							{!lastEmail?.status ? (
								<p className="text-muted-foreground">
									No automatic email record found
								</p>
							) : (
								<p>
									{lastEmail.status === "sent" &&
										`Email sent on ${prettifyDate(lastEmail.sentAt)}`}
									{lastEmail.status === "not sent" && `Email not sent`}
									{lastEmail.status === "failed" &&
										`Email failed to send on ${prettifyDate(lastEmail.sentAt)}`}
								</p>
							)}
						</div>
					</div>
				) : (
					<i>This submission has not yet been reviewed</i>
				)}
				<form className="gap-2 flex flex-col">
					<div>
						<h2 className="text-lg font-bold">Approval Form</h2>
						<div
							className={cn(
								"flex flex-col items-left sm:flex-row sm:justify-between gap-1 rounded-md",
								!validInputs.validStatus ? "p-1 border-1 border-destructive" : "",
							)}
						>
							<div className="flex flex-row gap-1">
								{approvalOptions[0]}
								{approvalOptions[1]}
							</div>
							<div>{approvalOptions[2]}</div>
						</div>
					</div>
					<div className="flex gap-1 flex-col">
						<TextArea
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							placeholder="This will be shown to the player"
							label="Comments"
							disabled={disabled}
							error={
								!validInputs.validComment
									? "Denied or archived submissions should include a comment"
									: undefined
							}
						/>
					</div>
					<div className="flex justify-between items-center gap-2">
						<div className="flex flex-row gap-1">
							<Chip
								onClick={() => setSendEmailOption(!sendEmailOption)}
								selected={sendEmailOption}
								disabled={disabled}
							>
								{sendEmailOption ? (
									<LuMailCheck size={18} />
								) : (
									<LuMailX size={18} />
								)}
							</Chip>
							<Button
								disabled={disabled}
								onClick={(e) => {
									e.preventDefault();
									const valid = validateInputs();
									if (valid) {
										setConfirmModal(true);
									}
								}}
							>
								<AiOutlineSend />
								Submit
							</Button>
						</div>
						<div className="flex flex-col items-end gap-1">
							<Button
								type="button"
								disabled={disabled || copying || !status}
								onClick={applyTemplate}
								size="sm"
							>
								<LuClipboardPaste />
								{`Apply ${status ?? ""} Template`}
							</Button>
							<Button
								type="button"
								variant="outline"
								disabled={disabled || copying}
								onClick={copyEmailContent}
								size="sm"
							>
								<AiOutlineCopy />
								{"Copy Email Content"}
							</Button>
						</div>
					</div>
				</form>
				<Modal
					title="Submitting Approval"
					body={
						<div className="flex flex-row gap-3 items-center">
							{shouldSendEmail ? <LuMailCheck size={24} /> : <LuMailX size={24} />}
							{shouldSendEmail
								? `An email will be sent upon submission. This will take a moment.`
								: `No email will be sent. ${status === ARCHIVED ? "(No email is sent when archiving)" : ""}`}
						</div>
					}
					open={confirmModal}
					onClose={() => setConfirmModal(false)}
					actions={[
						{
							label: "Cancel",
							onClick: () => setConfirmModal(false),
							variant: "outline",
						},
						{
							label: shouldSendEmail ? "Submit and Email" : "Submit",
							onClick: () => {
								setConfirmModal(false);
								handleSubmit();
							},
							variant: "primary",
						},
					]}
				/>
			</div>
		</div>
	);
}

export default ApprovalPanel;
