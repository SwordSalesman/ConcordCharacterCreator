import { useState } from "react";
import TabItem from "../components/TabItem";

import { Transition } from "@headlessui/react";

const transitionClasses = {
  enter: "transition ease-in-out duration-300",
  enterFrom: "opacity-0 -translate-x-2",
  enterTo: "opacity-100 translate-x-0",
  leave: "transition ease-in-out duration-150",
  leaveFrom: "opacity-100 translate-x-0",
  leaveTo: "opacity-0 translate-x-2",
};

function TabPage({ tabs }) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [pendingTab, setPendingTab] = useState(null);

  const handleClickTab = (tab) => {
    if (activeTab === tab) {
      return;
    }
    setActiveTab(null);
    setPendingTab(tab);
  };

  const handleTabLeave = () => {
    if (pendingTab === null) {
      setActiveTab(tabs[0]);
    } else {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
  };

  const renderedTabItems = tabs.map((tab) => {
    return (
      <TabItem
        key={tab.name}
        tab={tab}
        onTabSelect={handleClickTab}
        active={tab === activeTab}
      ></TabItem>
    );
  });

  const renderedTabContent = tabs.map((tab) => {
    return (
      <Transition
        key={tab.name}
        show={activeTab === tab}
        afterLeave={handleTabLeave}
        {...transitionClasses}
      >
        {tab.content}
      </Transition>
    );
  });

  return (
    <div className="m-6 max-w-xl flex flex-col justify-center items-center ">
      <div id="tab-items" className="flex mb-1">
        {renderedTabItems}
      </div>
      <div
        id="tab-content"
        className="min-w-full h-96 bg-white flex justify-center w-[700px] text-center"
      >
        {renderedTabContent}
      </div>
    </div>
  );
}

export default TabPage;
