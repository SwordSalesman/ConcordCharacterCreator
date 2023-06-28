import { useState } from "react";
import TabItem from "./common/Tabs/TabItem";
import Button from "./common/Button/Button";
import {
  ContentWrapper,
  CreatorWrapper,
  NavigationPaneWrapper,
  TabsWrapper,
} from "./Creator.style";

import { Transition } from "@headlessui/react";
import { BiAdjust } from "react-icons/bi";
import { useTheme } from "styled-components";

const transitionClasses = {
  enter: "transition ease-in-out duration-300",
  enterFrom: "opacity-0 -translate-2-3",
  enterTo: "opacity-100 translate-x-0",
  leave: "transition ease-in-out duration-150",
  leaveFrom: "opacity-100 translate-x-0",
  leaveTo: "opacity-0 translate-x-2",
};

function Creator({ tabs, toggleTheme }) {
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

  const renderedTabs = tabs.map((tab, index) => {
    return (
      <>
        <TabItem
          key={tab.name}
          tab={tab}
          onTabSelect={handleClickTab}
          active={tab === activeTab}
        />
        {index < tabs.length - 1 && (
          <div
            key={index}
            style={{
              userSelect: "none",
              opacity: "0.5",
              fontWeight: "bold",
              margin: "0 1px",
            }}
          >
            {">"}
          </div>
        )}
      </>
    );
  });

  const renderedContent = tabs.map((tab, index) => {
    return (
      <Transition
        key={tab.name}
        show={activeTab === tab}
        afterLeave={handleTabLeave}
        {...transitionClasses}
        style={{ width: "100%", height: "100%" }}
      >
        {tab.content}
      </Transition>
    );
  });

  const renderedButtons = (
    <>
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
    </>
  );

  return (
    <CreatorWrapper>
      <TabsWrapper>{renderedTabs}</TabsWrapper>
      <ContentWrapper>{renderedContent}</ContentWrapper>
      <NavigationPaneWrapper>{renderedButtons}</NavigationPaneWrapper>
    </CreatorWrapper>
  );
}

export default Creator;
