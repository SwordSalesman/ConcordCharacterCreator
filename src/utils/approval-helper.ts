import { SubmissionStatus } from "@/components/approvals/types";
import { APPROVED, ARCHIVED, DENIED } from "./constants";

export function getApprovalStatus({
	status,
	submissionDate,
	approvalDate,
}: {
	status?: string;
	submissionDate?: string;
	approvalDate?: string;
}) {
	let tickColorClass = "muted-foreground";
	let submissionStatus: SubmissionStatus = "Not Submitted";

	if (submissionDate && (!approvalDate || approvalDate < submissionDate)) {
		tickColorClass = "muted-foreground";
		submissionStatus = "Awaiting Review";
	} else if (status === DENIED) {
		tickColorClass = "destructive";
		submissionStatus = "Changes Requested";
	} else if (status === APPROVED) {
		tickColorClass = "success";
		submissionStatus = "Approved";
	} else if (status === ARCHIVED) {
		tickColorClass = "muted-foreground";
		submissionStatus = "Archived";
	} else if (!submissionDate) {
		tickColorClass = "muted-foreground";
	}

	return { submissionStatus, tickColorClass };
}
