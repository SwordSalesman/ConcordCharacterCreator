import { graces } from "@/data/tables/graces";
import { getRealmData, getSummaryFromArray } from "@/utils/data-helper";
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

	function ReviewItemWrapper(props: ReviewItemProps) {
		return (
			<div className="my-2">
				{simple ? <SimpleReviewItem {...props} /> : <ReviewItem {...props} />}
			</div>
		);
	}

	function StyledBorderWrapper() {
		return <div className="my-2">{simple ? <SimpleStyledBorder /> : <StyledBorder />}</div>;
	}

	return (
		<div>
			<div>
				<div className={simple ? "text-lg leading-1" : "text-xl"}>
					{heroName ? heroName : "Nameless Hero"}
				</div>
				<div className={"italic text-muted-foreground"}>
					{realmFull ? realmFull.citizen : "Realmless"}{" "}
					{archetype && archetype.length ? archetype : "Hero"}
				</div>
				{fullGrace && (
					<div className="italic text-muted-foreground">
						{`${fullGrace.name}, Graced by ${fullGrace.sphere}`}
					</div>
				)}
			</div>
			<StyledBorderWrapper />
			<ReviewItemWrapper label="Summits attended">{gamesPlayed}</ReviewItemWrapper>
			{investment && (
				<ReviewItemWrapper label="Investment">
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
			{(warband || sect) && <StyledBorderWrapper />}
			{warband && <ReviewItemWrapper label="Band">{warband}</ReviewItemWrapper>}
			{sect && <ReviewItemWrapper label="Sect">{sect}</ReviewItemWrapper>}
			<StyledBorderWrapper />
			<ReviewItemWrapper label="Skills">{getSummaryFromArray(skills)}</ReviewItemWrapper>
			{spells.length > 0 && (
				<ReviewItemWrapper label="Spells">{spells.join(delimiter)}</ReviewItemWrapper>
			)}
			{crafts.length > 0 && (
				<ReviewItemWrapper label="Crafts">{crafts.join(delimiter)}</ReviewItemWrapper>
			)}
			{startingItem && (
				<ReviewItemWrapper label="Starting Item">{startingItem}</ReviewItemWrapper>
			)}
			{potions.length > 0 && (
				<ReviewItemWrapper label="Potions">{potions.join(delimiter)}</ReviewItemWrapper>
			)}
			{ceremonies.length > 0 && (
				<ReviewItemWrapper label="Ceremonies">
					{ceremonies.join(delimiter)}
				</ReviewItemWrapper>
			)}
			{fullReview && (
				<>
					<StyledBorderWrapper />
					{backstory && (
						<ReviewItemWrapper label="Backstory">{backstory}</ReviewItemWrapper>
					)}
					{icGoals && <ReviewItemWrapper label="IC Goals">{icGoals}</ReviewItemWrapper>}
					{oocGoals && (
						<ReviewItemWrapper label="OOC Goals">{oocGoals}</ReviewItemWrapper>
					)}
					{invDetails && (
						<ReviewItemWrapper label="Investment Details">
							{invDetails}
						</ReviewItemWrapper>
					)}
				</>
			)}
		</div>
	);
}
