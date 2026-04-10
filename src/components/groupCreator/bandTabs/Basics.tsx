import useFormContext from "../../../hooks/use-form-context";
import { ContentPane } from "@/components/creator/ContentPane/ContentPane";
import { Input } from "@/components/common/Input/Input";
import useGroupContext from "@/hooks/use-group-context";
import { Chip } from "@/components/common/Chip/Chip";
import { realmicBandArchetypes } from "@/data/tables/bandArchetypes";
import WikiLink from "@/components/common/WikiLink/WikiLink";
import { realmicPlayerGroupsLink } from "@/utils/odd-jobs";

export function Basics() {
	const { form } = useFormContext();
	const { realm } = form;
	const { group, setField } = useGroupContext();
	const { name, type, archetype } = group;

	return (
		<ContentPane layout="narrow" className="text-left mt-4 gap-6">
			<Input
				placeholder="Name"
				type="text"
				label="What is the name of your band?"
				id="name"
				value={name}
				onChange={(e) => setField("name", e.target.value)}
			/>
			<div>
				<div className="flex flex-row gap-2">
					<p>Is your band one of the Realmic Band Archetypes?</p>
					<WikiLink path={realmicPlayerGroupsLink(realm)} />
				</div>
				<div className="flex gap-1 flex-wrap">
					<Chip onClick={() => setField("archetype", "")} selected={!archetype}>
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
		</ContentPane>
	);
}
