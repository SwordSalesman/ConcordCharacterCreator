import { Approval } from "@/context/formContext";
import { getApprovalStatus } from "@/utils/approval-helper";
import { stringToNode } from "@/utils/data-helper";

export function ApprovalReport({
	approval,
	dateSubmitted,
}: {
	approval?: Approval;
	dateSubmitted?: string;
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
			? `${author} on ${approvalDateString?.replaceAll("/", "-")}`
			: "Your character is set to be approved by the team";

	return (
		<div className="text-left">
			<h2 className={`text-lg font-bold ${tickColorClass}`}>{submissionStatus}</h2>
			<p className="text-sm text-muted-foreground mb-2">
				{submitDateString
					? `You last submitted on ${submitDateString}`
					: `You have not submitted your character yet`}
			</p>
			<div className="flex flex-col gap-1">
				<p className="text-sm text-muted-foreground">
					{status} by {note}
				</p>
				{comment && (
					<blockquote className={`pl-2 border-l-4 border-primary italic leading-5`}>
						{stringToNode(comment)}
					</blockquote>
				)}
			</div>
		</div>
	);
}
