import styled from "styled-components";
import { mediaSize } from "../../../styles/Global";

export const SkillPageWrapper = styled.div`
    display: flex;
    gap: 8px;

    @media (max-width: ${mediaSize.small}px) {
        flex-direction: column;
    }
`;
