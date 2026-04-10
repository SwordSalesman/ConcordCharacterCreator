import useFormContext from "../../../hooks/use-form-context";
import { bandWarning, xpWarning } from "../../../utils/validity-helper";
import { Warning } from "@/components/common/Accordion/AccordionSection";
import { TextArea } from "@/components/common/Input/Input";
import { ContentPane } from "@/components/creator/ContentPane/ContentPane";
import { CharacterSheet } from "../CharacterSheet";

export function ReviewPage() {
	const { form, setField, validateForm, remaining, bands } = useFormContext();
	const { comments, warband, realm } = form;
	const { valid, validRealm, validName, validInvestment } = validateForm();

	// This simple check avoids the page crashing during a log in form reset
	if (!form.spells || !form.crafts || !form.potions || !form.ceremonies) {
		return;
	}

	console.debug("Player form:");
	console.debug(form);

	const xpWarningText = xpWarning(remaining.xp);
	const bandWarningText = bandWarning({ warband, realm, bands });

	return (
		<ContentPane layout="narrow">
			{!valid && (
				<div className="text-destructive italic mb-2.5">
					<p>Required fields:</p>
					<ul>
						{!validName ? <li>Hero Name</li> : null}
						{!validRealm ? <li>Realm</li> : null}
						{!validInvestment ? <li>Investment</li> : null}
					</ul>
				</div>
			)}
			{xpWarningText && <Warning>{xpWarningText}</Warning>}
			{bandWarningText && <Warning>{bandWarningText}</Warning>}
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
