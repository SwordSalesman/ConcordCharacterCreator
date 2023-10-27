import WikiLink from "../../common/WikiLink/WikiLink";
import useFormContext from "../../../hooks/use-form-context";
import Button from "../../common/Button/Button";
import { GameTally, TitleWrapper } from "./Intro.style";
import { FlexCenter } from "../../../styles/Global";
import { BiMinus, BiPlus } from "react-icons/bi";

function IntroPage() {
    const { gamesPlayed, setGamesPlayed } = useFormContext();
    // Little bit of extra wiggle room here for planning future builds
    const maxGames = (new Date().getFullYear() - 2019) * 2;

    const handleMinus = () => {
        if (gamesPlayed > 0) {
            setGamesPlayed(gamesPlayed - 1);
        }
    };

    const handlePlus = () => {
        if (gamesPlayed < maxGames) {
            setGamesPlayed(gamesPlayed + 1);
        }
    };

    return (
        <div style={{ marginTop: "15px" }}>
            <TitleWrapper>
                <p>Welcome to the </p>
                <i>
                    <b>Concord Character Creator</b>
                </i>
            </TitleWrapper>
            <br />
            <FlexCenter>
                <p>Click on these </p>
                <WikiLink style={{ margin: "0px 6px" }} />
                <p> for a relevant wiki page.</p>
            </FlexCenter>
            <br />
            <p>
                Follow the steps and fill in your character details. To save and
                submit your character to the team, you'll need to sign in on the
                top right. Your character won't be saved or submitted until you
                click <i>Submit</i> on the final step.
            </p>
            <br />
            <TitleWrapper>
                <div
                    style={{
                        fontWeight: "bold",
                        fontStyle: "italic",
                        // color: theme.special,
                        padding: 8,
                    }}
                >
                    How many summits has this character attended?
                </div>
                <FlexCenter
                    style={{
                        margin: "5px 0",
                    }}
                >
                    <Button secondary onClick={handleMinus}>
                        <BiMinus />
                    </Button>
                    <GameTally>{gamesPlayed || 0}</GameTally>
                    <Button secondary onClick={handlePlus}>
                        <BiPlus />
                    </Button>
                </FlexCenter>
            </TitleWrapper>
            <div
                style={{
                    display: "flex",
                    justifyContent: "right",
                    marginTop: "60px",
                }}
            ></div>
        </div>
    );
}

export default IntroPage;
