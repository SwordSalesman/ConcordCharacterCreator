import { Button } from "../../../components/common/Button/Button";
import { GiSpellBook } from "react-icons/gi";
import { GameContext } from "@/herb-garden/context/gameContext";
import { displayNumber } from "@/herb-garden/helpers/displayValueHelper";
import { useContext, useState } from "react";
import { useAnimation } from "@/herb-garden/context/animationContext";
import { CEREMONIES, CEREMONY_IDS } from "../data/ceremonies";
import { CRYSTAL_MANA_EMOJI } from "../data/gameData";
import { CeremoniesMenu } from "./CeremoniesMenu";
import { cn } from "@/lib/utils";
import { getHighLowHue, HighLowHueTextWrapper } from "@/herb-garden/helpers/hueHelper";
import { NewWrapper } from "../NewWrapper";
import { TutorialContext } from "@/herb-garden/context/tutorialContext";

export default function Church() {
	const {
		canPray,
		pray,
		crystalMana,
		activeCeremonyId,
		unlockedCeremonies,
		maxCrystalMana,
		castCeremony,
		canCastCeremony,
		activeCeremonyRemainingMs,
		ceremonyDurationMs,
	} = useContext(GameContext);
	const { tutorialSettings } = useContext(TutorialContext);
	const { registerAnchor } = useAnimation();
	const [showCeremoniesMenu, setShowCeremoniesMenu] = useState(false);

	const displayedCeremonyIds = [
		...CEREMONY_IDS.filter((ceremonyId) => unlockedCeremonies[ceremonyId]),
	];

	const moreCeremoniesToLearn = CEREMONY_IDS.some(
		(ceremonyId) => !unlockedCeremonies[ceremonyId],
	);

	return (
		<div className="flex flex-col gap-4">
			<button
				ref={registerAnchor("mana")}
				tabIndex={-1}
				className="flex items-center gap-2 select-none pt-2 px-5 mx-auto"
			>
				<span>{CRYSTAL_MANA_EMOJI}</span>
				<span className="font-mono flex">
					<div
						className={
							crystalMana >= maxCrystalMana ? "animate-wiggle duration-300" : ""
						}
					>
						{displayNumber(crystalMana)}
					</div>
					<span className="text-muted-foreground opacity-80">
						/{displayNumber(maxCrystalMana)}
					</span>
				</span>
			</button>
			<div className="flex flex-col gap-0">
				{displayedCeremonyIds.map((id) => {
					const active = activeCeremonyId === id;
					const hue = getHighLowHue(activeCeremonyRemainingMs, 0, ceremonyDurationMs);
					return (
						<div
							key={id}
							className="flex-1 flex relative overflow-hidden p-0.5 rounded-md duration-100 hover:scale-103 active:scale-98"
						>
							{active && (
								<div
									className={cn(
										"absolute -inset-0.5 blur rounded-md -z-2",
										"bg-contrast",
										"animate-slow-spin",
									)}
									style={{ "--value-hue": hue } as React.CSSProperties}
								></div>
							)}
							<Button
								className="flex-1 h-fit -z-1 duration-200"
								ref={registerAnchor(`pray:${id}`)}
								onClick={() => (active ? pray() : castCeremony(id))}
								disabled={active ? !canPray() : !canCastCeremony(id)}
							>
								<div className="flex relative justify-between w-full gap-3">
									<div className="flex flex-col text-left gap-0 w-full">
										<span>{CEREMONIES[id].name}</span>
										<span className="text-sm/4 text-muted-foreground w-full text-left text-wrap">
											{CEREMONIES[id].description}
										</span>
									</div>
									{active ? (
										<div className="flex flex-col items-end gap-0 animate-in fade-in">
											<HighLowHueTextWrapper
												value={activeCeremonyRemainingMs}
												minValue={0}
												maxValue={ceremonyDurationMs}
											>
												<span className="font-mono">
													{Math.ceil(activeCeremonyRemainingMs / 1000)}s
												</span>
											</HighLowHueTextWrapper>
											<span className="text-muted-foreground leading-4">
												Click to pray
											</span>
										</div>
									) : (
										<div className="font-mono flex items-center gap-1 animate-in fade-in">
											<span>{displayNumber(CEREMONIES[id].manaCost)}</span>
											<span>{CRYSTAL_MANA_EMOJI}</span>
										</div>
									)}
								</div>
							</Button>
						</div>
					);
				})}
			</div>
			{moreCeremoniesToLearn && (
				<div className="flex justify-center">
					<NewWrapper
						isNew={tutorialSettings.showTutorial && displayedCeremonyIds.length === 0}
					>
						<Button onClick={() => setShowCeremoniesMenu(true)} variant="outline">
							<GiSpellBook size={60} />
							Learn Ceremony
						</Button>
					</NewWrapper>
				</div>
			)}
			<CeremoniesMenu
				open={showCeremoniesMenu}
				onClose={() => setShowCeremoniesMenu(false)}
			/>
		</div>
	);
}
