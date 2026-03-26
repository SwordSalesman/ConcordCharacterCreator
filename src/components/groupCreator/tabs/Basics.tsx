import useFormContext from "../../../hooks/use-form-context";
import { ContentPane } from "@/components/creator/ContentPane/ContentPane";
import { Input } from "@/components/common/Input/Input";
import useGroupContext from "@/hooks/use-group-context";
import { Chip } from "@/components/common/Chip/Chip";

export function Basics() {
	const { form } = useFormContext();
	const { realm } = form;
	const { group, setField } = useGroupContext();
	const { name, type, archetype } = group;

	const realmicBandArchetypes: {
		name: string;
		realm: string;
	}[] = [
		{
			name: "Clan",
			realm: "Andash",
		},
		{
			name: "Knightly Order",
			realm: "Bordevar",
		},
		{
			name: "Noble House",
			realm: "Bordevar",
		},
		{
			name: "Guilder",
			realm: "Greenweald",
		},
		{
			name: "Haven",
			realm: "Greenweald",
		},
		{
			name: "Coteria",
			realm: "Lerona Mere",
		},
		{
			name: "Borough",
			realm: "Iron Valley",
		},
	];

	return (
		<div className="flex gap-2 flex-col sm:flex-row w-full max-w-[450px] mx-auto">
			<ContentPane style={{ flex: 1 }}>
				{/* <SectionDivider>Tell us about your Hero</SectionDivider> */}
				<div className="flex flex-col gap-4 w-full my-5 text-left">
					<div>
						<p>What is the name of your group?</p>
						<Input
							placeholder="Name"
							type="text"
							// label="Name"
							id="name"
							value={name}
							onChange={(e) => setField("name", e.target.value)}
						/>
					</div>
					<div>
						<p>Is your group a band or a sect?</p>
						<div className="flex gap-1 pt-0.5">
							<Chip
								onClick={() => setField("type", "Band")}
								selected={type === "Band"}
								className="w-14"
							>
								Band
							</Chip>
							<Chip
								onClick={() => setField("type", "Sect")}
								selected={type === "Sect"}
								className="w-14"
							>
								Sect
							</Chip>
						</div>
					</div>
					{type === "Band" && (
						<div>
							<p>Is your band one of the Realmic Band Archetypes?</p>
							<div className="flex gap-1 pt-0.5">
								<Chip
									onClick={() => setField("archetype", "")}
									selected={!archetype}
								>
									No Archetype
								</Chip>
								{realmicBandArchetypes
									.filter((a) => a.realm === realm)
									.map((a) => (
										<Chip
											key={a.name}
											onClick={() => setField("archetype", a.name)}
											selected={archetype === a.name}
										>
											{a.name}
										</Chip>
									))}
							</div>
						</div>
					)}
				</div>
			</ContentPane>
		</div>
	);
}
