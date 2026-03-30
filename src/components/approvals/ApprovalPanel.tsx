import { useEffect, useState } from "react";
import { TextArea } from "../common/Input/Input";
import { Button } from "../common/Button/Button";
import useUserContext from "../../hooks/use-user-context";
import { saveApproval } from "../../hooks/use-firebase";
import toast from "react-hot-toast";
import { APPROVED, ARCHIVED, DENIED } from "../../utils/constants";
import { prettifyDate } from "../../utils/date-helper";
import { ApprovalRecord, Character } from "./types";
import { cn } from "@/lib/utils";
import { stringToNode } from "@/utils/data-helper";

interface Props {
	character: Character | null;
	handleApproval: (approval: ApprovalRecord) => void;
}

function ApprovalPanel({ character, handleApproval }: Props) {
	const [loading, setLoading] = useState(false);
	const [author, setAuthor] = useState("");
	const [date, setDate] = useState("");
	const [comment, setComment] = useState("");
	const [previousComment, setPreviousComment] = useState("");
	const [previousStatus, setPreviousStatus] = useState("");
	const [status, setStatus] = useState<string | null>(null);
	const { name } = useUserContext();
	const [validInputs, setValidInputs] = useState({
		validStatus: true,
		validComment: true,
	});
	const disabled = !character || loading;
	const [archiveConfirm, setArchiveConfirm] = useState(false);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const valid = validateInputs();
		if (!valid) return;
		if (!status) return;

		setLoading(true);
		toast.promise(
			saveApproval({
				name,
				comment,
				status: status || "",
				subjectUid: character!.id,
			}),
			{
				success: (approval) => {
					setLoading(false);
					handleApproval({ ...approval, id: character!.id });
					setAuthor(name);
					setDate(approval.date);

					switch (approval.status) {
						case APPROVED:
							return "Approval submitted";
						case DENIED:
							return "Changes requested";
						case ARCHIVED:
							return "Character archived";
						default:
							return "Unexpected status. Verify approval.";
					}
				},
				loading: "Submitting...",
				error: (err) => {
					setLoading(false);
					return `Failed to submit approval, ${err}`;
				},
			},
		);
	}

	useEffect(() => {
		setPreviousComment(character?.approval?.comment ?? "");
		setPreviousStatus(character?.approval?.status ?? "");
		setComment("");
		setStatus(null);
		setAuthor(character?.approval?.author ?? "");
		setDate(character?.approval?.date ?? "");
		setValidInputs({ validStatus: true, validComment: true });
	}, [character]);

	const validateInputs = () => {
		const validStatus = status !== null;
		const validComment = status === APPROVED || comment.length > 0;
		setValidInputs({ validStatus, validComment });
		return validStatus && validComment;
	};

	const approvalOptions = [
		{
			status: APPROVED,
			label: "Approved",
			icon: <p>👍</p>,
			activeClass: "bg-green-600! text-white!",
		},
		{
			status: DENIED,
			label: "Changed Requested",
			icon: <p>👎</p>,
			activeClass: "bg-destructive! text-white!",
		},
		{
			status: ARCHIVED,
			label: "Archived",
			icon: <p>🗑️</p>,
			activeClass: "bg-primary! text-white!",
		},
	].map((s) => {
		const active = status === s.status;
		return (
			<Button
				key={s.status}
				onClick={(e) => {
					e.preventDefault();
					setStatus(status === s.status ? null : s.status);
				}}
				size="sm"
				disabled={disabled}
				className={active ? s.activeClass : ""}
			>
				{s.icon}
				<p>{s.label}</p>
			</Button>
		);
	});

	return (
		<div className="relative">
			{/* Gradient fade effect above the panel */}
			<div className="w-full h-10 absolute -top-8 bg-gradient-to-t from-background-raised to-transparent" />
			<div
				className="border rounded-tl-lg rounded-tr-lg h-[100%] max-h-[450px] relative overflow-scroll
			text-sm p-3 flex flex-col gap-5 z-1 bg-background
			[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
			>
				{author && date ? (
					<div>
						<h2 className="text-lg font-bold">Previous Approval</h2>
						<p>
							{previousStatus === APPROVED
								? "Approved"
								: previousStatus === DENIED
									? "Changes Requested"
									: "Archived"}{" "}
							by {author} on {prettifyDate(date)}:
						</p>
						<blockquote className={`pl-2 border-l-4 border-primary italic`}>
							{previousComment ? (
								stringToNode(previousComment)
							) : (
								<i className="text-muted-foreground">No comment</i>
							)}
						</blockquote>
					</div>
				) : (
					<i>This submission has not yet been reviewed</i>
				)}
				<form className="gap-1 flex flex-col" onSubmit={handleSubmit}>
					<h2 className="text-lg font-bold">Approval Form</h2>

					<div
						className={cn(
							"flex flex-col items-left sm:flex-row sm:justify-between gap-1 rounded-md",
							!validInputs.validStatus ? "p-1 border-1 border-destructive" : "",
						)}
					>
						<div className="flex flex-row gap-1">
							{approvalOptions[0]}
							{approvalOptions[1]}
						</div>
						<div>{approvalOptions[2]}</div>
					</div>
					<TextArea
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						placeholder="This will be shown to the player"
						label="Comments"
						disabled={disabled}
						error={
							!validInputs.validComment
								? "Denied or archived submissions should include a comment"
								: undefined
						}
					/>
					<div className="mt-2">
						<Button variant="outline" disabled={disabled}>
							Submit
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default ApprovalPanel;
