import { SubmissionStatus } from "@/components/approvals/types";
import { Approval } from "@/context/formContext";
import { getApprovalStatus } from "@/utils/approval-helper";
import { PST_EMAIL } from "@/utils/constants";
import { stringToNode } from "@/utils/data-helper";
import { copyText } from "@/utils/odd-jobs";

function SubmissionsStatusNote({ status }: { status: SubmissionStatus }) {
	const firstTimeBlock = (
		<span>
			If this is a new character,{" "}
			<a
				href="https://wiki.concordlarp.com/index.php/Character_Creation"
				className="text-muted-foreground underline"
			>
				check what you can do before your character is approved.
			</a>
		</span>
	);
	const emailBlock = (
		<span className="text-muted-foreground" onClick={() => copyText(PST_EMAIL)}>
			{PST_EMAIL} (click to copy)
		</span>
	);

	if (status === "Awaiting Review") {
		return (
			<p className="text-sm">
				Your submission is in a queue to be reviewed by the team. Our team are volunteers
				and will be working on it, please be patient! {firstTimeBlock}
			</p>
		);
	}

	if (status === "Changes Requested") {
		return (
			<p className="text-sm">
				Please make the changes requested by our team. If you need help or clarification,
				reach out via {emailBlock}. {firstTimeBlock}
			</p>
		);
	}

	if (status === "Archived") {
		return (
			<p className="text-sm">
				This submission has been archived and is no longer active. If this seems like a
				mistake, reach out via {emailBlock}.
			</p>
		);
	}

	return <></>;
}

export function ApprovalReport({
	approval,
	dateSubmitted,
	showInfo,
}: {
	approval?: Approval;
	dateSubmitted?: string;
	showInfo?: boolean;
}) {
	const { author, status, comment, date: approvalDate } = approval || {};

	const submitDateString = dateSubmitted ? new Date(dateSubmitted).toLocaleDateString() : null;
	const approvalDateString = approvalDate ? new Date(approvalDate).toLocaleDateString() : null;

	const { submissionStatus, tickColorClass } = getApprovalStatus({
		status: status,
		submissionDate: dateSubmitted,
		approvalDate: approval?.date,
	});

	const note = !submitDateString
		? "When you submit your character you'll be able to see your approval status here."
		: submitDateString
			? `${author} on ${approvalDateString}`
			: "Your character is set to be approved by the team";

	return (
		<div className="text-left flex flex-col gap-4">
			<div>
				<h2 className={`text-lg font-bold`}>{submissionStatus}</h2>
				{showInfo && <SubmissionsStatusNote status={submissionStatus} />}
			</div>

			<p className="text-sm">
				{submitDateString
					? `You last submitted on ${submitDateString}`
					: `You have not submitted your character yet`}
			</p>
			<div className="flex flex-col gap-1">
				{status && note ? (
					<p className="text-sm">
						{status} by {note}
					</p>
				) : null}
				{comment && (
					<blockquote className={`pl-2 py-2 border-l-4 border-primary italic leading-5`}>
						{stringToNode(comment)}
					</blockquote>
				)}
			</div>
		</div>
	);
}
