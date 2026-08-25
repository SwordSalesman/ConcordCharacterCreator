import useFormContext from "../../../hooks/use-form-context";
import { bandWarning, investmentRegionWarning, xpWarning } from "../../../utils/validity-helper";
import { Warning } from "@/components/common/Warning";
import { TextArea } from "@/components/common/Input/Input";
import { ContentPane } from "@/components/creator/ContentPane/ContentPane";
import { CharacterSheet } from "../CharacterSheet";

export function ReviewPage() {
	const { form, setField, validateForm, remaining, bands } = useFormContext();
	const { comments, warband, realm } = form;
	const {
		valid,
		validRealm,
		validName,
		validInvestment,
		validBackstory,
		validInvDetails,
		validIcGoals,
		validOocGoals,
	} = validateForm();

	// This simple check avoids the page crashing during a log in form reset
	if (!form.spells || !form.crafts || !form.potions || !form.ceremonies) {
		return;
	}

	console.debug("Player form:");
	console.debug(form);

	const xpWarningText = xpWarning(remaining.xp);
	const bandWarningText = bandWarning({ warband, realm, bands });
	const investmentRegionWarningText =
		form.invRegion && form.realm ? investmentRegionWarning(realm, form.invRegion) : undefined;

	const requiredFields = [];
	if (!validName) requiredFields.push("Hero Name");
	if (!validRealm) requiredFields.push("Realm");
	if (!validInvestment) requiredFields.push("Investment");
	if (!validBackstory) requiredFields.push("Backstory");
	if (!validInvDetails) requiredFields.push("Investment Details");
	if (!validIcGoals) requiredFields.push("IC Goals");
	if (!validOocGoals) requiredFields.push("OOC Goals");

	return (
		<ContentPane layout="narrow">
			{!valid && (
				<Warning>
					<p>Required fields:</p>
					<p>{requiredFields.join(", ")}</p>
				</Warning>
			)}
			{bandWarningText && <Warning>{bandWarningText}</Warning>}
			{xpWarningText && <Warning variant="warning">{xpWarningText}</Warning>}
			{investmentRegionWarningText && (
				<Warning variant="warning">{investmentRegionWarningText}</Warning>
			)}
			<div className="mt-2 mb-6">
				<CharacterSheet data={form} />
			</div>
			<div className="rounded-[12px] px-2 [&_div_textarea]:border [&_div_textarea]:border-border [&_div_textarea]:border-solid">
				<div className="flex flex-col gap-2 w-full my-4">
					<TextArea
						value={comments}
						onChange={(e) => setField("comments", e.target.value)}
						title={"Final submission comments"}
						placeholder="Notes for the team (if any)"
					/>
				</div>
			</div>
		</ContentPane>
	);
}
