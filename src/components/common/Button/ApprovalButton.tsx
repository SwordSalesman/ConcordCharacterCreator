import { useState } from "react";
import { ApprovalModal } from "../Modal/ApprovalModal";
import { getApprovalStatus } from "@/utils/approval-helper";
import useFormContext from "@/hooks/use-form-context";
import useUserContext from "@/hooks/use-user-context";
import { Button } from "./Button";
import { BiSolidBadgeCheck } from "react-icons/bi";

export function ApprovalButton() {
	const { user } = useUserContext();
	const { approval, form, loading: formLoading } = useFormContext();
	const { date } = form;
	const [showApprovalModal, setShowApprovalModal] = useState(false);

	const { submissionStatus, tickColorClass } = getApprovalStatus({
		status: approval?.status,
		submissionDate: date,
		approvalDate: approval?.date,
	});

	return (
		<>
			{user ? (
				<Button
					onClick={() => setShowApprovalModal(true)}
					spinner={formLoading}
					className="animate-in fade-in"
				>
					<div className={`flex gap-2 items-center ${tickColorClass}`}>
						<p>{submissionStatus}</p>
						<BiSolidBadgeCheck />
					</div>
				</Button>
			) : null}
			<ApprovalModal open={showApprovalModal} onClose={() => setShowApprovalModal(false)} />
		</>
	);
}
