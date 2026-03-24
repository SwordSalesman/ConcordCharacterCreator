import { useEffect, useState } from "react";
import { TextArea } from "../common/Input/Input";
import { Button } from "../common/Button/Button";
import useUserContext from "../../hooks/use-user-context";
import { saveApproval } from "../../hooks/use-firebase";
import toast from "react-hot-toast";
import { APPROVED, DENIED } from "../../utils/constants";
import { prettifyDate } from "../../utils/date-helper";
import { ApprovalRecord, Character } from "./types";
import { cn } from "@/lib/utils";

interface Props {
	character: Character | null;
	handleApproval: (approval: ApprovalRecord) => void;
}

function ApprovalPanel({ character, handleApproval }: Props) {
	const [loading, setLoading] = useState(false);
	const [author, setAuthor] = useState("");
	const [date, setDate] = useState("");
	const [comment, setComment] = useState("");
	const [status, setStatus] = useState<string | null>(null);
	const { name } = useUserContext();
	const [validInputs, setValidInputs] = useState({
		validStatus: true,
		validComment: true,
	});

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const valid = validateInputs();
		if (!valid) return;

		setLoading(true);
		toast.promise(saveApproval(name, comment, status!, character!.id), {
			success: (approval) => {
				setLoading(false);
				handleApproval({ ...approval, id: character!.id });
				setAuthor(name);
				setDate(approval.date);
				return status === APPROVED ? "Approval submitted" : "Changes requested";
			},
			loading: "Submitting...",
			error: (err) => {
				setLoading(false);
				return `Failed to submit approval, ${err}`;
			},
		});
	}

	useEffect(() => {
		setComment(character?.approval?.comment ?? "");
		setStatus(character?.approval?.status ?? null);
		setAuthor(character?.approval?.author ?? "");
		setDate(character?.approval?.date ?? "");
		setValidInputs({ validStatus: true, validComment: true });
	}, [character]);

	function handleSelect(name: string) {
		if (!character || loading) return;
		setStatus(status === name ? null : name);
	}

	const validateInputs = () => {
		const validStatus = status !== null;
		const validComment = status === APPROVED || comment.length > 0;
		setValidInputs({ validStatus, validComment });
		return validStatus && validComment;
	};

	const statusOptions = [
		{ name: APPROVED, label: "Approve", icon: <p>👍</p>, activeClass: "bg-green-600 text-white" },
		{ name: DENIED, label: "Request Changes", icon: <p>👎</p>, activeClass: "bg-destructive text-white" },
	].map((s) => {
		const active = status === s.name;
		const disabled = !character || loading;
		return (
			<div
				key={s.name}
				onClick={() => handleSelect(s.name)}
				className={cn(
					"flex items-center gap-1 p-2 border border-border rounded-md leading-[1em] transition-colors",
					active ? s.activeClass : "bg-background-raised",
					disabled ? "opacity-70 cursor-default" : "cursor-pointer hover:brightness-95 dark:hover:brightness-110",
				)}
			>
				{s.icon}
				<p>{s.label}</p>
			</div>
		);
	});

	return (
		<div className="border border-border rounded-tl-[10px] rounded-tr-[10px] min-h-[270px] max-h-[50%] relative text-[0.9em] overflow-scroll overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
			<div className="w-full h-10 absolute top-[-41px] z-[3] bg-[linear-gradient(180deg,transparent_0%,var(--background)_90%)]" />
			<form className="p-[14px]" onSubmit={handleSubmit}>
				<h2 style={{ fontSize: "1.2em" }}>Approval Form</h2>

				{author && date ? (
					<i>
						{author} on {prettifyDate(date)}
					</i>
				) : (
					<i>Pending review</i>
				)}

				<div
					className={cn(
						"flex flex-row items-center gap-1.5 my-3.5 mb-2.5 w-fit rounded-md",
						!validInputs.validStatus ? "border-2 border-destructive" : "",
					)}
				>
					{statusOptions}
				</div>
				<TextArea
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					placeholder="This will be shown to the player"
					label="Comments"
					disabled={!character || loading}
					error={
						!validInputs.validComment
							? "Denied submissions should include a comment"
							: undefined
					}
				/>
				<Button style={{ marginTop: "15px" }} variant="outline" disabled={!character || loading}>
					Submit
				</Button>
			</form>
		</div>
	);
}

export default ApprovalPanel;
