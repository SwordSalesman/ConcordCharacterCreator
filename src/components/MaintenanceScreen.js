import { FaHammer } from "react-icons/fa";
import styled from "styled-components";

function MaintenanceScreen() {
    return (
        <MaintenanceScreenWrapper>
            <MaintenanceScreenContent>
                <FaHammer size={30} />
                <b>Under Maintenance</b>
                <p>
                    The character creator is having some work done, sorry for
                    the inconvenience. Check back soon.
                </p>
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
