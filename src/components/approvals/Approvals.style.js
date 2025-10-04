import styled from "styled-components";
import Button from "../common/Button/Button";

export const ApprovalsWrapper = styled.div`
	margin: auto;
	margin-top: 10px;
	display: flex;
	flex-direction: row;
	height: 90vh;
	min-height: 600px;
	max-width: 1100px;
	width: 95%;

	font-family: Arial, Helvetica, sans-serif;
	/* background-color: ${(props) => props.theme.backgroundRaised}; */
`;

export const ApprovalListWrapper = styled.div`
	border: 1px solid ${(props) => props.theme.border};
	margin-right: 10px;
	border-top-right-radius: 10px;
	border-top-left-radius: 10px;
	flex: 1;
	width: 100%;
	position: relative;
	overflow-y: scroll;
	&::-webkit-scrollbar {
		display: none;
	}
	-ms-overflow-style: none;
	scrollbar-width: none;
`;

export const ApprovalSelectWrapper = styled.div`
	flex: 2;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

export const ExportContents = styled.div`
	display: flex;
	gap: 4px;
	margin: 0 4px;
`;

export const LeftColumn = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 6px;
	height: 100%;
`;
