import { Creator, Tab } from "../creator/Creator";
import useGroupContext from "@/hooks/use-group-context";
import { Intro } from "./bandTabs/Intro";
import { Basics } from "./bandTabs/Basics";
import { Details } from "./bandTabs/Details";
import { Review } from "./bandTabs/Review";
import { Enterprise } from "./bandTabs/Enterprise";
import { saveGroup } from "@/hooks/use-firebase";
import toast from "react-hot-toast";

const tabs: Tab[] = [
	{
		name: "Status",
		content: <Intro />,
	},
	{
		name: "Basics",
		content: <Basics />,
	},
	{
		name: "Details",
		content: <Details />,
	},
	{
		name: "Enterprise",
		content: <Enterprise />,
	},
	{
		name: "Review",
		content: <Review />,
	},
];

export function BandCreator() {
	const { group, validateForm, resetForm } = useGroupContext();

	function onSubmit() {
		toast.promise(saveGroup({ group, type: "Band" }), {
			loading: "Submitting",
			success: "Band submitted!",
			error: (err) => `Submission failed, check network connection. Error code: ${err}`,
		});
	}

	function onReset() {
		resetForm();
	}

	const { valid } = validateForm();

	return (
		<Creator
			tabs={tabs}
			valid={valid}
			onSubmit={onSubmit}
			onReset={onReset}
			key="BandCreator"
		/>
	);
}
