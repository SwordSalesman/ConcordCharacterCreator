import { styled } from "styled-components";
import { mediaSize } from "../../../styles/Global";

export const HeaderWrapper = styled.div`
    /* height: 36px; */
    height: 50px;
    width: 100%;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 24px;
    /* box-shadow: ${(props) => "0 0 10px " + props.theme.shadow}; */
    background-color: ${(props) => props.theme.background};
    border-bottom: 1px solid ${(props) => props.theme.borderSoft};

    /* margin-bottom: 30px; */
    position: fixed;
    top: 0;
    z-index: 100;
`;

export const HeaderButtonContent = styled.div`
    display: flex;
    align-content: center;
    align-items: center;
    /* line-height: 1.3rem; */
    gap: 4px;

    transition-duration: 0.3s;
    color: ${(props) => props.color};

    p {
        font-size: 0.9rem;
        line-height: 1rem;
    }

    @media (max-width: ${mediaSize.small}px) {
        p {
            line-height: 0.9em;
            width: min-content;
        }
    }
`;

export const HeaderSigilWrapper = styled.a`
    height: 42px;
    width: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const HeaderConcordSigil = styled.img`
    height: 25px;
    width: 25px;
    margin: auto;
`;
