import { graces } from "@/data/tables/graces";
import {
	getRealmData,
	getSkillSummaryFromArray,
	getSummaryFromArray,
	stringToNode,
} from "@/utils/data-helper";
import { FormState } from "@/context/formContext";

/* The 'simple' version of these components are used for rendering the email content
 */

interface ReviewItemProps {
	label: string;
	children: React.ReactNode;
}

export function ReviewItem({ label, children }: ReviewItemProps) {
	return (
		<div>
			<div className="text-muted-foreground text-sm leading-[0.8rem]">{label}</div>
			<div className="text-foreground">{children ?? "None provided."}</div>
		</div>
	);
}

function SimpleReviewItem({ label, children }: ReviewItemProps) {
	return (
		<div>
			<div className="text-2xs font-bold">{label}</div>
			<div className="text-xs">{children ?? "None provided."}</div>
		</div>
	);
}

export function StyledBorder() {
	return (
		<div className="w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
	);
}

function SimpleStyledBorder() {
	return <></>;
}

function ReviewItemWrapper({
	simple,
	...props
}: ReviewItemProps & { simple: boolean }) {
	return (
		<div className="my-2">
			{simple ? <SimpleReviewItem {...props} /> : <ReviewItem {...props} />}
		</div>
	);
}

function StyledBorderWrapper({ simple }: { simple: boolean }) {
	return <div className="my-2">{simple ? <SimpleStyledBorder /> : <StyledBorder />}</div>;
}

const delimiter = ", ";

export function CharacterSheet({
	data,
	simple,
	full,
}: {
	data: FormState;
	simple?: boolean;
	full?: boolean;
}) {
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
		backstory,
		invDetails,
		icGoals,
		oocGoals,
	} = data;

	const realmFull = realm ? getRealmData(realm) : undefined;
	const fullGrace = grace ? graces.find((g) => g.name === grace) : undefined;
	const fullReview = full ?? false;

	if (!spells || !crafts || !potions || !ceremonies) {
		return null;
	}

	return (
		<div>
			<div>
				<div className={simple ? "text-lg leading-1" : "text-xl"}>
					{heroName ? heroName : "Nameless Hero"}
				</div>
				<div className={"italic text-muted-foreground"}>
					{realmFull ? realmFull.citizen : "Realmless"}{" "}
					{archetype && archetype.length
						? archetype
						: realm === "Civil Service"
							? ""
							: "Hero"}
				</div>
				{fullGrace && (
					<div className="italic text-muted-foreground">
						{`${fullGrace.name}, Graced by ${fullGrace.sphere}`}
					</div>
				)}
			</div>
			<StyledBorderWrapper simple={simple ?? false} />
			<ReviewItemWrapper simple={simple ?? false} label="Summits attended">{gamesPlayed}</ReviewItemWrapper>
			{investment && (
				<ReviewItemWrapper simple={simple ?? false} label="Investment">
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
				</ReviewItemWrapper>
			)}
			{invTier === 0 ? (
				<ReviewItemWrapper simple={simple ?? false} label="Investment">
					<i>Lost or destroyed</i>
				</ReviewItemWrapper>
			) : null}
			{(warband || sect) && <StyledBorderWrapper simple={simple ?? false} />}
			{warband && <ReviewItemWrapper simple={simple ?? false} label="Band">{warband}</ReviewItemWrapper>}
			{sect && <ReviewItemWrapper simple={simple ?? false} label="Sect">{sect}</ReviewItemWrapper>}
			<StyledBorderWrapper simple={simple ?? false} />
			<ReviewItemWrapper simple={simple ?? false} label="Skills">
				{getSkillSummaryFromArray(skills)}
			</ReviewItemWrapper>
			{spells.length > 0 && (
				<ReviewItemWrapper simple={simple ?? false} label="Spells">{spells.join(delimiter)}</ReviewItemWrapper>
			)}
			{crafts.length > 0 && (
				<ReviewItemWrapper simple={simple ?? false} label="Crafts">{crafts.join(delimiter)}</ReviewItemWrapper>
			)}
			{startingItem && (
				<ReviewItemWrapper simple={simple ?? false} label="Starting Item">{startingItem}</ReviewItemWrapper>
			)}
			{potions.length > 0 && (
				<ReviewItemWrapper simple={simple ?? false} label="Potions">{potions.join(delimiter)}</ReviewItemWrapper>
			)}
			{ceremonies.length > 0 && (
				<ReviewItemWrapper simple={simple ?? false} label="Ceremonies">
					{ceremonies.join(delimiter)}
				</ReviewItemWrapper>
			)}
			{fullReview && (
				<>
					<StyledBorderWrapper simple={simple ?? false} />
					{backstory && (
						<ReviewItemWrapper simple={simple ?? false} label="Backstory">
							{stringToNode(backstory)}
						</ReviewItemWrapper>
					)}
					{icGoals && (
						<ReviewItemWrapper simple={simple ?? false} label="IC Goals">
							{stringToNode(icGoals)}
						</ReviewItemWrapper>
					)}
					{oocGoals && (
						<ReviewItemWrapper simple={simple ?? false} label="OOC Goals">
							{stringToNode(oocGoals)}
						</ReviewItemWrapper>
					)}
					{invDetails && (
						<ReviewItemWrapper simple={simple ?? false} label="Investment Details">
							{stringToNode(invDetails)}
						</ReviewItemWrapper>
					)}
				</>
			)}
		</div>
	);
}
