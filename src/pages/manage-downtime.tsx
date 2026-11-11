import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import ContentWrapper from "@/components/layout/ContentWrapper";
import useUserContext from "@/hooks/use-user-context";
import { PATH_HOME } from "@/utils/constants";
import { getSiteSettings } from "@/utils/settings";
import { useRouter } from "next/router";

// ui sketch for downtime management page: https://excalidraw.com/#json=nVMmAcw1O8_93sha_Qpwv,CSQJ1T2M7ftBUMc42i4R4Q

export default function DowntimePage() {
	const router = useRouter();
	const { isAdmin, loading } = useUserContext();
	const downtimePageActive = getSiteSettings().pages.downtime;

	if (!downtimePageActive || (!loading && !isAdmin)) {
		router.replace(PATH_HOME);
		return null;
	}

	return (
		<ContentWrapper layout="wide">
			{loading || !isAdmin ? (
				<LoadingSpinner />
			) : (
				<div className="text-center">
					<h1>Downtime Management Page</h1>
				</div>
			)}
		</ContentWrapper>
	);
}
