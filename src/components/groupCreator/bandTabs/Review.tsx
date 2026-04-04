import { ContentPane } from "@/components/creator/ContentPane/ContentPane";
import useGroupContext from "@/hooks/use-group-context";
import { getRealmData } from "@/utils/data-helper";
import { GuilderDetails } from "@/context/groupContext";

export function ReviewItem({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div>
			<div className="text-muted-foreground text-sm leading-[0.8rem]">{label}</div>
			<div className="text-foreground">{children ?? "None provided."}</div>
		</div>
	);
}

export function StyledBorder() {
	return (
		<div
			// className="w-full h-[1px] bg-[linear-gradient(90deg,transparent_0%,var(--border)_50%,transparent_100%)]"
			className="w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent"
		/>
	);
}

export function Review() {
	const { group } = useGroupContext();
	const { name, realm, archetype, enterprise, archetypeDetails, history, visuals, oath, goals } =
		group;

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
		<ContentPane layout="narrow" className="text-center mt-4 gap-2 text-wrap-balance">
			<div>
				<h2 className="text-xl">{name}</h2>
				<div className="italic text-muted-foreground">
					{`${realmicTitle} ${archetype ? archetype : "Band"}`}
				</div>
			</div>
			{
				<p className="italic text-muted-foreground">
					{oath ? (oath?.startsWith('"') ? oath : `"${oath}"`) : "No oath provided."}
				</p>
			}
			<StyledBorder />
			{archetype === "Guilder" && <GuilderDetailsSection />}
			{/* {archetype === "Haven" && <HavenDetailsSection />}
			{archetype === "Clan" && <ClanDetailsSection />}
			{archetype === "Noble House" && <NobleHouseDetailsSection />}
			{archetype === "Knightly Order" && <KnightlyOrderDetailsSection />}
			{archetype === "Borough" && <BoroughDetailsSection />} */}
			<ReviewItem label="Visuals">{visuals}</ReviewItem>
			<ReviewItem label="History">{history}</ReviewItem>
			<ReviewItem label="Goals">{goals}</ReviewItem>
			<StyledBorder />
			<ReviewItem label="Enterprise">{enterprise?.name}</ReviewItem>
			<ReviewItem label="Enterprise Type">{enterprise?.type}</ReviewItem>
			<ReviewItem label="Enterprise Description">{enterprise?.description}</ReviewItem>
		</ContentPane>
	);
}

function GuilderDetailsSection() {
	const { group } = useGroupContext();
	const { guild, guilderArchetype } = (group.archetypeDetails as GuilderDetails) || {};

	return (
		<>
			<ReviewItem label="Guilder Archetype">{guilderArchetype}</ReviewItem>
			<ReviewItem label="Aligned Guild">{guild}</ReviewItem>
		</>
	);
}
