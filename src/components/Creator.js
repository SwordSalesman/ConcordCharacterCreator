import { useState } from "react";
import TabItem from "./common/TabItem";

import { Transition } from "@headlessui/react";

const transitionClasses = {
  enter: "transition ease-in-out duration-300",
  enterFrom: "opacity-0 -translate-2-3",
  enterTo: "opacity-100 translate-x-0",
  leave: "transition ease-in-out duration-150",
  leaveFrom: "opacity-100 translate-x-0",
  leaveTo: "opacity-0 translate-x-2",
};

function Creator({ tabs }) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [pendingTab, setPendingTab] = useState(null);

  const handleClickTab = (tab) => {
    if (activeTab === tab) {
      return;
    }
    let forwards = tabs.indexOf(activeTab) < tabs.indexOf(tab);
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

  const renderedTabs = tabs.map((tab) => {
    return (
      <TabItem
        key={tab.name}
        tab={tab}
        onTabSelect={handleClickTab}
        active={tab === activeTab}
      ></TabItem>
    );
  });

  const renderedContent = tabs.map((tab, index) => {
    return (
      <Transition
        key={tab.name}
        show={activeTab === tab}
        afterLeave={handleTabLeave}
        {...transitionClasses}
        className="w-full h-full"
      >
        {tab.content}
      </Transition>
    );
  });

  return (
    <div className="m-6 w-1/2 min-w-[600px]">
      <div
        id="form-tabs"
        className="flex justify-center mb-1 border-b-0 border-gray-200 w-full"
      >
        {renderedTabs}
      </div>
      <div
        id="form-content"
        className="h-[450px] flex justify-around text-center"
      >
        {renderedContent}
      </div>
    </div>
  );
}

export default Creator;
