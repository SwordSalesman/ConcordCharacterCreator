import ContentWrapper from "@/components/layout/ContentWrapper";
import { PATH_HOME } from "@/utils/constants";
import { getSiteSettings } from "@/utils/settings";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function DowntimePage() {
	const router = useRouter();
	const downtimePageActive = getSiteSettings().pages.downtime;

	useEffect(() => {
		if (!downtimePageActive) {
			router.replace(PATH_HOME);
		}
	}, [router, downtimePageActive]);

	if (!downtimePageActive) {
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
