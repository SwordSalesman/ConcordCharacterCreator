import React, { useEffect, useState } from "react";

import { BiChevronUp } from "react-icons/bi";
import { PATH_GROUPS } from "@/utils/constants";
import { RiExternalLinkLine } from "react-icons/ri";
import styled, { css } from "styled-components";
import { mediaSize } from "@/styles/Global";

export function Banner() {
	const submissionsOpen = true;

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
								// textDecoration: "underline",
								borderRadius: "4px",
								padding: "2px 4px",
								display: "inline-flex",
								alignItems: "center",
								gap: "4px",
								border: "1px solid",
								// background: "#ffffff2d",
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
				<BannerContent expanded={expanded}>
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

export const BannerSpacer = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
`;

export const BannerWrapper = styled.div<{
	expanded: boolean;
	type: "success" | "warning" | "error";
}>`
	/* cursor: pointer; */
	margin: 15px 0 0 0;
	padding: ${(props) => (props.expanded ? "10px 24px" : "12px")};
	color: white;
	border-radius: 12px;
	position: relative;
	font-size: 0.9em;

	height: ${(props) => (props.expanded ? "120px" : "26px")};
	width: ${(props) => (props.expanded ? "95%" : "190px")};
	max-width: 720px;
	overflow: hidden;

	background: rgb(153, 153, 153);
	${(props) =>
		props.type === "success" &&
		css`
			background: ${(props) => props.theme.bannerSuccess};
		`}
	${(props) =>
		props.type === "warning" &&
		css`
			background: ${(props) => props.theme.bannerWarning};
		`}
    ${(props) =>
		props.type === "error" &&
		css`
			background: ${(props) => props.theme.bannerError};
		`}

    transition: all;
	transition-duration: 0.4s;

	animation-duration: 1.5s;
	animation-timing-function: ease-in-out;

	@media (min-width: ${mediaSize.small}px) {
		animation-name: createBannerDesktop;
	}
	@media (max-width: ${mediaSize.small}px) {
		animation-name: createBannerMobile;
		margin-top: 10px;
	}

	@keyframes createBannerDesktop {
		from {
			transform: scale(0);
			opacity: 0;
			height: 0;
			margin: 0;
			padding: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
			${(props) => (props.expanded ? "70px" : "26px")};
			margin-top: 15px;
		}
	}

	@keyframes createBannerMobile {
		from {
			transform: scale(0);
			opacity: 0;
			height: 0;
			margin: 0;
			padding: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
			${(props) => (props.expanded ? "70px" : "26px")};
			margin-top: 10px;
		}
	}
`;

export const BannerArrow = styled.div<{
	expanded: boolean;
}>`
	cursor: pointer;
	z-index: 10;
	position: absolute;
	right: 0px;
	top: ${(props) => (props.expanded ? "40px" : "-8px")};

	padding: 5px;

	transition-duration: 0.4s;

	transform: ${(props) => (props.expanded ? "rotate(0deg)" : "rotate(-180deg)")};
`;

export const BannerContent = styled.div<{
	expanded: boolean;
}>`
	width: 100%;
	height: 100%;
	position: relative;
	display: flex;
	/* justify-content: ${(props) => (props.expanded ? "center" : "left")}; */
	padding-right: ${(props) => (props.expanded ? "0" : "15px")};
	justify-content: center;
	align-items: center;
	text-align: center;

	@media (max-width: ${mediaSize.small}px) {
		font-size: 1rem;
		line-height: 1.2em;
	}

	/* animation-delay: 0.9s;
    animation-duration: 0.5s;
    animation-name: createBannerContent;

    @keyframes createBannerContent {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    } */
`;

export const FullText = styled.div<{
	expanded: boolean;
}>`
	position: absolute;
	transition: all;
	transition-duration: 0.4s;
	opacity: ${(props) => (props.expanded ? "1" : "0")};
`;

export const SummaryText = styled.div<{
	expanded: boolean;
}>`
	position: absolute;
	transition: all;
	transition-duration: 0.4s;
	opacity: ${(props) => (props.expanded ? "0" : "1")};
`;
