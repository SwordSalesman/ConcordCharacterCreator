import WikiLink from "../common/WikiLink";
import useFormContext from "../../hooks/use-form-context";
import Button from "../common/Button";

function IntroPage() {
  const { gamesPlayed, setGamesPlayed } = useFormContext();

  const handleMinus = () => {
    if (gamesPlayed > 0) {
      setGamesPlayed(gamesPlayed - 1);
    }
  };

  const handlePlus = () => {
    if ((new Date().getFullYear() - 2019) * 2 - gamesPlayed > 0) {
      setGamesPlayed(gamesPlayed + 1);
    }
  };

  return (
    <div>
      <br />
      <p className="text-lg">
        Welcome to the{" "}
        <i>
          <b>Concord Character Creator</b>
        </i>
      </p>
      <br />
      <div className="flex justify-center">
        <p>You can click on these </p>
        <WikiLink className="mx-2" />
        <p>to take you right to the relevant wiki page.</p>
      </div>
      <br />
      <p>
        Navigate along the tabs above to fill in your character details. Your
        progress will be saved as you go. At the end of the Review tab you'll be
        able to send off your finished character to the Concord team's email
        inbox. Your character won't be submitted until you do this!
      </p>
      <br />
      <div>
        <p className="text-lg italic font-semibold">
          How many summits has this character attended?
        </p>
        <div className="flex justify-center align-top">
          <Button icon="minus" onClick={handleMinus}></Button>
          <div className="select-none font-sans text-2xl w-8">
            {gamesPlayed || 0}
          </div>
          <Button icon="plus" onClick={handlePlus}></Button>
        </div>
      </div>
    </div>
  );
}

export default IntroPage;
