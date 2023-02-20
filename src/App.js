import TabPage from "./pages/TabPage";
import IntroPage from "./pages/IntroPage";
import RealmPage from "./pages/RealmPage";
import SkillsPage from "./pages/SkillsPage";
import OptionsPage from "./pages/OptionsPage";
import BackgroundPage from "./pages/BackgroundPage";
import ReviewPage from "./pages/ReviewPage";

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
    <div className={"h-[100vh] justify bg-white"}>
      <div className="flex justify-center font-serif">
        <TabPage tabs={tabs} />
      </div>
    </div>
  );
}

export default App;
