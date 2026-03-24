import { APPROVED, DENIED } from "./constants";

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
		tickColorClass = "text-contrast";
		submissionStatus = "Awaiting Review";
	} else if (status === DENIED) {
		tickColorClass = "text-destructive";
		submissionStatus = "Changes Requested";
	} else if (status === APPROVED) {
		tickColorClass = "text-contrast";
		submissionStatus = "Approved";
	}

	if (!submissionDate) {
		tickColorClass = "text-muted-foreground";
	} else {
		if (status === APPROVED) {
			tickColorClass = "text-green-600 dark:text-green-400";
		} else if (status === DENIED) {
			tickColorClass = "text-destructive";
		}
	}

	return { submissionStatus, tickColorClass };
}
