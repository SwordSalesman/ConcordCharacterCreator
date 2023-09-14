import { useState } from "react";
import TabItem from "./common/Tabs/TabItem";
import {
    ContentWrapper,
    CreatorWrapper,
    NavigationButton,
    NavigationPaneWrapper,
    TabsWrapper,
} from "./Creator.style";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import useFormContext from "../hooks/use-form-context";
import { ColumnPage } from "./pages/ColumnPageWrapper";
import useRealmImage from "../hooks/use-realm-image";
import PageHeader from "./common/PageHeader/PageHeader";

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
        return activeTab === tab && tab.content;
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
                onClick={nextTab ? () => handleClickTab(nextTab) : handleSubmit}
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
        <CreatorWrapper outline={!useTabs}>
            <TabsWrapper>{renderedTabs}</TabsWrapper>
            {/* // <PageHeader>{activeTab.name}</PageHeader> */}
            <ContentWrapper>
                <ColumnPage background={realmImage}>
                    {renderedContent}
                </ColumnPage>
            </ContentWrapper>
            <NavigationPaneWrapper>{renderedButtons}</NavigationPaneWrapper>
        </CreatorWrapper>
    );
}

export default Creator;
