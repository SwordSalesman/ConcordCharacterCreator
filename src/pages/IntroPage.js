import WikiLink from "../components/WikiLink";

function IntroPage() {
  return (
    <div>
      <p>
        Welcome to the{" "}
        <i>
          <b>Concord Character Creator</b>
        </i>
      </p>
      <div className="flex justify-center">
        <div>If you ever see one of these</div>
        <WikiLink className="mx-2" />
        <div>
          give it a click! It will take you right to the relevant wiki page.
        </div>
      </div>
    </div>
  );
}

export default IntroPage;
