import WikiLink from "../../common/WikiLink/WikiLink";
import useFormContext from "../../../hooks/use-form-context";
import Button from "../../common/Button/Button";
import { GameTally, TitleWrapper } from "./Intro.style";
import { FlexCenter } from "../../../styles/Global";

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
        <div>
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
                Follow the steps and fill in your character details. To save
                your character for later, and to submit your character to the
                team, you'll need to sign in on the top right. Your character
                won't be submitted until you click <i>submit</i> on the final
                step.
            </p>
            <br />
            <div>
                <TitleWrapper
                    style={{ fontWeight: "bold", fontStyle: "italic" }}
                >
                    How many summits has this character attended?
                </TitleWrapper>
                <FlexCenter style={{ margin: "5px 0" }}>
                    <Button icon='minus' primary onClick={handleMinus}></Button>
                    <GameTally>{gamesPlayed || 0}</GameTally>
                    <Button icon='plus' primary onClick={handlePlus}></Button>
                </FlexCenter>
            </div>
        </div>
    );
}

export default IntroPage;
