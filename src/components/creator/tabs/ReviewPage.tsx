import useFormContext from "../../../hooks/use-form-context";

import { xpWarning } from "../../../utils/validity-helper";

import { graces } from "@/data/tables/graces";

function ReviewItem({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<ReviewSection>
			<ReviewHeader>{label}</ReviewHeader>
			<ReviewContent>{children}</ReviewContent>
		</ReviewSection>
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
		<InvalidWarning>
			<p>Required fields:</p>
			<ul>
				{!validName ? <li>Hero Name</li> : null}
				{!validRealm ? <li>Realm</li> : null}
				{!validInvestment ? <li>Investment</li> : null}
			</ul>
		</InvalidWarning>
	);
	const xpWarningText = xpWarning(remaining.xp);

	const fullGrace = grace ? graces.find((g) => g.name === grace) : undefined;

	return (
		<ReviewPageWrapper>
			<ReviewPaneWrapper>
				<ContentPane mobileshow>
					{!valid ? invalidWarning : null}
					{xpWarningText && <Warning>{xpWarningText}</Warning>}
					<div className="flex flex-col items-center mt-2 gap-2 mb-6">
						<div>
							<h2 className="text-xl leading-6">
								{heroName ? heroName : "Nameless Hero"}
							</h2>
							<ReviewSubtitles>
								{realmFull ? realmFull.citizen : "Realmless"}
								{archetype ? " " + archetype : ""}
							</ReviewSubtitles>
							{fullGrace && (
								<ReviewSubtitles>
									{`${fullGrace.name}, Graced by ${fullGrace.sphere}`}
								</ReviewSubtitles>
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
					<LightBorder>
						<div className="flex flex-col gap-2 w-full my-4">
							<Input
								type="text"
								value={comments}
								onChange={(e) => setField("comments", e.target.value)}
								title={"Final submission comments"}
								placeholder="Notes for the team (if any)"
							/>
						</div>
					</LightBorder>
				</ContentPane>
			</ReviewPaneWrapper>
			{/* <ReviewReminder>Don't forget to submit!</ReviewReminder> */}
		</ReviewPageWrapper>
	);
}

import { styled } from "styled-components";
import { Warning } from "@/components/common/Accordion/AccordionSection";
import { Input } from "@/components/common/Input/Input";
import { getRealmData, getSummaryFromArray } from "@/utils/data-helper";
import { ContentPane } from "@/components/common/ContentPane/ContentPane";

export const ReviewPageWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 60px;
	width: 100%;
	padding: 0 10%;
`;

export const ReviewPaneWrapper = styled.div`
	display: flex;
	justify-content: center;
	line-height: 1.1rem;
	width: 100%;
	min-width: 300px;
	@media screen and (min-width: 600px) {
		min-width: 400px;
	}
`;

export const ReviewReminder = styled.p`
	font-style: italic;
	font-size: 0.8rem;
	opacity: 0.7;
`;

// "w-full h-[2px] m-1 bg-gradient-to-r from-transparent via-gray-500 to-transparent"
export const StyledBorder = styled.div`
	width: 100%;
	height: 1px;
	background: ${(props) => props.theme.border};
	background: linear-gradient(
		90deg,
		rgba(0, 0, 0, 0) 0%,
		${(props) => props.theme.border} 50%,
		rgba(0, 0, 0, 0) 100%
	);
`;

export const ReviewSubtitles = styled.div`
	font-style: italic;
	color: ${(props) => props.theme.textSoft};
`;

export const ReviewHeader = styled.div`
	color: ${(props) => props.theme.textSoft};
	font-size: 0.8rem;
	line-height: 0.8rem;
`;

export const ReviewSection = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	text-align: center;
`;

export const ReviewContent = styled.div`
	color: ${(props) => props.theme.textStrong};
	line-height: 1.2rem;
	text-wrap: balance;
`;

export const InvalidWarning = styled.div`
	color: ${(props) => props.theme.error};
	font-style: italic;
	margin-bottom: 10px;
	text-align: center;
`;

export const LightBorder = styled.div`
	border-radius: 12px;
	padding: 0 8px;

	div textarea {
		border: solid 1px ${(props) => props.theme.border};
	}
`;
