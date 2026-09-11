import { Approvals } from "@/components/approvals/Approvals";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import ContentWrapper from "@/components/layout/ContentWrapper";
import useUserContext from "@/hooks/use-user-context";
import { PATH_HOME } from "@/utils/constants";
import { useRouter } from "next/router";

export default function ApprovalsPage() {
	const router = useRouter();
	const { isAdmin, loading } = useUserContext();

	if (!loading && !isAdmin) {
		router.replace(PATH_HOME);
		return null;
	}

	return (
		<ContentWrapper layout="wide">
			{loading || !isAdmin ? <LoadingSpinner /> : <Approvals />}
		</ContentWrapper>
	);
}
