import useFormContext from "../../../hooks/use-form-context";
import { xpWarning } from "../../../utils/validity-helper";
import { graces } from "@/data/tables/graces";
import { Warning } from "@/components/common/Accordion/AccordionSection";
import { Input, TextArea } from "@/components/common/Input/Input";
import { getRealmData, getSummaryFromArray } from "@/utils/data-helper";
import { ContentPane } from "@/components/creator/ContentPane/ContentPane";

function ReviewItem({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="w-full flex flex-col justify-between text-center">
			<div className="text-muted-foreground text-[0.8rem] leading-[0.8rem]">{label}</div>
			<div className="text-foreground leading-[1.2rem] text-wrap-balance">{children}</div>
		</div>
	);
}

const delimiter = ", ";

export function ReviewPage() {
	const { form, setField, validateForm, remaining } = useFormContext();
	const {
		gamesPlayed,
		realm,
		skills,
		investment,
		invTier,
		invOption,
		invDiversify,
		invRegion,
		invTerritory,
		spells,
		crafts,
		potions,
		ceremonies,
		startingItem,
		heroName,
		archetype,
		grace,
		warband,
		sect,
		comments,
	} = form;
	const realmFull = realm ? getRealmData(realm) : undefined;
	const { valid, validRealm, validName, validInvestment } = validateForm();

	// This simple check avoids the page crashing during a log in form reset
	if (!spells || !crafts || !potions || !ceremonies) {
		return;
	}

	console.debug("Player form:");
	console.debug(form);

	const invalidWarning = (
		<div className="text-destructive italic mb-2.5 text-center">
			<p>Required fields:</p>
			<ul>
				{!validName ? <li>Hero Name</li> : null}
				{!validRealm ? <li>Realm</li> : null}
				{!validInvestment ? <li>Investment</li> : null}
			</ul>
		</div>
	);
	const xpWarningText = xpWarning(remaining.xp);

	const fullGrace = grace ? graces.find((g) => g.name === grace) : undefined;

	return (
		<div className="flex flex-col items-center gap-[60px] w-[450px] max-w-[95vw]">
			<div className="flex justify-center leading-[1.1rem] w-full min-w-[300px] min-[600px]:min-w-[400px]">
				<ContentPane>
					{!valid ? invalidWarning : null}
					{xpWarningText && <Warning>{xpWarningText}</Warning>}
					<div className="flex flex-col items-center mt-2 gap-2 mb-6">
						<div>
							<h2 className="text-xl leading-6">
								{heroName ? heroName : "Nameless Hero"}
							</h2>
							<div className="italic text-muted-foreground">
								{realmFull ? realmFull.citizen : "Realmless"}
								{archetype ? " " + archetype : ""}
							</div>
							{fullGrace && (
								<div className="italic text-muted-foreground">
									{`${fullGrace.name}, Graced by ${fullGrace.sphere}`}
								</div>
							)}
						</div>
						<StyledBorder />
						<ReviewItem label="Summits attended">{gamesPlayed}</ReviewItem>
						{investment && (
							<ReviewItem label="Investment">
								{`Tier ${invTier} `}
								{invOption ? `${invOption} ` : ""}
								{investment ? investment : ""}
								{invTerritory ? ` in ${invTerritory}` : ""}
								{invRegion ? `, ${invRegion}` : ""}
								{invDiversify?.length ? (
									<>
										<br />
										{`Diversifying in ${getSummaryFromArray(invDiversify)}`}
									</>
								) : (
									""
								)}
							</ReviewItem>
						)}
						{(warband || sect) && <StyledBorder />}
						{warband && <ReviewItem label="Band">{warband}</ReviewItem>}
						{sect && <ReviewItem label="Sect">{sect}</ReviewItem>}
						<StyledBorder />
						<ReviewItem label="Skills">{getSummaryFromArray(skills)}</ReviewItem>
						{spells.length > 0 && (
							<ReviewItem label="Spells">{spells.join(delimiter)}</ReviewItem>
						)}
						{crafts.length > 0 && (
							<ReviewItem label="Crafts">{crafts.join(delimiter)}</ReviewItem>
						)}
						{startingItem && (
							<ReviewItem label="Starting Item">{startingItem}</ReviewItem>
						)}
						{potions.length > 0 && (
							<ReviewItem label="Potions">{potions.join(delimiter)}</ReviewItem>
						)}
						{ceremonies.length > 0 && (
							<ReviewItem label="Ceremonies">{ceremonies.join(delimiter)}</ReviewItem>
						)}
					</div>
					<div className="rounded-[12px] px-2 [&_div_textarea]:border [&_div_textarea]:border-border [&_div_textarea]:border-solid">
						<div className="flex flex-col gap-2 w-full my-4">
							<TextArea
								value={comments}
								onChange={(e) => setField("comments", e.target.value)}
								title={"Final submission comments"}
								placeholder="Notes for the team (if any)"
							/>
						</div>
					</div>
				</ContentPane>
			</div>
		</div>
	);
}

function StyledBorder() {
	return (
		<div className="w-full h-px bg-[linear-gradient(90deg,transparent_0%,var(--border)_50%,transparent_100%)]" />
	);
}
