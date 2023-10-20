import React, { useState } from "react";
import TabItem from "./common/Tabs/TabItem";
import {
    ContentWrapper,
    CreatorWrapper,
    NavigationPaneWrapper,
    RealmBackgroundImage,
    TabsWrapper,
} from "./Creator.style";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import useFormContext from "../hooks/use-form-context";
import { ColumnPage } from "./pages/ColumnPageWrapper";
import useRealmImage from "../hooks/use-realm-image";
import Button from "./common/Button/Button";

const useTabs = false;

function Creator({ tabs, handleSubmit }) {
    const { realm } = useFormContext();
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const realmImage = useRealmImage(realm);

    let activeIndex = tabs.indexOf(activeTab);
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
    };

    const renderedTabs = tabs.map((tab, index) => {
        return (
            <TabItem
                key={tab.name}
                tab={tab}
                onTabSelect={handleClickTab}
                active={tab === activeTab}
            />
        );
    });

    const renderedContent = tabs.map((tab, index) => {
        return (
            activeTab === tab && (
                <React.Fragment key={index}>{tab.content}</React.Fragment>
            )
        );
    });

    const renderedButtons = (
        <>
            {prevTab ? (
                <Button secondary onClick={() => handleClickTab(prevTab)}>
                    <div>
                        <AiOutlineLeft />
                    </div>
                    <div style={{ width: "100px" }}>{prevTab.name}</div>
                </Button>
            ) : (
                <div></div>
            )}
            <Button
                primary
                onClick={nextTab ? () => handleClickTab(nextTab) : handleSubmit}
            >
                <div style={{ width: "100px" }}>
                    {nextTab ? nextTab.name : "Submit"}
                </div>
                <div>
                    <AiOutlineRight />
                </div>
            </Button>
        </>
    );

    return (
        <CreatorWrapper outline={!useTabs}>
            <TabsWrapper>{renderedTabs}</TabsWrapper>
            {/* // <PageHeader>{activeTab.name}</PageHeader> */}
            <ContentWrapper>
                <ColumnPage>{renderedContent}</ColumnPage>
            </ContentWrapper>
            <NavigationPaneWrapper>{renderedButtons}</NavigationPaneWrapper>
            {realmImage ? <RealmBackgroundImage src={realmImage} /> : null}
        </CreatorWrapper>
    );
}

export default Creator;
