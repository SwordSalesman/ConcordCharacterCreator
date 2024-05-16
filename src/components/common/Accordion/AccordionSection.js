import styled from "styled-components";
import WikiLink from "../WikiLink/WikiLink";
import React from "react";
import { RiErrorWarningFill } from "react-icons/ri";

export function AccordionSection({ title, link, warning, children }) {
	return (
		<SectionWrapper>
			<TitleWrapper>
				<p>{title}</p>
				{link && <WikiLink path={link} />}
			</TitleWrapper>
			{warning && (
				<SectionWarning>
					<WarningIcon>
						<RiErrorWarningFill size={24} />
					</WarningIcon>
					{warning}
				</SectionWarning>
			)}
			<ContentWrapper>{children}</ContentWrapper>
		</SectionWrapper>
	);
}

const SectionWrapper = styled.div`
	width: 100%;
	/* margin: 10px 0; */
`;

const TitleWrapper = styled.div`
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: center;
	gap: 10px;
`;

const ContentWrapper = styled.div`
	display: flex;
	width: 100%;
	flex-wrap: wrap;
	justify-content: center;
`;

const WarningIcon = styled.div`
	width: 30px;
	opacity: 0.6;
`;

const SectionWarning = styled.div`
	display: flex;
	align-items: center;
	gap: 6px;

	font-size: 0.8em;
	line-height: 1.3em;
	font-style: italic;
	text-align: left;
	padding: 4px 8px;
	margin: 4px;
	margin-bottom: 6px;
	border-radius: 10px;
	background-color: ${(props) => `${props.theme.error}50`};

	animation: warningFadeIn 0.5s;

	@keyframes warningFadeIn {
		0% {
			opacity: 0;
			scale: 0.75;
		}
		100% {
			opacity: 1;
			scale: 1;
		}
	}
`;
