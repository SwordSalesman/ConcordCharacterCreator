import WikiLink from "../components/WikiLink";
import useFormContext from "../hooks/use-form-context";

function IntroPage() {
  const { gamesPlayed, setGamesPlayed } = useFormContext();

  const handleChange = (event) => {
    if (event.target.value > 0) {
      setGamesPlayed(event.target.value);
    } else {
      setGamesPlayed(0);
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
        <p>If you ever see one of these</p>
        <WikiLink className="mx-2" />
        <p>
          give it a click! It will take you right to the relevant wiki page.
        </p>
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
        <input
          value={gamesPlayed || 0}
          className="input text-3xl border-2 rounded-lg pl-2 w-12"
          type="number"
          onChange={handleChange}
        ></input>
      </div>
    </div>
  );
}

export default IntroPage;
