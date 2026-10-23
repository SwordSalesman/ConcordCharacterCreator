import WikiLink from "../../common/WikiLink/WikiLink";
import useFormContext from "../../../hooks/use-form-context";
import { PiArrowBendRightDownBold } from "react-icons/pi";
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
			<div className="max-w-xl">
				<div className="flex justify-center gap-2 items-center">
					<p className="">Click on these for a relevant wiki page</p>
					<div className="relative pl-5 pr-3">
						<div className="absolute top-0 -left-0 pointer-none -rotate-60">
							<PiArrowBendRightDownBold className="size-5" />
						</div>
						<WikiLink className="animate-scale-pulse" />
						<div className="absolute top-2 -right-2.5 pointer-none rotate-120">
							<PiArrowBendRightDownBold className="size-5" />
						</div>
					</div>
				</div>
				<br />
				<div className="flex justify-center gap-1 items-center">
					<p className="">Need help building your character? Click here </p>
					<WikiLink path="Character_Creation" />
				</div>
				<br />
				<p>
					Your character won't be saved or submitted until you click <b>Save & Submit</b>{" "}
					on the final step.
				</p>
			</div>
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
