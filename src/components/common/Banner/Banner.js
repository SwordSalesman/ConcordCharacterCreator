import React, { useEffect, useState } from "react";
import {
	BannerArrow,
	BannerContent,
	BannerSpacer,
	BannerWrapper,
	FullText,
	SummaryText,
} from "./Banner.style";
import { BiChevronUp } from "react-icons/bi";
import { RiExternalLinkLine } from "react-icons/ri";
import toast from "react-hot-toast";
import { PATH_GROUPS } from "../../../helpers/constants";

export function Banner({ show, full, summary, type }) {
	// const submissionsOpen = Date.now() < new Date("2024-09-07T23:59:59.000+08:00");
	const submissionsOpen = true;

	return (
		<BannerInternal
			show={false}
			full={
				submissionsOpen ? (
					<p>
						Downtime submissions for G10 are now open! Submit{" "}
						<a
							href={"https://forms.gle/q4BwTYmx2GEvdsLE8"}
							style={{
								cursor: "pointer",
								// textDecoration: "underline",
								borderRadius: "4px",
								padding: "2px 4px",
								display: "inline-flex",
								alignItems: "center",
								gap: "4px",
								border: "1px solid",
								// background: "#ffffff2d",
							}}
							target="_blank"
							rel="noreferrer"
						>
							here
							<RiExternalLinkLine />
						</a>{" "}
						before close on October 18th.
					</p>
				) : (
					<p>
						<b>Character and Band submissions are closed.</b> Please do not submit
						changes unless requested. If you have a reason for exception, please email{" "}
						<span
							onClick={() => {
								navigator.clipboard.writeText("concordcharacters@gmail.com");
								toast.success(`Copied email to clipboard`);
							}}
							style={{ textDecoration: "underline", cursor: "pointer" }}
						>
							<i>concordcharacters@gmail.com</i>
						</span>{" "}
						first.
					</p>
				)
			}
			summary={submissionsOpen ? <p>Downtime Open</p> : <p>Submissions Closed</p>}
			type={submissionsOpen ? "warning" : "error"}
		/>
	);
}

function BannerInternal({ show, full, summary, type }) {
	const [expanded, setExpanded] = useState(true);

	function handleClick() {
		setExpanded((expandValue) => !expandValue);
	}

	function scrollToBanner() {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	useEffect(() => {
		if (show) scrollToBanner();
	}, [show]);

	if (!show) {
		return <></>;
	}

	return (
		<BannerSpacer>
			<BannerWrapper expanded={expanded} type={type ?? "warning"}>
				<BannerArrow expanded={expanded} onClick={handleClick}>
					<BiChevronUp size={30} />
				</BannerArrow>
				<BannerContent>
					<FullText expanded={expanded}>
						{full}
						{/* <p>{approval ? approval.status : null}</p> */}
					</FullText>
					<SummaryText expanded={expanded}>{summary}</SummaryText>
				</BannerContent>
			</BannerWrapper>
		</BannerSpacer>
	);
}
