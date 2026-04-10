import { ContentPane } from "@/components/creator/ContentPane/ContentPane";
import useGroupContext from "@/hooks/use-group-context";
import { getRealmData } from "@/utils/data-helper";
import { ReviewItem, StyledBorder } from "../bandTabs/Review";

export function Review() {
	const { group } = useGroupContext();
	const { name, realm, history, oath, goals } = group;

	const realmicTitle = realm ? getRealmData(realm)?.citizen : "Realmless";

	return (
		<ContentPane layout="narrow" className="text-center mt-4 gap-2 text-wrap-balance">
			<div>
				<h2 className="text-xl">{name}</h2>
				<div className="italic text-muted-foreground">{`${realmicTitle} Sect`}</div>
			</div>
			<p className="italic text-muted-foreground">
				{oath ? (oath?.startsWith('"') ? oath : `"${oath}"`) : "No oath provided."}
			</p>
			<StyledBorder />
			<ReviewItem label="History">{history}</ReviewItem>
			<ReviewItem label="Goals">{goals}</ReviewItem>
		</ContentPane>
	);
}
