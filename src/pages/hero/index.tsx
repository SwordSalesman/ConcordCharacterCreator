import { CharacterCreator } from "@/components/characterCreator/CharacterCreator";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import ContentWrapper from "@/components/layout/ContentWrapper";
import useFormContext from "@/hooks/use-form-context";
import useUserContext from "@/hooks/use-user-context";
import { PreMessage } from "../groups";

export default function HeroPage() {
	const { user, loading: userLoading } = useUserContext();
	const { form, loading: formLoading } = useFormContext();

	if (userLoading || (user && formLoading)) {
		return (
			<div className="mt-8">
				<LoadingSpinner />
			</div>
		);
	}

	if (!user) {
		return (
			<PreMessage
				title="Sign In Required"
				message="Please sign in to create and submit your hero for approval."
			/>
		);
	}

	return (
		<ContentWrapper>
			<CharacterCreator />
		</ContentWrapper>
	);
}
