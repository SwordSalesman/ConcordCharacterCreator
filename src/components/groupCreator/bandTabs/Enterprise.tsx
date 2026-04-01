import { ContentPane } from "@/components/creator/ContentPane/ContentPane";
import useGroupContext from "@/hooks/use-group-context";
import WikiLink from "@/components/common/WikiLink/WikiLink";
import { SectionDivider } from "@/components/creator/SectionDivider/SectionDivider";
import { PickOne } from "../PickOne";
import { EnterpriseTypes } from "@/context/groupContext";
import { Input, TextArea } from "@/components/common/Input/Input";

export function Enterprise() {
	const { group, setField } = useGroupContext();
	const { name: bandName, enterprise } = group;
	const { type, name, description } = enterprise || {};

	return (
		<ContentPane layout="narrow" className="text-left mt-4 gap-6">
			<div>
				<SectionDivider>{bandName}'s Enterprise</SectionDivider>
				<div className="flex gap-2 items-center justify-center">
					<p className="text-sm text-muted-foreground">
						See here for information about enterprises
					</p>
					<WikiLink path={"Band_Enterprises"} />
				</div>
			</div>
			<Input
				label="Enterprise Name"
				type="text"
				value={name}
				onChange={(e) => setField("enterprise", { ...enterprise, name: e.target.value })}
			/>
			<PickOne
				title="Choose an Enterprise Type"
				options={EnterpriseTypes.map((t) => t)}
				value={type}
				handleClick={(option) => {
					if (!option) return;
					setField("enterprise", {
						...enterprise,
						type: option,
					});
				}}
			/>
			<TextArea
				label="Enterprise Description"
				sublabel="A description of the enterprise, its physical structure, style, and curiosities. This will be used by the Concord team to produce a story related to the Enterprise."
				value={description}
				onChange={(e) =>
					setField("enterprise", { ...enterprise, description: e.target.value })
				}
			/>
		</ContentPane>
	);
}
