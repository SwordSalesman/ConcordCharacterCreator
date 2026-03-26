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
	}

	if (!submissionDate) {
		tickColorClass = "text-muted-foreground";
	} else {
		if (status === APPROVED) {
			tickColorClass = "success";
		} else if (status === DENIED) {
			tickColorClass = "destructive";
		}
	}

	return { submissionStatus, tickColorClass };
}
