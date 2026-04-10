import { ContentPane } from "@/components/creator/ContentPane/ContentPane";
import { Input, TextArea } from "@/components/common/Input/Input";
import useGroupContext from "@/hooks/use-group-context";
import WikiLink from "@/components/common/WikiLink/WikiLink";
import { SectionDivider } from "@/components/creator/SectionDivider/SectionDivider";
import { realmicPlayerGroupsLink } from "@/utils/odd-jobs";

export function Details() {
	const { group, setField } = useGroupContext();
	const { name, realm, goals, history, oath } = group;

	return (
		<ContentPane layout="narrow" className="text-left mt-4 gap-6">
			<div>
				<SectionDivider>Tell us about your Sect</SectionDivider>
				<div className="flex gap-2 items-center justify-center">
					<p className="text-sm text-muted-foreground">
						See here for information about building a Sect
					</p>
					<WikiLink path={realmicPlayerGroupsLink(realm)} />
				</div>
			</div>
			<Input
				placeholder="Name"
				type="text"
				label="What is the name of your Sect?"
				id="name"
				value={name}
				onChange={(e) => setField("name", e.target.value)}
			/>
			<TextArea
				placeholder="History"
				label="What is the history of your Sect?"
				id="history"
				value={history}
				onChange={(e) => setField("history", e.target.value)}
			/>
			<TextArea
				placeholder="Goals"
				label="What are the goals for your Sect (In and Out of Character)?"
				id="goals"
				value={goals}
				onChange={(e) => setField("goals", e.target.value)}
			/>
			<TextArea
				placeholder="Oath"
				label="What is your Sect's Oath?"
				id="oath"
				value={oath}
				onChange={(e) => setField("oath", e.target.value)}
			/>
		</ContentPane>
	);
}
