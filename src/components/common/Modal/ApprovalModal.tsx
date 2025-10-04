import useFormContext from "@/hooks/use-form-context";
import { Modal } from "./Modal";
import { APPROVED, DENIED } from "@/utils/constants";
import { getApprovalStatus } from "@/utils/approval-helper";

export function ApprovalModal({ open, onClose }: { open: boolean; onClose: () => void }) {
	const { approval, date } = useFormContext();
	const { author, status, comment, date: approvalDate } = approval || {};

	const submitDateString = date ? new Date(date).toLocaleDateString() : null;
	const approvalDateString = approvalDate ? new Date(approvalDate).toLocaleDateString() : null;

	const { submissionStatus, tickColor } = getApprovalStatus({
		status: status,
		submissionDate: date,
		approvalDate: approval?.date,
	});

	const note = !submitDateString
		? "When you submit your character you'll be able to see your approval status here."
		: submitDateString
		? `${author} on ${approvalDateString?.replaceAll("/", "-")}`
		: "Your character is set to be approved by the team";

	return (
		<Modal
			title={<p>{submissionStatus}</p>}
			subtitle={submitDateString ? `Last submitted on ${submitDateString}` : undefined}
			body={
				<div className="flex flex-col gap-1">
					{comment && (
						<blockquote
							className={`pl-3 border-l-4 border-primary italic text-muted-foreground text-md`}
						>
							{comment}
						</blockquote>
					)}
					<p className="text-muted-foreground text-sm">{note}</p>
				</div>
			}
			open={open}
			onClose={onClose}
		/>
	);
}
