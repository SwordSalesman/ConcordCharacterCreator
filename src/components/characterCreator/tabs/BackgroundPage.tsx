import Accordion from "../../common/Accordion/Accordion";
import useFormContext from "../../../hooks/use-form-context";
import { SectionDivider } from "../../creator/SectionDivider/SectionDivider";
import { AccordionSection } from "../../common/Accordion/AccordionSection";
import { useEffect, useMemo, useState } from "react";
import { getRealmData } from "@/utils/data-helper";
import { Chip } from "@/components/common/Chip/Chip";

import { archetypes } from "@/data/tables/archetypes";
import { graces } from "@/data/tables/graces";
import { Input, TextArea } from "@/components/common/Input/Input";
import { ContentPane } from "@/components/creator/ContentPane/ContentPane";
import { getGroupList } from "@/hooks/use-firebase";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

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
		gamesPlayed,
	} = form;
	const fullRealm = realm ? getRealmData(realm) : undefined;
	const [bands, setBands] = useState<{ realm: string; name: string }[]>([]);

	useEffect(() => {
		async function fetchData() {
			const data = await getGroupList();
			if (data) {
				setBands(data.bands || []);
			}
		}
		fetchData();
	}, [realm, archetype]);

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
					{!gamesPlayed || gamesPlayed === 0 ? (
						<p>
							To join a Band or Sect, your Hero must have the relevant ceremony cast
							on them at a Summit. Options will become available after your first
							game.
						</p>
					) : (
						<>
							<p className="text-sm text-muted-foreground">
								Only select a Band or Sect if your Hero has had the relevant
								ceremony performed on them at a Summit. If your Band is not listed,
								get in touch with your Band leader.
							</p>

							<div className="flex flex-col">
								<p>Band</p>
								<p className="text-sm text-muted-foreground"></p>
								<Select
									value={warband ?? ""}
									onValueChange={(v) =>
										setField("warband", v === "[None]" ? undefined : v)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select your band (if any)" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="[None]">[None]</SelectItem>
										{bands
											.filter((band) => band.realm === realm)
											.map((band) => (
												<SelectItem value={band.name} key={band.name}>
													{band.name}
												</SelectItem>
											))}
									</SelectContent>
								</Select>
							</div>

							<Input
								placeholder="Name of your Sect (if any)"
								type="text"
								label="Sect"
								value={sect}
								onChange={(e) => setField("sect", e.target.value)}
							/>
						</>
					)}
				</div>
			),
		},
		{
			label: "Objectives",
			content: (
				<div className="flex flex-col gap-2 w-full my-4">
					<TextArea
						value={icGoals}
						onChange={(e) => setField("icGoals", e.target.value)}
						label="In Character Goals"
						placeholder="3000 character limit"
						style={{ minHeight: "3em" }}
					/>
					<TextArea
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
					<TextArea
						value={backstory}
						onChange={(e) => setField("backstory", e.target.value)}
						label="Character Backstory"
						placeholder="3000 character limit"
						style={{ minHeight: "3em" }}
					/>
					<TextArea
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
		<ContentPane className="flex-1" layout="narrow">
			<SectionDivider>Tell us about your Hero</SectionDivider>
			<Accordion items={tabs}></Accordion>
		</ContentPane>
	);
}
