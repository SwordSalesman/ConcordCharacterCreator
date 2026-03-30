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

export function Enterprise() {
	const { group, setField } = useGroupContext();
	const { name, type, archetype, goals, history, visuals, oath } = group;

	const matchingArchetype = realmicBandArchetypes.find((a) => a.name === archetype);
	const title = matchingArchetype?.name ?? "Band";
	const wikiLink = matchingArchetype?.link ?? realmicPlayerGroupsLink(group.realm);

	return <ContentPane layout="narrow" className="text-left mt-4 gap-6"></ContentPane>;
}
