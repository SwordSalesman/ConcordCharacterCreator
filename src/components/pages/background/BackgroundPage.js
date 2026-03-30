import Accordion from "../../../components/common/Accordion/Accordion";
import ContentPane from "../../../components/common/ContentPane/ContentPane";
import useFormContext from "../../../hooks/use-form-context";
import TextInput from "../../../components/common/TextInput/TextInput";
import SectionDivider from "../../../components/common/SectionDivider/SectionDivider";
import Chip from "../../../components/common/Chip/Chip";
import { styled } from "styled-components";
import { SectionWrapper } from "../../common/SectionDivider/SectionDivider.style";
import { BackgroundPageWrapper } from "./BackgroundPage.style";
import { AccordionSection, Warning } from "../../common/Accordion/AccordionSection";
import useRealmDetails from "../../../hooks/use-realm-details";
import { useEffect, useState } from "react";
import { archetypeWarning, bandWarning } from "../../../helpers/validity-helper";
import { MenuItem, Select } from "@mui/material";
import { StyledSelect } from "../../common/TextInput/TextInput.style";

var allArchetypes = require("../../../data/tables/archetypes.json");
var allGraces = require("../../../data/tables/graces.json");
var bands = require("../../../data/tables/bands.json");

function BackgroundPage() {
	const {
		realm,
		heroName,
		setHeroName,
		archetype,
		toggleArchetype,
		grace,
		toggleGrace,
		warband,
		setWarband,
		sect,
		setSect,
		icGoals,
		setIcGoals,
		oocGoals,
		setOocGoals,
		backstory,
		setBackstory,
		invDetails,
		setInvDetails,
	} = useFormContext();
	const fullRealm = useRealmDetails(realm);
	const [renderedArchetype, setRenderedArchetype] = useState([]);
	const [renderedGrace, setRenderedGrace] = useState([]);

	var archetypeLink = fullRealm ? fullRealm.archetypeLink : null;

	useEffect(() => {
		var newRender = null;
		if (realm) {
			newRender = allArchetypes
				.filter((a) => a.realm === realm)
				.map((a) => {
					let selected = archetype?.map((selA) => selA.name).includes(a.name);
					return (
						<Chip
							onClick={() => toggleArchetype(a)}
							selected={selected}
							inactive={!selected && archetype?.length >= 1}
							key={a.name}
						>
							{a.name}
						</Chip>
					);
				});
			const noArchetype = !archetype || archetype?.length < 1;
			newRender.unshift(
				<Chip
					selected={noArchetype}
					onClick={() => {
						if (noArchetype) return;
						toggleArchetype(archetype[0]);
					}}
					key={"No Archetype"}
				>
					{"No Archetype"}
				</Chip>,
			);
		} else {
			newRender = <p style={{ opacity: 0.5, fontStyle: "italic" }}>Select a realm first</p>;
		}
		setRenderedArchetype(newRender);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [realm, archetype]);

	useEffect(() => {
		var newRender = null;
		newRender = allGraces.map((g) => {
			let selected = grace?.map((sel) => sel.name).includes(g.name);
			return (
				<Chip
					onClick={() => toggleGrace(g)}
					selected={selected}
					inactive={!selected && grace?.length >= 1}
					key={g.name}
				>
					{g.name}
				</Chip>
			);
		});
		const noGrace = !grace || grace?.length < 1;
		newRender.unshift(
			<Chip
				selected={noGrace}
				key={"No Grace"}
				onClick={() => {
					if (noGrace) return;
					toggleGrace(grace[0]);
				}}
			>
				{"No Grace"}
			</Chip>,
		);
		setRenderedGrace(newRender);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [realm, grace]);

	const realmicBands = bands.filter((b) => b.realm === realm).map((b) => b.name);
	const warbandWarningText = bandWarning(warband, realm);

	const tabs = [
		{
			label: "Identity",
			content: (
				<BackgroundInputWrapper>
					<TextInput
						value={heroName}
						onChange={setHeroName}
						title="Name"
						placeholder="Enter your name"
						// invalid={heroName.length < 1}
						// invalidText="Don't forget your name"
					/>
					<AccordionSection
						title="Archetype"
						link={archetypeLink}
						warning={archetypeWarning(archetype, allArchetypes)}
					>
						{renderedArchetype}
					</AccordionSection>
					<AccordionSection title="Grace" link="Graces">
						{renderedGrace}
					</AccordionSection>
				</BackgroundInputWrapper>
			),
		},
		{
			label: "Alliances",
			link: "Player_Groups",
			content: (
				<BackgroundInputWrapper>
					<div>
						<p>Band</p>
						{warbandWarningText && <Warning>{warbandWarningText}</Warning>}
						<StyledSelect
							value={warband}
							onChange={(e) => setWarband(e.target.value)}
							label="Band"
							id="band-select"
							size="small"
							displayEmpty
							inputProps={{ "aria-label": "Without label" }}
							variant="standard"
							invalid={!!warbandWarningText}
						>
							{realmicBands.map((b) => (
								<MenuItem value={b} key={b}>
									{b}
								</MenuItem>
							))}
						</StyledSelect>
					</div>
					<TextInput
						value={sect}
						onChange={setSect}
						title="Sect"
						placeholder="Name of your Sect (if any)"
					/>
				</BackgroundInputWrapper>
			),
		},
		{
			label: "Objectives",
			content: (
				<BackgroundInputWrapper>
					<TextInput
						value={icGoals}
						onChange={setIcGoals}
						title="In Character Goals"
						placeholder="3000 character limit"
						style={{ minHeight: "3em" }}
					/>
					<TextInput
						value={oocGoals}
						onChange={setOocGoals}
						title="Out of Character Goals"
						placeholder="3000 character limit"
						style={{ minHeight: "3em" }}
					/>
				</BackgroundInputWrapper>
			),
		},
		{
			label: "Backstory",
			content: (
				<BackgroundInputWrapper>
					<TextInput
						value={backstory}
						onChange={setBackstory}
						title="Character Backstory"
						placeholder="3000 character limit"
						style={{ minHeight: "3em" }}
					/>
					<TextInput
						value={invDetails}
						onChange={setInvDetails}
						title="Investment Description"
						placeholder="3000 character limit"
						style={{ minHeight: "3em" }}
					/>
				</BackgroundInputWrapper>
			),
		},
	];

	return (
		<BackgroundPageWrapper>
			<ContentPane style={{ width: "100%" }}>
				<SectionDivider left="Tell us about yourself"></SectionDivider>
				<SectionWrapper />
				<Accordion items={tabs}></Accordion>
			</ContentPane>
		</BackgroundPageWrapper>
	);
}

export default BackgroundPage;

export const BackgroundInputWrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 10px;
	margin: 15px 0;
`;
