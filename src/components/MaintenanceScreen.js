import { FaHammer } from "react-icons/fa";
import styled from "styled-components";
import ConcordLogo from "../data/images/concord-logo.png";

function MaintenanceScreen() {
    return (
        <MaintenanceScreenWrapper>
            <MaintenanceScreenContent>
                <ConcordRepairSymbol>
                    <div id='repair-hammer'>
                        <FaHammer size={40} />
                    </div>
                    <div id='repair-sigil'>
                        <img src={ConcordLogo} alt='Concord Sigil' />
                    </div>
                </ConcordRepairSymbol>
                <Title>Under Maintenance</Title>
                <TextBlock>
                    <p>
                        The character creator is having some work done, check
                        back here shortly. Sorry for the inconvenience!
                    </p>
                    <i>- Concord Web Team</i>
                </TextBlock>
            </MaintenanceScreenContent>
        </MaintenanceScreenWrapper>
    );
}

export default MaintenanceScreen;

const MaintenanceScreenWrapper = styled.div`
    position: relative;
    height: 100vh;
    width: 100vw;
`;

const MaintenanceScreenContent = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    width: 90%;
    height: 90%;
    translate: -50% -50%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
`;

const Title = styled.h1`
    font-size: 1.2rem;
    font-weight: bold;
`;

const TextBlock = styled.div`
    width: 50%;
    min-width: 300px;
    line-height: 1.3em;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const ConcordRepairSymbol = styled.div`
    position: relative;
    height: 40px;
    width: 80px;

    #repair-hammer {
        position: absolute;
        right: 50%;

        animation: hammer-hit ease-in-out 3s infinite normal none;
        animation-delay: 1.85s;

        @keyframes hammer-hit {
            0%,
            100% {
                transform: rotate() translate(0, 0);
                /* transform-origin: right; */
            }

            10%,
            90% {
                transform: rotate() translate(0, 0);
                /* transform-origin: right; */
            }

            35%,
            50%,
            70% {
                transform: rotate(-20deg) translate(10px, -20px);
            }

            42%,
            57% {
                transform: rotate(10deg) translate(10px, -18px);
            }
        }
    }

    #repair-sigil {
        position: absolute;
        width: 40px;
        height: 40px;
        left: 50%;

        animation: sigil-quiver ease-in-out 3s infinite normal none;

        @keyframes sigil-quiver {
            0%,
            50% {
                transform: rotate(0deg);
                /* transform-origin: 50% 50%; */
            }

            5% {
                transform: rotate(8deg);
            }

            10%,
            20%,
            30% {
                transform: rotate(-10deg);
            }

            15%,
            25%,
            35% {
                transform: rotate(10deg);
            }

            40% {
                transform: rotate(-8deg);
            }

            45% {
                transform: rotate(8deg);
            }
        }
    }
`;
