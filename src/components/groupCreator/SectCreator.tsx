import { Creator, Tab } from "../creator/Creator";
import useGroupContext from "@/hooks/use-group-context";
import { Intro } from "./sectTabs/Intro";
import { Details } from "./sectTabs/Details";
import { saveGroup } from "@/hooks/use-firebase";
import toast from "react-hot-toast";
import useUserContext from "@/hooks/use-user-context";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { Review } from "./sectTabs/Review";

const tabs: Tab[] = [
	{
		name: "Status",
		content: <Intro />,
	},
	{
		name: "Details",
		content: <Details />,
	},
	{
		name: "Review",
		content: <Review />,
	},
];

export function SectCreator() {
	const { user, loading: userLoading } = useUserContext();
	const { group, validateForm, resetForm, loading: formLoading } = useGroupContext();

	function onSubmit() {
		toast.promise(saveGroup({ group, type: "Sect" }), {
			loading: "Submitting",
			success: "Sect submitted!",
			error: (err) => `Submission failed, check network connection. Error code: ${err}`,
		});
	}

	function onReset() {
		resetForm();
	}

	const { valid } = validateForm();

	if (userLoading || (user && formLoading)) {
		return (
			<div className="mt-8">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<Creator
			tabs={tabs}
			valid={valid}
			onSubmit={onSubmit}
			onReset={onReset}
			key="SectCreator"
		/>
	);
}
