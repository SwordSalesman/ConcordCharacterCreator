import { styled } from "styled-components";
import { mediaSize } from "../../styles/Global";
import React from "react";

export function ColumnPageComponent({ direction, children }) {
    return (
        <ColumnPageContent direction={direction}>{children}</ColumnPageContent>
    );
}

export const ColumnPage = styled(ColumnPageComponent)`
    padding: 10px;
`;

export const ColumnPageContent = styled.div`
    height: 100%;
    width: 100%;
    position: relative;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    @media (max-width: ${mediaSize.small}px) {
        flex-direction: column;
    }

    animation-name: ${(props) =>
        props.direction === "left" ? "pageSlideInLeft" : "pageSlideInRight"};
    animation-duration: 0.4s;
    animation-timing-function: ease-in-out;

    @keyframes pageSlideInLeft {
        from {
            opacity: 0;
            left: -15px;
        }
        to {
            opacity: 1;
            left: 0px;
        }
    }

    @keyframes pageSlideInRight {
        from {
            opacity: 0;
            left: 15px;
        }
        to {
            opacity: 1;
            left: 0px;
        }
    }
`;
