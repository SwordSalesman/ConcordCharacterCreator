import WikiLink from "@/components/common/WikiLink/WikiLink";
import useFormContext from "../../../hooks/use-form-context";
import toast from "react-hot-toast";

export function Intro() {
	const { form } = useFormContext();
	const { realm, heroName } = form;

	function copyText(text: string) {
		navigator.clipboard.writeText(text);
		toast.success(`Copied '${text}' to clipboard`);
	}

	return (
		<div className="mt-6 max-w-lg text-left">
			<div className="text-lg">
				<i>
					<b>Concord Sect Builder</b>
				</i>
			</div>
			<br />
			<p>
				This form allows you to submit a player group for Concord LARP. It allows the
				Concord team to ensure that your concept fits within the world of the event and
				create the best story for you.
			</p>
			<br />
			<p>
				Only submit your group if you are the best Out of Character contact for the group.
			</p>
			<br />
			<div className="flex gap-2 items-center">
				<p>For guidance in creating a group, check out the Wiki</p>
				<WikiLink path="Player_Groups" />
			</div>
			<br />
			<p>
				When in doubt, feel free to ask for help on The Concord LARP facebook page, discord
				or by emailing{" "}
				<b onClick={() => copyText("concordcharacters@gmail.com")}>
					concordcharacters@gmail.com (click to copy)
				</b>
				.
			</p>
			<br />
			<span className="text-left flex flex-col gap-1">
				<b>How this works:</b>
				<ul className="list-disc flex flex-col gap-1 ml-5">
					<li>Submit your group here, and it will go in for review.</li>
					<li>
						When your group is approved, any player in <b>{realm}</b> can select it when
						submitting their hero. You can then let your group members know to resubmit
						their hero with your group selected.
					</li>
				</ul>
			</span>
		</div>
	);
}
