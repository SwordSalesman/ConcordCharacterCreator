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
	let tickColorClass = "text-muted-foreground";
	let submissionStatus = "Not Submitted";
	if (submissionDate && (!approvalDate || approvalDate < submissionDate)) {
		tickColorClass = "text-muted-foreground";
		submissionStatus = "Awaiting Review";
	} else if (status === DENIED) {
		tickColorClass = "text-destructive";
		submissionStatus = "Changes Requested";
	} else if (status === APPROVED) {
		tickColorClass = "text-success";
		submissionStatus = "Approved";
	} else if (status === ARCHIVED) {
		tickColorClass = "text-muted-foreground";
		submissionStatus = "Archived";
	}

	if (!submissionDate) {
		tickColorClass = "text-muted-foreground";
	} else {
		if (status === APPROVED) {
			tickColorClass = "text-success";
		} else if (status === DENIED) {
			tickColorClass = "text-destructive";
		}
	}

	return { submissionStatus, tickColorClass };
}
