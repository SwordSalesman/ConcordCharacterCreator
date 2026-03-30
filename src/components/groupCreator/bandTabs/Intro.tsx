import useFormContext from "../../../hooks/use-form-context";
import { titleWrapperStyle } from "@/styles/Global";
import { ApprovalReport } from "@/components/common/ApprovalReport/ApprovalReport";
import { ContentPane } from "@/components/creator/ContentPane/ContentPane";

export function Intro() {
	const { form, approval } = useFormContext();
	const { realm, heroName, date } = form;

	return (
		<ContentPane layout="narrow" className="gap-4 mt-4">
			<div className={`text-lg text-center ${titleWrapperStyle}`}>
				<i>
					<b>Band Builder</b>
				</i>
			</div>
			{approval ? (
				<>
					<p>You can check the status of your submission here.</p>
					<div className="border rounded-lg p-2 px-3 bg-background-raised shadow-lg">
						<ApprovalReport approval={approval} dateSubmitted={date} />
					</div>
				</>
			) : (
				<>
					<p>
						Once you submit your band, you can check the status of your submission here.
					</p>
					<p>For now, click next to Basics and fill in your details.</p>
				</>
			)}
		</ContentPane>
	);
}
