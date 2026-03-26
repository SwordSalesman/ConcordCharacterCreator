import { JSX } from "react";
import { saveUserForm } from "../../hooks/use-firebase.ts";
import toast from "react-hot-toast";
import useUserContext from "@/hooks/use-user-context";
import { IntroPage } from "./tabs/IntroPage.tsx";
import RealmPage from "./tabs/RealmPage.tsx";
import SkillsPage from "./tabs/SkillsPage.tsx";
import useFormContext from "@/hooks/use-form-context.ts";
import { OptionsPage } from "./tabs/OptionsPage.tsx";
import { BackgroundPage } from "./tabs/BackgroundPage.tsx";
import { ReviewPage } from "./tabs/ReviewPage.tsx";
import { Creator } from "../creator/Creator.tsx";

export interface Tab {
	name: string;
	content: JSX.Element;
}
const tabs: Tab[] = [
	{ name: "Intro", content: <IntroPage /> },
	{ name: "Realm", content: <RealmPage /> },
	{ name: "Skills", content: <SkillsPage /> },
	{ name: "Options", content: <OptionsPage /> },
	{ name: "Background", content: <BackgroundPage /> },
	{ name: "Review", content: <ReviewPage /> },
];

export function CharacterCreator() {
	const { name } = useUserContext();
	const { getFormSummary, resetForm, validateForm, setField } = useFormContext();
	const { valid } = validateForm();

	const handleSave = async () => {
		toast.promise(
			saveUserForm(getFormSummary(), (date: string) => setField("date", date), name),
			{
				loading: "Submitting",
				success: "Character submitted!",
				error: (err) => `Submission failed, check network connection. Error code: ${err}`,
			},
		);
	};

	return (
		<Creator
			tabs={tabs}
			onReset={resetForm}
			onSubmit={handleSave}
			valid={valid}
			key="CharacterCreator"
		/>
	);
}
