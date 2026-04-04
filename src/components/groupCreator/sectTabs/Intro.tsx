import useFormContext from "../../../hooks/use-form-context";
import useGroupContext from "@/hooks/use-group-context";
import { useEffect } from "react";
import { ContentPane } from "@/components/creator/ContentPane/ContentPane";
import { titleWrapperStyle } from "@/styles/Global";
import { ApprovalReport } from "@/components/common/ApprovalReport/ApprovalReport";

export function Intro() {
	const { form, approval } = useFormContext();
	const { setField } = useGroupContext();
	const { realm, date } = form;

	// Not a fan of this, but need to set realm initially as there isn't a selector for it like the character creator
	useEffect(() => {
		setField("type", "Sect");
		if (realm) setField("realm", realm);
	}, [realm]);

	return (
		<ContentPane layout="narrow" className="gap-4 mt-4">
			<div className={`text-lg text-center ${titleWrapperStyle}`}>
				<i>
					<b>Sect Builder</b>
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
						Once you submit your sect, you can check the status of your submission here.
					</p>
					<p>For now, click next to Basics and fill in your details.</p>
				</>
			)}
		</ContentPane>
	);
}
