import { Button } from "@/components/common/Button/Button";
import ContentWrapper from "@/components/layout/ContentWrapper";
import FormContextProvider from "@/context/formContext";
import useUserContext from "@/hooks/use-user-context";
import { fadeStripStyle } from "@/styles/Global";
import {
	PATH_APPROVALS,
	PATH_CEREMONIES,
	PATH_DOWNTIME,
	PATH_GROUPS,
	PATH_HERO,
} from "@/utils/constants";
import { getSiteSettings } from "@/utils/settings";
import { useRouter } from "next/router";
import { FaStamp, FaUser, FaUsers } from "react-icons/fa";
import { GiCircleClaws, GiScrollQuill } from "react-icons/gi";

export default function Home() {
	const router = useRouter();
	const { isAdmin, loading } = useUserContext();
	const siteSettings = getSiteSettings();

	const linkStyle = "w-50";

	return (
		<FormContextProvider>
			<ContentWrapper layout="narrow" className="gap-4">
				<div className={`mt-2 pt-3 pb-2 text-center ${fadeStripStyle}`}>
					<h1 className="text-3xl font-bold leading-6">Waystone</h1>
					<i className="text-xs text-muted-foreground">
						The Portal for Concordian Heroes
					</i>
				</div>
				<p>
					Use this site to submit your Hero and Player Group/s for Concord Larp. You'll
					need to sign in to submit. If you run into an issue, get in touch at{" "}
					<i>concordcharacters@gmail.com</i>. Dummy text to see how this looks when we
					have some more things to say in this section.
				</p>
				<div className="flex flex-col sm:flex-row items-center justify-center gap-3">
					<Button onClick={() => router.push(PATH_HERO)} className={linkStyle} size="lg">
						<FaUser />
						<p>Submit your Hero</p>
					</Button>
					{siteSettings.pages.groups && (
						<Button
							onClick={() => router.push(PATH_GROUPS)}
							className={linkStyle}
							size="lg"
						>
							<FaUsers />
							{/* <FaBanner */}
							<p>Submit your Group </p>
						</Button>
					)}
					{siteSettings.pages.downtime && (
						<Button
							onClick={() => router.push(PATH_DOWNTIME)}
							className={linkStyle}
							size="lg"
						>
							<GiScrollQuill />
							<p>Submit your Downtime</p>
						</Button>
					)}
				</div>
				{isAdmin && !loading && (
					<div
						className={`flex flex-col gap-3 rounded-lg animate-in fade-in animation-duration-[300ms]`}
					>
						<p
							className={`text-sm text-center text-muted-foreground ${fadeStripStyle}`}
						>
							Team functions
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-3">
							<Button
								onClick={() => router.push(PATH_APPROVALS)}
								className={linkStyle}
								size="lg"
							>
								<FaStamp />
								<p>Approvals</p>
							</Button>
							{siteSettings.pages.ceremonies && (
								<Button
									onClick={() => router.push(PATH_CEREMONIES)}
									className={linkStyle}
									size="lg"
								>
									<GiCircleClaws />
									<p>Ceremonies</p>
								</Button>
							)}
						</div>
					</div>
				)}
			</ContentWrapper>
		</FormContextProvider>
	);
}
