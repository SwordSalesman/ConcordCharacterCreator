import { BiChevronDown } from "react-icons/bi";
import { Button } from "../common/Button/Button";
import { APPROVED, ARCHIVED, DENIED, PENDING } from "../../utils/constants";
import { cn } from "@/lib/utils";
import { Counts } from "./Approvals";

interface Props {
	dateOrder: boolean;
	toggleDateOrder: () => void;
	filter: string | null;
	selectFilter: (filter: string) => void;
	counts: Counts;
}

function ListFilter({ dateOrder, toggleDateOrder, filter, selectFilter, counts }: Props) {
	return (
		<div className="p-1.5 border-b border-border flex justify-between items-center sticky top-0 z-[6] bg-background-raised">
			<div className="grid grid-cols-4 items-center gap-0.5">
				<Button
					variant={filter === PENDING ? "primary" : "secondary"}
					onClick={() => selectFilter(PENDING)}
					size="sm"
				>
					👀 {counts.pending}
				</Button>
				<Button
					variant={filter === APPROVED ? "primary" : "secondary"}
					onClick={() => selectFilter(APPROVED)}
					size="sm"
				>
					👍 {counts.approved}
				</Button>
				<Button
					variant={filter === DENIED ? "primary" : "secondary"}
					onClick={() => selectFilter(DENIED)}
					size="sm"
				>
					👎 {counts.denied}
				</Button>
				<Button
					variant={filter === ARCHIVED ? "primary" : "secondary"}
					onClick={() => selectFilter(ARCHIVED)}
					size="sm"
				>
					🗑️
				</Button>
			</div>
			<div
				className="flex justify-between items-center cursor-pointer text-sm"
				onClick={toggleDateOrder}
			>
				<p>Date</p>
				<div
					className={cn(
						"transition-transform duration-300",
						!dateOrder ? "rotate-180" : "rotate-0",
					)}
				>
					<BiChevronDown size={20} />
				</div>
			</div>
		</div>
	);
}

export default ListFilter;
