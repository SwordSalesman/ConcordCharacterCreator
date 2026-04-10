import { FaHammer } from "react-icons/fa";
import ConcordLogo from "../data/images/concord-logo.png";
import Image from "next/image";

export default function MaintenanceScreen() {
	const hammerKeyframes = `
		@keyframes hammer-hit {
			0%, 10%, 90%, 100% { transform: rotate(0) translate(0, 0); }
			35%, 50%, 70% { transform: rotate(-20deg) translate(10px, -20px); }
			42%, 57% { transform: rotate(10deg) translate(10px, -18px); }
		}`;
	const sigilKeyframes = `
		@keyframes sigil-quiver {
			0% { transform: rotate(0deg); }
			5% { transform: rotate(8deg); }
			10% { transform: rotate(-10deg); }
			15% { transform: rotate(10deg); }
			20% { transform: rotate(-10deg); }
			25% { transform: rotate(10deg); }
			30% { transform: rotate(-8deg); }
			35% { transform: rotate(8deg); }
			40% { transform: rotate(0deg); }
		}`;

	return (
		<div className="fixed inset-0 h-screen w-screen bg-white z-[1000] text-black">
			<style>{hammerKeyframes + sigilKeyframes}</style>
			<div className="absolute left-1/2 top-[30%] w-[90%] h-[90%] -translate-x-1/2 -translate-y-1/2 text-center flex flex-col items-center justify-center gap-2">
				<div className="relative h-10 w-20">
					<div
						className="absolute right-1/2"
						style={{ animation: "hammer-hit 3s ease-in-out infinite" }}
					>
						<FaHammer size={40} color="black" />
					</div>
					<div
						className="absolute left-1/2 w-10 h-10"
						style={{
							animation: "sigil-quiver 3s ease-out infinite",
							animationDelay: "1.15s",
						}}
					>
						<Image src={ConcordLogo} alt="Concord Sigil" />
					</div>
				</div>
				<h1 className="text-lg font-bold">Under Maintenance</h1>
				<div className="w-sm flex flex-col gap-0 leading-6">
					<p>
						Artisans are hard at work improving the site. Hopefully it won't take long.
					</p>
				</div>
			</div>
		</div>
	);
}
