import styled from "styled-components";

export const ModalBox = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: scale(1) translate(-50%, -50%);

    min-width: 350px;
    width: ${(props) => (props.wide ? "fit-content" : "350px")};

    background-color: ${(props) => props.theme.background};
    border: 1px solid ${(props) => props.theme.border};
    border-radius: 6px;
    box-shadow: 20px;
    padding: 10px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;

    text-align: center;
    line-height: 1rem;

    box-shadow: 0px 1px 30px 8px ${(props) => props.theme.shadow};
    -webkit-box-shadow: 0px 1px 30px 8px ${(props) => props.theme.shadow};
    -moz-box-shadow: 0px 1px 30px 8px ${(props) => props.theme.shadow};

    animation-duration: 0.25s;
    animation-timing-function: ease-in-out;
    animation-name: modalFadeIn;

    @keyframes modalFadeIn {
        from {
            transform: translate(-50% -50%);
            opacity: 0;
        }
    }
`;

export const ModalRow = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 10px;
`;

export const ModalText = styled.div`
    padding-top: 10px;

    h1 {
        font-size: 1.2em;
        margin-bottom: 12px;
    }

    p {
        line-height: 1em;
    }
`;
