import React, { useEffect, useState } from "react";
import { BiChevronUp } from "react-icons/bi";
import { PATH_GROUPS } from "@/utils/constants";
import { RiExternalLinkLine } from "react-icons/ri";
import { cn } from "@/lib/utils";

export function Banner() {
	const submissionsOpen = false;

	return (
		<BannerInternal
			show={true}
			full={
				submissionsOpen ? (
					<p>
						Submissions will close <b>September 13th</b> for both Characters and{" "}
						<a
							href={PATH_GROUPS}
							style={{
								cursor: "pointer",
								borderRadius: "4px",
								padding: "2px 4px",
								display: "inline-flex",
								alignItems: "center",
								gap: "4px",
								border: "1px solid",
							}}
						>
							Bands
							<RiExternalLinkLine />
						</a>
						. Make sure all your details are submitted before then!
					</p>
				) : (
					<p>
						<b>Submissions are closed.</b> You may still use this form and submit your
						character, but the team is not guaranteed to approve your character or
						provide a character pack.
					</p>
				)
			}
			summary={submissionsOpen ? <p>Last Submit Date</p> : <p>Submissions Closed</p>}
			type={submissionsOpen ? "warning" : "error"}
		/>
	);
}

function BannerInternal({
	show,
	full,
	summary,
	type,
}: {
	show: boolean;
	full: React.ReactNode;
	summary: React.ReactNode;
	type: "success" | "warning" | "error";
}) {
	const [expanded, setExpanded] = useState(true);

	function handleClick() {
		setExpanded((v) => !v);
	}

	function scrollToBanner() {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	useEffect(() => {
		if (show) scrollToBanner();
	}, [show]);

	if (!show) return <></>;

	return (
		<div className="w-full flex justify-center bg-red-transparent">
			<div
				className={cn(
					"mt-[15px] mb-1 text-white rounded-[12px] relative text-[0.9em] max-w-[720px] overflow-hidden transition-all duration-[400ms] animate-banner-in",
					expanded ? "h-[120px] w-[95%] px-6 py-2.5" : "h-[26px] w-[190px] p-3",
				)}
				style={{ background: `var(--banner-${type})` }}
			>
				<div
					className={cn(
						"cursor-pointer z-10 absolute right-0 p-[5px] transition-all duration-[400ms]",
						expanded ? "top-[40px] rotate-0" : "top-[-8px] -rotate-180",
					)}
					onClick={handleClick}
				>
					<BiChevronUp size={30} />
				</div>
				<div
					className={cn(
						"w-full h-full relative flex justify-center items-center text-center max-[600px]:text-[1rem] max-[600px]:leading-[1.2em] transition-all duration-[400ms]",
						expanded ? "pr-0" : "pr-[15px]",
					)}
				>
					<div
						className={cn(
							"absolute transition-all duration-[400ms]",
							expanded ? "opacity-100" : "opacity-0",
						)}
					>
						{full}
					</div>
					<div
						className={cn(
							"absolute transition-all duration-[400ms]",
							expanded ? "opacity-0" : "opacity-100",
						)}
					>
						{summary}
					</div>
				</div>
			</div>
		</div>
	);
}
