import Creator from "./components/Creator";
import IntroPage from "./components/intro/IntroPage";
import RealmPage from "./components/realm/RealmPage";
import SkillsPage from "./components/skills/SkillsPage";
import OptionsPage from "./components/options/OptionsPage";
import BackgroundPage from "./components/background/BackgroundPage";
import ReviewPage from "./components/review/ReviewPage";

const tabs = [
  { name: "Intro", content: <IntroPage /> },
  { name: "Realm", content: <RealmPage /> },
  { name: "Skills", content: <SkillsPage /> },
  { name: "Options", content: <OptionsPage /> },
  { name: "Background", content: <BackgroundPage /> },
  { name: "Review", content: <ReviewPage /> },
];

function App() {
  return (
    <div
      className={
        "h-[100vh] flex justify-center bg-gradient-to-b from-white to-gray-400 font-serif"
      }
    >
      <Creator tabs={tabs} />
    </div>
  );
}

export default App;
