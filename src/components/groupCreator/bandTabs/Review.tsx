import useFormContext from "../../../hooks/use-form-context";
import { ContentPane } from "@/components/creator/ContentPane/ContentPane";
import { Input, TextArea } from "@/components/common/Input/Input";
import useGroupContext from "@/hooks/use-group-context";
import { Chip } from "@/components/common/Chip/Chip";
import { realmicPlayerGroupsLink } from "@/utils/odd-jobs";
import WikiLink from "@/components/common/WikiLink/WikiLink";
import { realmicBandArchetypes } from "@/data/tables/bandArchetypes";
import { getRealmData } from "@/utils/data-helper";

function ReviewItem({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div>
			<div className="text-muted-foreground text-sm">{label}</div>
			<div className="text-foreground">{children}</div>
		</div>
	);
}

function StyledBorder() {
	return (
		<div
			// className="w-full h-[1px] bg-[linear-gradient(90deg,transparent_0%,var(--border)_50%,transparent_100%)]"
			className="w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent"
		/>
	);
}

export function Review() {
	const { group } = useGroupContext();
	const { name, realm, archetype, enterprise, archetypeDetails } = group;

	/*
		archetype?: string;	
		archetypeDetails?: ArchetypeDetails;
		visuals?: string;
		history?: string;
		oath?: string;
		goals?: string;
		enterprise?: Enterprise;
	*/

	const realmicTitle = realm ? getRealmData(realm)?.citizen : "Realmless";

	return (
		<ContentPane layout="narrow" className="text-center mt-4 gap-4 text-wrap-balance">
			<div>
				<h2 className="text-xl">{name}</h2>
				<div className="italic text-muted-foreground">
					{`${realmicTitle} ${archetype ? archetype : "Band"}`}
				</div>
			</div>
			<ReviewItem label="Band Name">{name}</ReviewItem>
			<ReviewItem label="Realm">{realm}</ReviewItem>
			<ReviewItem label="Archetype">{archetype}</ReviewItem>
			<ReviewItem label="">{archetype}</ReviewItem>
			<StyledBorder />
			<ReviewItem label="Enterprise">{enterprise?.name}</ReviewItem>
			<ReviewItem label="Enterprise Type">{enterprise?.type}</ReviewItem>
			<ReviewItem label="Enterprise Description">{enterprise?.description}</ReviewItem>
		</ContentPane>
	);
}
