import { CgSpinner } from "react-icons/cg";

export function LoadingSpinner() {
	return (
		<div className="flex justify-center items-center">
			<CgSpinner className="animate-spin" size="28" />
		</div>
	);
}
