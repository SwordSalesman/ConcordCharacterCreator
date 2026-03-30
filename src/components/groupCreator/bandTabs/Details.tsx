import useFormContext from "../../../hooks/use-form-context";
import { ContentPane } from "@/components/creator/ContentPane/ContentPane";
import { Input, TextArea } from "@/components/common/Input/Input";
import useGroupContext from "@/hooks/use-group-context";
import { Chip } from "@/components/common/Chip/Chip";
import { realmicPlayerGroupsLink } from "@/utils/odd-jobs";
import WikiLink from "@/components/common/WikiLink/WikiLink";
import { realmicBandArchetypes } from "@/data/tables/bandArchetypes";
import { archetypes } from "@/data/tables/archetypes";
import {
	BoroughDetails,
	ClanDetails,
	GuilderDetails,
	HavenDetails,
	KnightlyOrderDetails,
	NobleHouseDetails,
} from "@/context/groupContext";
import { SectionDivider } from "@/components/creator/SectionDivider/SectionDivider";
import { PickOne } from "../PickOne";

export function Details() {
	const { group, setField } = useGroupContext();
	const { name, type, archetype, goals, history, visuals, oath } = group;

	const matchingArchetype = realmicBandArchetypes.find((a) => a.name === archetype);
	const title = matchingArchetype?.name ?? "Band";
	const wikiLink = matchingArchetype?.link ?? realmicPlayerGroupsLink(group.realm);

	return (
		<ContentPane layout="narrow" className="text-left mt-4 gap-6">
			<div>
				<SectionDivider>Tell us about your {title}</SectionDivider>
				<div className="flex gap-2 items-center justify-center">
					<p className="text-sm text-muted-foreground">
						See here for information about building a {title}
					</p>
					<WikiLink path={wikiLink} />
				</div>
			</div>
			{archetype === "Guilder" && <GuilderDetailsSection />}
			{archetype === "Haven" && <HavenDetailsSection />}
			{archetype === "Clan" && <ClanDetailsSection />}
			{archetype === "Noble House" && <NobleHouseDetailsSection />}
			{archetype === "Knightly Order" && <KnightlyOrderDetailsSection />}
			{archetype === "Borough" && <BoroughDetailsSection />}
			<TextArea
				placeholder="History"
				label={
					matchingArchetype?.prompts?.history?.label ||
					`What is the history of your ${title}?`
				}
				sublabel={matchingArchetype?.prompts?.history?.sublabel}
				id="history"
				value={history}
				onChange={(e) => setField("history", e.target.value)}
			/>
			<TextArea
				placeholder="Visuals"
				label={
					matchingArchetype?.prompts?.visuals?.label ||
					`What are your ${title}'s notable symbols or colours?`
				}
				sublabel={matchingArchetype?.prompts?.visuals?.sublabel}
				id="visuals"
				value={visuals}
				onChange={(e) => setField("visuals", e.target.value)}
			/>
			<TextArea
				placeholder="Goals"
				label={
					matchingArchetype?.prompts?.goals?.label ||
					`What are the goals for your ${title} (In and Out of Character)?`
				}
				sublabel={matchingArchetype?.prompts?.goals?.sublabel}
				id="goals"
				value={goals}
				onChange={(e) => setField("goals", e.target.value)}
			/>
			<TextArea
				placeholder="Oath"
				label={matchingArchetype?.prompts?.oath?.label || `What is your ${title}'s Oath?`}
				sublabel={matchingArchetype?.prompts?.oath?.sublabel}
				id="oath"
				value={oath}
				onChange={(e) => setField("oath", e.target.value)}
			/>
		</ContentPane>
	);
}

function BoroughDetailsSection() {
	const { group, setField } = useGroupContext();
	const { archetypeDetails } = group;
	const { toil, vigour, ironclad, citadel } = (archetypeDetails as BoroughDetails) || {};

	return (
		<>
			<TextArea
				placeholder="Toil"
				label="What is your Borough's Toil?"
				id="toil"
				value={toil}
				onChange={(e) =>
					setField("archetypeDetails", {
						...archetypeDetails,
						toil: e.target.value,
					} as BoroughDetails)
				}
			/>
			<TextArea
				placeholder="Vigour"
				label="What is your Borough's Vigour?"
				id="vigour"
				value={vigour}
				onChange={(e) =>
					setField("archetypeDetails", {
						...archetypeDetails,
						vigour: e.target.value,
					} as BoroughDetails)
				}
			/>
			<TextArea
				placeholder="Ironclad"
				label="What is your Borough's Ironclad?"
				id="ironclad"
				value={ironclad}
				onChange={(e) =>
					setField("archetypeDetails", {
						...archetypeDetails,
						ironclad: e.target.value,
					} as BoroughDetails)
				}
			/>
			<TextArea
				placeholder="Citadel"
				label="What is your Borough's Citadel?"
				id="citadel"
				value={citadel}
				onChange={(e) =>
					setField("archetypeDetails", {
						...archetypeDetails,
						citadel: e.target.value,
					} as BoroughDetails)
				}
			/>
		</>
	);
}

function KnightlyOrderDetailsSection() {
	const { group, setField } = useGroupContext();
	const { archetypeDetails } = group;
	const { attitudes, charge, structure, tradition, traditionType } =
		(archetypeDetails as KnightlyOrderDetails) || {};

	return (
		<>
			<PickOne
				title="What is your Order's Tradition?"
				value={traditionType}
				handleClick={(value) =>
					setField("archetypeDetails", {
						...archetypeDetails,
						traditionType: value,
					} as KnightlyOrderDetails)
				}
				options={["Sword", "Glorious", "Faith"]}
			/>
			<TextArea
				placeholder="Tradition"
				label="Please elaborate on your Order's Tradition"
				id="tradition"
				value={tradition}
				onChange={(e) =>
					setField("archetypeDetails", {
						...archetypeDetails,
						tradition: e.target.value,
					} as KnightlyOrderDetails)
				}
			/>
			<TextArea
				placeholder="Charge"
				label="What is your Order's Charge"
				id="charge"
				value={charge}
				onChange={(e) =>
					setField("archetypeDetails", {
						...archetypeDetails,
						charge: e.target.value,
					} as KnightlyOrderDetails)
				}
			/>
			<TextArea
				placeholder="Structure"
				label="What is your Order's Structure"
				id="structure"
				value={structure}
				onChange={(e) =>
					setField("archetypeDetails", {
						...archetypeDetails,
						structure: e.target.value,
					} as KnightlyOrderDetails)
				}
			/>
			<TextArea
				placeholder="Attitudes"
				label="What is your Order's Attitudes"
				id="attitudes"
				value={attitudes}
				onChange={(e) =>
					setField("archetypeDetails", {
						...archetypeDetails,
						attitudes: e.target.value,
					} as KnightlyOrderDetails)
				}
			/>
		</>
	);
}

function NobleHouseDetailsSection() {
	const { group, setField } = useGroupContext();
	const { archetypeDetails } = group;
	const { duchy, traditions, motto } = (archetypeDetails as NobleHouseDetails) || {};

	return (
		<>
			<TextArea
				placeholder="Motto"
				label="What is your Noble House's Motto?"
				sublabel="(You will also need to create an Oath to be used as part of the Binding Ceremony)"
				id="motto"
				value={motto}
				onChange={(e) =>
					setField("archetypeDetails", {
						...archetypeDetails,
						motto: e.target.value,
					} as NobleHouseDetails)
				}
			/>
			<TextArea
				placeholder="Traditions"
				label="What are your Noble House's Traditions?"
				sublabel="These do not need to be extensive or overly detailed, but some general vibes for the traditions can help form your group and help us approve it."
				id="traditions"
				value={traditions}
				onChange={(e) =>
					setField("archetypeDetails", {
						...archetypeDetails,
						traditions: e.target.value,
					} as NobleHouseDetails)
				}
			/>
			<PickOne
				title="Which Duchy is your Noble House from?"
				subtitle="This is for the team to know which Duke to notify of it, not to determine Enterprise Location"
				value={duchy}
				handleClick={(value) =>
					setField("archetypeDetails", {
						...archetypeDetails,
						duchy: value,
					} as NobleHouseDetails)
				}
				options={["Everguarde", "Heartsgrave", "Starscar"]}
			/>
		</>
	);
}

function ClanDetailsSection() {
	const { group, setField } = useGroupContext();
	const { archetypeDetails } = group;
	const { type, fire, blood, law } = (archetypeDetails as ClanDetails) || {};

	return (
		<>
			<PickOne
				title="Which category does your Clan fall in to?"
				value={type}
				handleClick={(value) =>
					setField("archetypeDetails", {
						...archetypeDetails,
						type: value,
					} as ClanDetails)
				}
				options={["Lightning Clan", "Storm Clan", "Tempest Clan"]}
			/>
			<TextArea
				placeholder="Fire"
				label="What is your Clan's fire?"
				sublabel="This refers to the intention of a Clan, what its purpose and goals in the world are."
				id="fire"
				value={fire}
				onChange={(e) =>
					setField("archetypeDetails", {
						...archetypeDetails,
						fire: e.target.value,
					} as ClanDetails)
				}
			/>
			<TextArea
				placeholder="Blood"
				label="What is your Clan's blood?"
				sublabel="This refers to the loyalty of the Clan, how it binds itself and its members together. "
				id="blood"
				value={blood}
				onChange={(e) =>
					setField("archetypeDetails", {
						...archetypeDetails,
						blood: e.target.value,
					} as ClanDetails)
				}
			/>
			<TextArea
				placeholder="Law"
				label="What is your Clan's law?"
				sublabel="This refers to the internal function of the Clan, how it achieves its goals, how it rewards its members, punishes its enemies, and conducts itself."
				id="law"
				value={law}
				onChange={(e) =>
					setField("archetypeDetails", {
						...archetypeDetails,
						law: e.target.value,
					} as ClanDetails)
				}
			/>
		</>
	);
}

function HavenDetailsSection() {
	const { group, setField } = useGroupContext();
	const { archetypeDetails } = group;
	const { traditions } = (archetypeDetails as HavenDetails) || {};

	return (
		<TextArea
			placeholder="Oath"
			label="What are your Haven's traditions?"
			sublabel="Is there a traditional greeting for your people? A traditional hearth blessing? Or even a fighting style? These active elements can help ground your character in their Haven and show it off to others."
			id="traditions"
			value={traditions}
			onChange={(e) =>
				setField("archetypeDetails", {
					...archetypeDetails,
					traditions: e.target.value,
				} as HavenDetails)
			}
		/>
	);
}

function GuilderDetailsSection() {
	const { group, setField } = useGroupContext();
	const { archetypeDetails } = group;
	const { guilderArchetype, guild } = (archetypeDetails as GuilderDetails) || {};

	return (
		<>
			<PickOne
				title="Which archetype is your Guilder primarily based around?"
				subtitle="Understandably, the core of the concept is your archetype as this will
						inform your attitudes, concerns and abilities."
				value={guilderArchetype}
				handleClick={(value) =>
					setField("archetypeDetails", {
						...archetypeDetails,
						guilderArchetype: value,
					} as GuilderDetails)
				}
				options={archetypes
					.filter((a) => a.realm === "Greenweald Baronies")
					.map((a) => a.name)}
				allowNone={"No archetype"}
			/>
			<PickOne
				title="Which Guild is your Guilder Attached to?"
				value={guild}
				handleClick={(value) =>
					setField("archetypeDetails", {
						...archetypeDetails,
						guild: value,
					} as GuilderDetails)
				}
				options={[
					"Chapter Kristov - Houndspriests",
					"Eisen College of War - Ritters",
					"The Broken Vale - Wealdsages",
					"Schloss Mortis - Crow Doktors",
					"Stand Alone - Huntsmarshalls",
				]}
			/>
		</>
	);
}
