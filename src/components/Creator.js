import { useState } from "react";
import TabItem from "./common/Tabs/TabItem";
import Button from "./common/Button/Button";
import {
    ContentWrapper,
    CreatorWrapper,
    NavigationButton,
    NavigationPaneWrapper,
    TabsWrapper,
} from "./Creator.style";

import { Transition } from "@headlessui/react";
import { BiAdjust } from "react-icons/bi";
import { useTheme } from "styled-components";
import {
    AiOutlineArrowLeft,
    AiOutlineArrowRight,
    AiOutlineLeft,
    AiOutlineRight,
} from "react-icons/ai";
import { TabDivider } from "./common/Tabs/TabItem.style";

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
    // const [pendingTab, setPendingTab] = useState(null);

    let activeIndex = tabs.indexOf(activeTab);
    // if (activeIndex === -1) {
    //     activeIndex = tabs.indexOf(pendingTab);
    // }
    const prevTab = activeIndex > 0 ? tabs[activeIndex - 1] : null;
    const nextTab =
        activeIndex >= 0 && activeIndex < tabs.length - 1
            ? tabs[activeIndex + 1]
            : null;

    const handleClickTab = (tab) => {
        if (activeTab === tab) {
            return;
        }
        setActiveTab(tab);
        // setPendingTab(tab);
    };

    // const handleTabLeave = () => {
    //     if (pendingTab === null) {
    //         setActiveTab(tabs[0]);
    //     } else {
    //         setActiveTab(pendingTab);
    //         setPendingTab(null);
    //     }
    // };

    const renderedTabs = tabs.map((tab, index) => {
        return (
            <>
                <TabItem
                    key={tab.name}
                    tab={tab}
                    onTabSelect={handleClickTab}
                    active={tab === activeTab}
                />
            </>
        );
    });

    const renderedContent = tabs.map((tab, index) => {
        return (
            // <Transition
            //     key={tab.name}
            //     show={activeTab === tab}
            //     afterLeave={handleTabLeave}
            //     {...transitionClasses}
            //     style={{ width: "100%", height: "100%" }}
            // >
            activeTab === tab &&
            // (
            // <div
            //     style={{
            //         width: "100%",
            //         height: "100%",
            //     }}
            // >
            tab.content
            // </div>
            // </Transition>
        );
    });

    const renderedButtons = (
        <>
            {prevTab ? (
                <NavigationButton
                    onClick={() => handleClickTab(prevTab)}
                    secondary
                >
                    <div>
                        <AiOutlineLeft />
                    </div>
                    <div style={{ width: "110px" }}>{prevTab.name}</div>
                </NavigationButton>
            ) : (
                <div></div>
            )}
            <NavigationButton
                onClick={
                    nextTab
                        ? () => handleClickTab(nextTab)
                        : () =>
                              alert(
                                  "The Concord team is not currently taking submissions."
                              )
                }
                primary
            >
                <div style={{ width: "110px" }}>
                    {nextTab ? nextTab.name : "Submit"}
                </div>
                <div>
                    <AiOutlineRight />
                </div>
            </NavigationButton>
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
