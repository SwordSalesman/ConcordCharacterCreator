import { Button } from "@/components/common/Button/Button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import WikiLink from "@/components/common/WikiLink/WikiLink";
import { BandCreator } from "@/components/groupCreator/BandCreator";
import { SectCreator } from "@/components/groupCreator/SectCreator";
import ContentWrapper from "@/components/layout/ContentWrapper";
import GroupContextProvider, { GroupType } from "@/context/groupContext";
import useFormContext from "@/hooks/use-form-context";
import useUserContext from "@/hooks/use-user-context";
import { titleWrapperStyle } from "@/styles/Global";
import { getRealmData } from "@/utils/data-helper";
import { copyText, realmicPlayerGroupsLink } from "@/utils/odd-jobs";
import { getSiteSettings } from "@/utils/settings";
import { useState } from "react";
import { CgArrowLeft } from "react-icons/cg";
import { FaExternalLinkAlt } from "react-icons/fa";
import { GiSpellBook, GiTatteredBanner } from "react-icons/gi";

export default function GroupsPage() {
	const { user, loading: userLoading } = useUserContext();
	const { form, loading: formLoading } = useFormContext();
	const { realm, heroName } = form;
	const realmDetails = realm ? getRealmData(realm) : undefined;
	const date = form.date;

	const [builderType, setBuilderType] = useState<GroupType | undefined>(undefined);
	const groupSubmissionsEnabled = getSiteSettings().features.groupSubmissions;

	if (userLoading || (user && formLoading)) {
		return (
			<div className="mt-8">
				<LoadingSpinner />
			</div>
		);
	}

	if (!groupSubmissionsEnabled) {
		return <GroupSubmissionGoogleFormLink />;
	}

	if (!user) {
		return (
			<PreMessage
				title="Sign In Required"
				message="Please sign in to submit your group for approval."
			/>
		);
	}

	if (!date) {
		return (
			<PreMessage
				title="Hero Submission Required"
				message="Please submit your Hero before submitting your group."
			/>
		);
	}

	// Selection screen for Band vs Sect builder
	if (!builderType) {
		return (
			<ContentWrapper>
				<div className="flex flex-col gap-4 px-4">
					<div className={titleWrapperStyle}>
						<i>
							<b>Concord Player Group Submissions</b>
						</i>
					</div>
					<IntroParagraph header="What is this?">
						<p>
							These pages allow you to submit a player group for Concord LARP. It
							allows the Concord team to ensure that your concept fits within the
							world of the event and create the best story for you.
						</p>
					</IntroParagraph>
					<IntroParagraph header="Who should submit?">
						<p>
							Only the best Out of Character contact/organizer for the group should
							submit.
						</p>
						<p>
							Submit your group with the same account used for your Hero submission.{" "}
							<i className="text-muted-foreground">
								(This account has submitted{" "}
								{realmDetails?.citizen ? `the ${realmDetails.citizen} Hero ` : ""}
								{heroName})
							</i>
						</p>
					</IntroParagraph>
					<IntroParagraph header="Need help?">
						<div className="flex gap-2 items-center">
							<p>For guidance in creating a group, check out the Wiki</p>
							<WikiLink path="Player_Groups" />
						</div>
						<div className="flex gap-2 items-center">
							<p>
								For guidance in creating a group in <b>{realm}</b>, check here{" "}
							</p>
							<WikiLink path={realmicPlayerGroupsLink(realm)} />
						</div>
						<p>
							If you're still stuck, reach out by emailing{" "}
							<b onClick={() => copyText("concordcharacters@gmail.com")}>
								concordcharacters@gmail.com (click to copy)
							</b>
							.
						</p>
					</IntroParagraph>
					<IntroParagraph header="How this works:">
						<ul className="list-disc flex flex-col gap-1 ml-5">
							<li>Submit your group here, and it will go in for review.</li>
							<li>
								When your group is approved, players in <b>{realm}</b> can select it
								when submitting their hero. You can then let your group members know
								to resubmit their hero with your group selected.
							</li>
						</ul>
					</IntroParagraph>
					<div
						className={`flex flex-col gap-2 justify-center items-center text-center ${titleWrapperStyle}`}
					>
						<h2 className="text-lg font-bold italic">
							What type of group are you managing?
						</h2>
						<div className="flex gap-2">
							<Button onClick={() => setBuilderType("Band")} size="lg">
								<GiTatteredBanner className="size-8" />
								<p className="text-lg">Band</p>
							</Button>
							<Button onClick={() => setBuilderType("Sect")} size="lg">
								<GiSpellBook className="size-8" />
								<p className="text-lg">Sect</p>
							</Button>
						</div>
					</div>
				</div>
			</ContentWrapper>
		);
	}

	return (
		<ContentWrapper layout="narrow">
			<div>
				<Button
					onClick={() => setBuilderType(undefined)}
					className="flex items-center gap-1 mb-1"
					variant="ghost"
				>
					<CgArrowLeft size={24} /> Back to Groups
				</Button>
			</div>
			{builderType === "Band" ? (
				<GroupContextProvider type="Band">
					<BandCreator />
				</GroupContextProvider>
			) : (
				<GroupContextProvider type="Sect">
					<SectCreator />
				</GroupContextProvider>
			)}
		</ContentWrapper>
	);
}

function GroupSubmissionGoogleFormLink() {
	const bandSubmissionsOpen = true;

	return (
		<div className="mx-auto px-4 py-8 max-w-[500px] flex flex-col text-center gap-5">
			<h1 className="text-2xl font-bold">Group Submissions</h1>
			{bandSubmissionsOpen ? (
				<>
					<p>
						If you're in a band and it hasn't been submitted via the Google Form below,
						please do so before <b className="text-destructive">September 12th</b>. Only
						one member of your band needs to submit.
					</p>
					<div className="w-fit mx-auto">
						<a
							href="https://docs.google.com/forms/d/e/1FAIpQLSfs5PK55UuYUo6MSvzwRGFeBMerAavh61ADhYZK7oJmO2A0qw/viewform"
							target="_blank"
							rel="noreferrer"
						>
							<div className="text-center px-3.5 py-1.5 rounded bg-primary text-primary-foreground flex items-center justify-center gap-2">
								Submit your group
								<FaExternalLinkAlt size={15} />
							</div>
						</a>
					</div>
				</>
			) : (
				<>
					<p>
						<b>We are no long accepting submissions</b>. If you have submitted your
						group already I will get back to you shortly! If you have any queries,
						please email{" "}
						<span
							className="cursor-pointer italic"
							onClick={() => copyText("concordcharacters@gmail.com")}
						>
							<u>concordcharacters@gmail.com</u>
						</span>
					</p>
					<p>Thanks - Dee, Player Group Support</p>
				</>
			)}
		</div>
	);
}

export function PreMessage({ title, message }: { title: string; message: string }) {
	return (
		<div className="mx-auto px-4 py-8 flex flex-col text-center gap-2">
			{title && <h1 className="text-2xl">{title}</h1>}
			<p>{message}</p>
		</div>
	);
}

function IntroParagraph({ header, children }: { header: string; children: React.ReactNode }) {
	return (
		<div className="flex flex-col text-left py-0">
			{header && <h2 className="text-lg font-bold text-accent-foreground">{header}</h2>}
			<div className="flex flex-col gap-3">{children}</div>
		</div>
	);
}
