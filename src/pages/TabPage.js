import { useState } from "react";
import TabItem from "../components/TabItem";
import IntroPage from "./IntroPage";
import RealmPage from "./RealmPage";
import SkillsPage from "./SkillsPage";
import OptionsPage from "./OptionsPage";
import BackgroundPage from "./BackgroundPage";

function TabPage() {
  const [activeTab, setActiveTab] = useState("Intro");

  const tabs = ["Intro", "Realm", "Skills", "Options", "Background"];

  const handleClickTab = (tab) => {
    setActiveTab(tab);
  };

  const renderedTabItems = tabs.map((tab) => {
    return (
      <TabItem
        key={tab}
        name={tab}
        onTabSelect={handleClickTab}
        active={tab === activeTab}
      ></TabItem>
    );
  });

  const renderedTabContent = {
    Intro: <IntroPage />,
    Realm: <RealmPage />,
    Skills: <SkillsPage />,
    Options: <OptionsPage />,
    Background: <BackgroundPage />,
  }[activeTab];

  return (
    <div className="m-6 max-w-2xl flex flex-col justify-center items-center">
      <div id="tab-bar" className="flex mb-1">
        {renderedTabItems}
      </div>
      <div id="tab-content" className="min-w-full h-96 flex p-1 justify-center">
        {renderedTabContent}
      </div>
    </div>
  );
}

export default TabPage;
