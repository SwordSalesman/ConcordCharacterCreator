import useFormContext from "@/hooks/use-form-context";
import { Modal } from "./Modal";
import { ApprovalReport } from "../ApprovalReport/ApprovalReport";

export function ApprovalModal({ open, onClose }: { open: boolean; onClose: () => void }) {
	const {
		approval,
		form: { date },
	} = useFormContext();

	return (
		<Modal
			body={<ApprovalReport approval={approval} dateSubmitted={date} />}
			open={open}
			onClose={onClose}
		/>
	);
}
