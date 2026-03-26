import { Creator, Tab } from "../creator/Creator";
import useGroupContext from "@/hooks/use-group-context";
import { Intro } from "./tabs/Intro";
import { Basics } from "./tabs/Basics";

const tabs: Tab[] = [
	{
		name: "Intro",
		content: <Intro />,
	},
	{
		name: "Basics",
		content: <Basics />,
	},
	{
		name: "Details",
		content: <div>here's some details</div>,
	},
	{
		name: "Review",
		content: <div>review your group here</div>,
	},
];

export function GroupCreator() {
	const { group, validateForm } = useGroupContext();

	function onSubmit() {}

	function onReset() {
		console.log("reset");
	}

	const { valid } = validateForm();

	return (
		<Creator
			tabs={tabs}
			valid={valid}
			onSubmit={onSubmit}
			onReset={onReset}
			key="GroupCreator"
		/>
	);
}
