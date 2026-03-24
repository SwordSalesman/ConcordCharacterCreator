import { BiChevronDown } from "react-icons/bi";
import { Button } from "../common/Button/Button";
import { APPROVED, DENIED, PENDING } from "../../utils/constants";
import { cn } from "@/lib/utils";

interface Counts {
	pending: number;
	approved: number;
	denied: number;
	total: number;
}

interface Props {
	dateOrder: boolean;
	toggleDateOrder: () => void;
	filter: string | null;
	selectFilter: (filter: string) => void;
	counts: Counts;
}

function ListFilter({ dateOrder, toggleDateOrder, filter, selectFilter, counts }: Props) {
	return (
		<div className="px-2.5 py-1.5 border-b border-border flex justify-between items-center sticky top-0 z-[6] bg-background-raised">
			<div
				className="flex justify-between items-center gap-1 cursor-pointer"
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
			<div className="flex justify-between items-center text-[0.9em]">
				<Button
					variant={filter === PENDING ? "primary" : "secondary"}
					onClick={() => selectFilter(PENDING)}
				>
					👀 {counts.pending}
				</Button>
				<Button
					variant={filter === APPROVED ? "primary" : "secondary"}
					onClick={() => selectFilter(APPROVED)}
				>
					👍 {counts.approved}
				</Button>
				<Button
					variant={filter === DENIED ? "primary" : "secondary"}
					onClick={() => selectFilter(DENIED)}
				>
					👎 {counts.denied}
				</Button>
			</div>
		</div>
	);
}

export default ListFilter;
