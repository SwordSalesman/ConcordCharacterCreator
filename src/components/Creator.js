import { useState } from "react";
import TabItem from "./common/TabItem";
import Button from "./common/Button";

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

  let activeIndex = tabs.indexOf(activeTab);
  if (activeIndex === -1) {
    activeIndex = tabs.indexOf(pendingTab);
  }
  const prevTab = activeIndex > 0 ? tabs[activeIndex - 1] : null;
  const nextTab =
    activeIndex >= 0 && activeIndex < tabs.length - 1
      ? tabs[activeIndex + 1]
      : null;

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

  const renderedButtons = (
    <div className="flex justify-between mt-2">
      {prevTab ? (
        <Button onClick={() => handleClickTab(prevTab)}>
          {"< " + prevTab.name}
        </Button>
      ) : (
        <div></div>
      )}
      <Button
        onClick={
          nextTab
            ? () => handleClickTab(nextTab)
            : () =>
                alert("The Concord team is not currently taking submissions.")
        }
        active
      >
        {nextTab ? nextTab.name + " >" : "Submit"}
      </Button>
    </div>
  );

  return (
    <div className="m-6 w-1/2 min-w-[600px] h-[500px] drop-shadow-xl p-2 bg-slate-100 rounded-2xl">
      <div
        id="form-tabs"
        className="flex justify-center mb-1 border-b-0 border-gray-200 w-full"
      >
        {renderedTabs}
      </div>
      <div
        id="form-content"
        className="h-[400px] flex justify-center items-center text-center"
      >
        {renderedContent}
      </div>
      {renderedButtons}
    </div>
  );
}

export default Creator;
