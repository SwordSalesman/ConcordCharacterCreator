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

export function Banner({ show, full, summary, type }) {
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
			<BannerWrapper
				expanded={expanded}
				onClick={handleClick}
				type={type ?? "warning"}
			>
				<BannerArrow expanded={expanded}>
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
