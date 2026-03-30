import useFormContext from "../../../hooks/use-form-context";
import { ContentPane } from "@/components/creator/ContentPane/ContentPane";
import { Input, TextArea } from "@/components/common/Input/Input";
import useGroupContext from "@/hooks/use-group-context";
import { Chip } from "@/components/common/Chip/Chip";
import { realmicPlayerGroupsLink } from "@/utils/odd-jobs";
import WikiLink from "@/components/common/WikiLink/WikiLink";
import { realmicBandArchetypes } from "@/data/tables/bandArchetypes";

export function Review() {
	const { group } = useGroupContext();

	return <ContentPane>{JSON.stringify(group)}</ContentPane>;
}
