import styled from "styled-components";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Banner } from "../common/Banner/Banner";

export function Groups() {
	return (
		<GroupsWrapper>
			<Banner />
			<p>
				If you're in a band and it hasn't been submitted via the Google Form below, please
				do so before <b>September 13th</b>. Only one member of your band needs to submit.
			</p>
			<div style={{ width: "fit-content", margin: "auto" }}>
				<a
					href="https://docs.google.com/forms/d/e/1FAIpQLSfs5PK55UuYUo6MSvzwRGFeBMerAavh61ADhYZK7oJmO2A0qw/viewform"
					target="_blank"
					rel="noreferrer"
				>
					<SubmitBandLink>
						Submit your group
						<FaExternalLinkAlt size={15} />
					</SubmitBandLink>
				</a>
			</div>
		</GroupsWrapper>
	);
}

const GroupsWrapper = styled.div`
	margin: auto;
	padding: 32px 16px;

	max-width: 500px;

	display: flex;
	flex-direction: column;

	text-align: center;

	gap: 20px;

	p {
	}
`;

const SubmitBandLink = styled.div`
	text-align: center;
	padding: 6px 14px;
	border-radius: 4px;
	background: ${(props) => props.theme.specialBg};
	color: ${(props) => props.theme.light};
	text-decoration: none;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
`;
