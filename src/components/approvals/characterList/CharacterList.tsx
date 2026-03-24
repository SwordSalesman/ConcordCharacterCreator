import { PENDING } from "../../../utils/constants";
import { prettifyDate } from "../../../utils/date-helper";
import { Character } from "../types";
import { cn } from "@/lib/utils";

interface Props {
	characters: Character[];
	handleSelect: (character: Character) => void;
	activeCharacter: Character | null;
}

function CharacterList({ characters, handleSelect, activeCharacter }: Props) {
	const renderedList =
		characters.length > 0
			? characters.map((c, i) => {
					const active =
						activeCharacter?.heroName === c.heroName &&
						activeCharacter?.email === c.email;
					return (
						<li
							key={i}
							onClick={() => handleSelect(c)}
							className={cn(
								"p-2 border-b border-border cursor-pointer leading-[1em] text-[0.9em] overflow-hidden flex justify-between flex-col relative hover:brightness-95 dark:hover:brightness-110",
								active ? "bg-background-300" : "bg-background",
							)}
						>
							<div className="relative break-all overflow-hidden h-[1em]">
								<div
									className={cn(
										"h-full w-[90px] absolute right-0 z-[2]",
										active
											? "bg-[linear-gradient(90deg,transparent_0%,var(--background-300)_30%)]"
											: "bg-[linear-gradient(90deg,transparent_0%,var(--background)_30%)]",
									)}
								/>
								<b>{c.heroName}</b>
							</div>
							<div className="flex justify-between items-center text-[0.8em] italic">
								<p>{`${prettifyDate(c.date, {
									hideTime: true,
									shortDate: false,
								})} ~ ${c.player}`}</p>
							</div>
							<div className="absolute text-[0.8em] top-[7px] right-[8px] z-[4]">
								{c.approval?.status ?? PENDING}
							</div>
						</li>
					);
			  })
			: null;

	return (
		<ul className="overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
			{renderedList}
		</ul>
	);
}

export default CharacterList;
