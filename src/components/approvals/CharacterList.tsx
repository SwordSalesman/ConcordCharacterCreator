import { PENDING } from "../../utils/constants";
import { prettifyDate } from "../../utils/date-helper";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { Character } from "./types";
import { cn } from "@/lib/utils";
import { ManagerListItem } from "@/components/manager/Manager";

interface Props {
	characters: Character[];
	handleSelect: (character: Character) => void;
	activeCharacter: Character | null;
	loading: boolean;
}

function CharacterList({ characters, handleSelect, activeCharacter, loading }: Props) {
	const renderedList =
		characters.length > 0
			? characters.map((c, i) => {
					const active =
						activeCharacter?.heroName === c.heroName &&
						activeCharacter?.email === c.email;
					return (
						<ManagerListItem key={i} onClick={() => handleSelect(c)} active={active}>
							<div className="relative break-all h-5 overflow-hidden w-[80%]">
								<div
									className={cn(
										"h-full w-[50px] absolute right-0 z-[2]",
										`bg-gradient-to-r from-transparent ${active ? "to-background-300" : "to-background"}`,
									)}
								/>
								<b>{c.heroName}</b>
							</div>
							<div className="flex justify-between items-center text-xs italic">
								<p>{`${prettifyDate(c.date, {
									hideTime: true,
									shortDate: false,
								})} ~ ${c.player}`}</p>
							</div>
							<div className="absolute text-xs top-2 right-3 z-4">
								{c.approval?.status ?? PENDING}
							</div>
						</ManagerListItem>
					);
				})
			: null;

	return (
		<>
			{loading ? (
				<div className="mt-12">
					<LoadingSpinner />
				</div>
			) : (
				(renderedList ?? (
					<p className="text-center mt-12 text-sm italic">No characters found</p>
				))
			)}
		</>
	);
}

export default CharacterList;
