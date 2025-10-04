import { useTheme } from "styled-components";
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
	const theme = useTheme();

	let tickColor = theme.textSoft;
	let submissionStatus = "Not Submitted";
	if (submissionDate && (!approvalDate || approvalDate < submissionDate)) {
		tickColor = theme.warning;
		submissionStatus = "Awaiting Review";
	} else if (status === DENIED) {
		tickColor = theme.error;
		submissionStatus = "Changes Requested";
	} else if (status === APPROVED) {
		tickColor = theme.warning;
		submissionStatus = "Approved";
	}

	if (!submissionDate) {
		tickColor = theme.textSoft;
	} else {
		if (status === APPROVED) {
			tickColor = theme.success;
		} else if (status === DENIED) {
			tickColor = theme.error;
		}
	}

	return { submissionStatus, tickColor };
}
