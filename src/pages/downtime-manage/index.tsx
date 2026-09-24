import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import ContentWrapper from "@/components/layout/ContentWrapper";
import { useRouter } from "next/router";
import { PATH_HOME } from "@/utils/constants";
import useUserContext from "@/hooks/use-user-context";
import { getSiteSettings } from "@/utils/settings";
import { DowntimeManage } from "@/components/downtimeManage/DowntimeManage";

export default function DowntimeManagePage() {
	const router = useRouter();
	const { isAdmin, loading } = useUserContext();

	if ((!loading && !isAdmin) || getSiteSettings().pages.downtime === false) {
		router.replace(PATH_HOME);
		return null;
	}

	if (loading) {
		return (
			<div className="mt-8">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<ContentWrapper layout="wide">
			<DowntimeManage />
		</ContentWrapper>
	);
}
