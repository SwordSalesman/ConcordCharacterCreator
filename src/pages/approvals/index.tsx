import { Approvals } from "@/components/approvals/Approvals";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import ContentWrapper from "@/components/layout/ContentWrapper";
import useUserContext from "@/hooks/use-user-context";
import { PATH_HOME } from "@/utils/constants";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ApprovalsPage() {
	const router = useRouter();
	const { isAdmin, loading } = useUserContext();
	const shouldRedirect = !loading && !isAdmin;

	useEffect(() => {
		if (shouldRedirect) {
			router.replace(PATH_HOME);
		}
	}, [router, shouldRedirect]);

	if (shouldRedirect) {
		return null;
	}

	return (
		<ContentWrapper layout="wide">
			{loading || !isAdmin ? <LoadingSpinner /> : <Approvals />}
		</ContentWrapper>
	);
}
