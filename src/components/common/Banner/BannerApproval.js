import React, { useEffect, useMemo, useState } from "react";
import {
	BannerArrow,
	BannerContent,
	BannerSpacer,
	BannerWrapper,
	FullText,
	SummaryText,
} from "./Banner.style";
import { BiChevronUp } from "react-icons/bi";
import { getPrevAndNextGame, prettifyDate } from "../../../helpers/date-helper";
import { APPROVED, DENIED } from "../../../helpers/constants";

function getApprovalState(prev, dateSubmitted, approval) {
	if (!dateSubmitted) {
		return 0; // Not Submitted
	}
	if (!approval?.date || !approval?.status || approval.date < dateSubmitted) {
		return 1; // Awaiting Review
	}
	if (approval.status === DENIED) {
		return 2; // Changes Requested
	}
	if (dateSubmitted < prev.date && approval.status === APPROVED) {
		return 3; // Old but Approved
	}
	if (dateSubmitted > prev.date && approval.status === APPROVED) {
		return 4; // Approved
	}
}

export function BannerApproval({ show, dateSubmitted, approval }) {
	const [expanded, setExpanded] = useState(true);
	const [submitState, setSubmitState] = useState(0);

	const { prev, next } = useMemo(() => getPrevAndNextGame(), []);

	function handleClick() {
		setExpanded((expandValue) => !expandValue);
	}

	function scrollToBanner() {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	useEffect(() => {
		if (show) scrollToBanner();
	}, [show]);

	function getStateMessages() {
		if (submitState === 0) {
			return {
				full: `You haven't submitted a character yet. Don't forget to submit for ${next.name}.`,
				summary: "Not Submitted",
			};
		} else if (submitState === 1) {
			return {
				full: `Your submission on ${prettifyDate(
					dateSubmitted
				)} is waiting to be reviewed by the team.`,
				summary: "Awaiting Review",
			};
		} else if (submitState === 2) {
			return {
				full: `Your submission on ${prettifyDate(
					dateSubmitted
				)} has had changes requested.`,
				summary: "Changes Requested",
			};
		} else if (submitState === 3) {
			return {
				full: `Your submission on ${prettifyDate(
					dateSubmitted
				)} was approved for a previous game, and is ready for ${
					next.name
				}`,
				summary: "Submitted",
			};
		} else if (submitState === 4) {
			return {
				full: `Your submission on ${prettifyDate(
					dateSubmitted
				)} is approved ready for ${next.name}`,
				summary: "Submitted",
			};
		}
	}

	useEffect(() => {
		setSubmitState(getApprovalState(prev, dateSubmitted, approval));
	}, [prev, dateSubmitted, approval]);

	const messages = getStateMessages(submitState);

	if (!show) {
		return <></>;
	}

	const type =
		submitState === 3 || submitState === 4
			? "success"
			: submitState === 2 || submitState === 0
			? "error"
			: "warning";

	return (
		<BannerSpacer>
			<BannerWrapper
				expanded={expanded}
				onClick={handleClick}
				type={type}
			>
				<BannerArrow expanded={expanded}>
					<BiChevronUp size={30} />
				</BannerArrow>
				<BannerContent>
					<FullText expanded={expanded}>
						{messages.full}
						{/* <p>{approval ? approval.status : null}</p> */}
					</FullText>
					<SummaryText expanded={expanded}>
						{messages.summary}
					</SummaryText>
				</BannerContent>
			</BannerWrapper>
		</BannerSpacer>
	);
}
