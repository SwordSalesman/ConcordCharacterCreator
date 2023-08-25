import { styled } from "styled-components";
import { mediaSize } from "../../styles/Global";

export function ColumnPageComponent({
    background,
    position,
    mobileShow,
    children,
}) {
    return (
        <ColumnPageContent>
            {children}
            {background && false && (
                <BackgroundImage
                    src={background}
                    mobileShow={mobileShow}
                    alt='A blurred realmic sigil'
                    unselectable='on'
                />
            )}
        </ColumnPageContent>
    );
}

export const ColumnPage = styled(ColumnPageComponent)``;

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
`;

export const BackgroundImage = styled.img`
    position: absolute;
    top: 45%;
    left: 50%;

    width: 350px;
    height: 350px;
    /* right: -100%; */
    /* margin: auto; */

    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);

    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;

    animation: fadeIn 1s;
    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 0.1;
        }
    }

    filter: blur(2px);
    opacity: 0.1;
    z-index: 1;

    /* transform: ${(props) =>
        props.imageCenter ? "translate(-50%, 5%)" : "translate(-100%, 5%)"}; */

    @media (max-width: ${mediaSize.small}px) {
        ${(props) => !props.mobileShow && "display: none;"}
    }
`;
