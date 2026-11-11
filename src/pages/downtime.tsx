import ContentWrapper from "@/components/layout/ContentWrapper";
import { PATH_HOME } from "@/utils/constants";
import { getSiteSettings } from "@/utils/settings";
import { useRouter } from "next/router";

export default function DowntimePage() {
	const router = useRouter();
	const downtimePageActive = getSiteSettings().pages.downtime;

	if (!downtimePageActive) {
		router.replace(PATH_HOME);
		return null;
	}

	return (
		<ContentWrapper layout="medium">
			<div className="text-center">
				<h1>Downtime Page</h1>
			</div>
		</ContentWrapper>
	);
}
