import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import ContentWrapper from "@/components/layout/ContentWrapper";
import { useRouter } from "next/router";
import { PATH_HOME } from "@/utils/constants";
import useFormContext from "@/hooks/use-form-context";
import useUserContext from "@/hooks/use-user-context";
import { getSiteSettings } from "@/utils/settings";

export default function DowntimePage() {
	const { user, loading: userLoading } = useUserContext();
	const { form, loading: formLoading } = useFormContext();
	const router = useRouter();

	if (!getSiteSettings().pages.downtime) {
		router.replace(PATH_HOME);
		return null;
	}

	if (userLoading || (user && formLoading)) {
		return (
			<div className="mt-8">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<ContentWrapper layout="narrow">
			<div className="text-center">
				<h1 className="text-2xl font-bold">Downtime</h1>
				<p>Here's where downtime would go, if it was implemented.</p>
			</div>
		</ContentWrapper>
	);
}
