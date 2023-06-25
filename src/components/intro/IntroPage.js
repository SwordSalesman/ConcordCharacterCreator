import WikiLink from "../common/WikiLink/WikiLink";
import useFormContext from "../../hooks/use-form-context";
import Button from "../common/Button/Button";
import { TitleWrapper } from "./Intro.style";
import { FlexCenter } from "../../styles/Global";

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
      <br />
      <TitleWrapper>
        Welcome to the{" "}
        <i>
          <b>Concord Character Creator</b>
        </i>
      </TitleWrapper>
      <br />
      <FlexCenter>
        <p>You can click on these </p>
        <WikiLink style={{ margin: "0px 8px" }} />
        <p>to take you right to the relevant wiki page.</p>
      </FlexCenter>
      <br />
      <p>
        Navigate along the tabs above to fill in your character details. Your
        progress will be saved as you go. At the end of the Review tab you'll be
        able to send off your finished character to the Concord team's email
        inbox. Your character won't be submitted until you do this!
      </p>
      <br />
      <div>
        <TitleWrapper style={{ fontWeight: "bold", fontStyle: "italic" }}>
          How many summits has this character attended?
        </TitleWrapper>
        <FlexCenter>
          <Button icon="minus" onClick={handleMinus}></Button>
          <div
            style={{
              fontSize: "1.4rem",
              width: "50px",
              fontFamily: "sans-serif",
            }}
          >
            {gamesPlayed || 0}
          </div>
          <Button icon="plus" onClick={handlePlus}></Button>
        </FlexCenter>
      </div>
    </div>
  );
}

export default IntroPage;
