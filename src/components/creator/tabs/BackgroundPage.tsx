import Accordion from "../../common/Accordion/Accordion";
import useFormContext from "../../../hooks/use-form-context";
import SectionDivider from "../../common/SectionDivider/SectionDivider";
import { SectionWrapper } from "../../common/SectionDivider/SectionDivider.style";
import { AccordionSection } from "../../common/Accordion/AccordionSection";
import { useEffect, useMemo } from "react";
import { getRealmData } from "@/utils/data-helper";
import { Chip } from "@/components/common/Chip/Chip";

import { archetypes } from "@/data/tables/archetypes";
import { graces } from "@/data/tables/graces";
import { Input } from "@/components/common/Input/Input";
import { ContentPane } from "@/components/common/ContentPane/ContentPane";

export function BackgroundPage() {
	const { form, toggleItem, setField } = useFormContext();
	const {
		realm,
		archetype,
		grace,
		heroName,
		warband,
		sect,
		icGoals,
		oocGoals,
		backstory,
		invDetails,
	} = form;
	const fullRealm = realm ? getRealmData(realm) : undefined;

	useEffect(() => {}, [realm, archetype]);

	const renderedArchetype = useMemo(() => {
		if (realm) {
			let newRender = archetypes
				.filter((a) => a.realm === realm)
				.map((a) => {
					let selected = archetype === a.name;
					return (
						<Chip
							onClick={() => toggleItem("archetype", a.name)}
							selected={selected}
							inactive={!selected && !!archetype}
							key={a.name}
						>
							{a.name}
						</Chip>
					);
				});
			newRender.unshift(
				<Chip
					selected={!archetype}
					onClick={() => {
						setField("archetype", undefined);
					}}
					key={"No Archetype"}
				>
					{"No Archetype"}
				</Chip>,
			);
			return <>{newRender}</>;
		} else {
			return <p style={{ opacity: 0.5, fontStyle: "italic" }}>Select a realm first</p>;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [realm, archetype]);

	const renderedGrace = useMemo(() => {
		var newRender = null;
		newRender = graces.map((g) => {
			let selected = grace === g.name;
			return (
				<Chip
					onClick={() => toggleItem("grace", g.name)}
					selected={selected}
					inactive={!selected && !!grace}
					key={g.name}
				>
					{g.name}
				</Chip>
			);
		});
		newRender.unshift(
			<Chip
				selected={!grace}
				onClick={() => {
					toggleItem("grace", undefined);
				}}
				key={"No Grace"}
			>
				{"No Grace"}
			</Chip>,
		);
		return <>{newRender}</>;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [realm, grace]);

	const tabs = [
		{
			label: "Identity",
			content: (
				<div className="flex flex-col gap-2 w-full my-4">
					<Input
						placeholder="Enter your name"
						type="text"
						label="Name"
						id="name"
						value={heroName}
						onChange={(e) => setField("heroName", e.target.value)}
					/>
					<AccordionSection
						title="Archetype"
						link={fullRealm?.archetypeLink}
						warning={
							archetype &&
							!archetypes
								.filter((a) => a.realm === realm)
								.find((a) => a.name === archetype)
								? `Your archetype '${archetype}' is no longer available, please select 'No Archetype' then a new one if you wish.`
								: ""
						}
					>
						{renderedArchetype}
					</AccordionSection>
					<AccordionSection title="Grace" link="Graces">
						{renderedGrace}
					</AccordionSection>
				</div>
			),
		},
		{
			label: "Alliances",
			link: "Player_Groups",
			content: (
				<div className="flex flex-col gap-2 w-full my-4">
					<Input
						placeholder="Name of your Band (if any)"
						type="text"
						label="Band"
						value={warband}
						onChange={(e) => setField("warband", e.target.value)}
					/>
					<Input
						placeholder="Name of your Sect (if any)"
						type="text"
						label="Sect"
						value={sect}
						onChange={(e) => setField("sect", e.target.value)}
					/>
				</div>
			),
		},
		{
			label: "Objectives",
			content: (
				<div className="flex flex-col gap-2 w-full my-4">
					<Input
						type="text"
						value={icGoals}
						onChange={(e) => setField("icGoals", e.target.value)}
						label="In Character Goals"
						placeholder="3000 character limit"
						style={{ minHeight: "3em" }}
					/>
					<Input
						type="text"
						value={oocGoals}
						onChange={(e) => setField("oocGoals", e.target.value)}
						label="Out of Character Goals"
						placeholder="3000 character limit"
						style={{ minHeight: "3em" }}
					/>
				</div>
			),
		},
		{
			label: "Backstory",
			content: (
				<div className="flex flex-col gap-2 w-full my-4">
					<Input
						type="text"
						value={backstory}
						onChange={(e) => setField("backstory", e.target.value)}
						label="Character Backstory"
						placeholder="3000 character limit"
						style={{ minHeight: "3em" }}
					/>
					<Input
						type="text"
						value={invDetails}
						onChange={(e) => setField("invDetails", e.target.value)}
						label="Investment Description"
						placeholder="3000 character limit"
						style={{ minHeight: "3em" }}
					/>
				</div>
			),
		},
	];

	return (
		<div className="sm:max-w-[450px]">
			<ContentPane style={{ width: "100%" }}>
				<SectionDivider left="Tell us about yourself"></SectionDivider>
				<SectionWrapper />
				<Accordion items={tabs}></Accordion>
			</ContentPane>
		</div>
	);
}
