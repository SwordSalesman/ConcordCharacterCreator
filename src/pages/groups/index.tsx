import { GroupCreator } from "@/components/groupCreator/GroupCreator";
import ContentWrapper from "@/components/layout/ContentWrapper";
import GroupContextProvider from "@/context/groupContext";
import { getGroupList } from "@/hooks/use-firebase";
import useFormContext from "@/hooks/use-form-context";
import useUserContext from "@/hooks/use-user-context";
import { getSiteSettings } from "@/utils/settings";
import { useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function GroupsPage() {
	const { user } = useUserContext();
	const [groupList, setGroupList] = useState<string[]>([]);
	const { form } = useFormContext();
	const date = form.date;

	const groupSubmissionsEnabled = getSiteSettings().features.groupSubmissions;

	useEffect(() => {
		if (user) {
			getGroupList().then((data) => {
				if (data && data.groups) {
					setGroupList(data.groups);
				}
			});
		}
	}, [user]);

	if (!groupSubmissionsEnabled) {
		return <GroupSubmissionGoogleFormLink />;
	}

	if (!user) {
		return <PreMessage message="Please sign in to submit your group for approval." />;
	}

	if (!date) {
		return <PreMessage message="Please submit your Hero before submitting your group." />;
	}

	return (
		<GroupContextProvider>
			<ContentWrapper layout="narrow">
				<GroupCreator />
			</ContentWrapper>
		</GroupContextProvider>
	);
}

function GroupSubmissionGoogleFormLink() {
	return (
		<div className="mx-auto px-4 py-8 max-w-[500px] flex flex-col text-center gap-5">
			<h1 className="text-2xl font-bold">Group Submissions</h1>
			<p>
				If you're in a band and it hasn't been submitted via the Google Form below, please
				do so before <b>September 13th</b>. Only one member of your band needs to submit.
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
		</div>
	);
}

function PreMessage({ message }: { message: string }) {
	return (
		<div className="mx-auto px-4 py-8 flex flex-col text-center gap-5">
			<h1 className="text-2xl font-bold">Group Submissions</h1>
			<p>{message}</p>
		</div>
	);
}
