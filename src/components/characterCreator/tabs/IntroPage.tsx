import WikiLink from "../../common/WikiLink/WikiLink";
import useFormContext from "../../../hooks/use-form-context";
import { BiMinus, BiPlus } from "react-icons/bi";
import { Button } from "@/components/common/Button/Button";
import { fadeStripStyle, titleWrapperStyle } from "@/styles/Global";

export function IntroPage() {
	const { form, setField } = useFormContext();
	const { gamesPlayed } = form;

	const maxGames = (new Date().getFullYear() - 2019) * 2;

	const handleMinus = () => {
		if (gamesPlayed > 0) {
			setField("gamesPlayed", gamesPlayed - 1);
		}
	};

	const handlePlus = () => {
		if (gamesPlayed < maxGames) {
			setField("gamesPlayed", gamesPlayed + 1);
		}
	};

	return (
		<div style={{ marginTop: "15px" }}>
			<div className={titleWrapperStyle}>
				<p>Welcome to the </p>
				<i>
					<b>Concord Character Creator</b>
				</i>
			</div>
			<br />
			<div className="flex justify-center gap-2">
				<p>Click on these </p>
				<WikiLink />
				<p> for a relevant wiki page.</p>
			</div>
			<br />
			<p>
				To save and submit your character to the team, you'll need to sign in on the top
				right. Your character won't be saved or submitted until you click{" "}
				<i>Save & Submit</i> on the final step.
			</p>
			<br />
			<div className={titleWrapperStyle}>
				<div className={"font-bold italic"}>
					How many summits has this character attended?
				</div>
				<div className="flex flex-row items-center justify-center mt-1">
					<Button onClick={handleMinus}>
						<BiMinus />
					</Button>
					<div className="text-xl font-bold font-sans w-12">{gamesPlayed || 0}</div>
					<Button onClick={handlePlus}>
						<BiPlus />
					</Button>
				</div>
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "right",
					marginTop: "60px",
				}}
			></div>
		</div>
	);
}
