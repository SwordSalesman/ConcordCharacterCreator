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
import { useState } from "react";
import ConfirmModal from "./common/Modal/ConfirmModal";

const useTabs = false;

function Creator({ tabs, activeTab, setActiveTab, handleSubmit }) {
    const { realm, validateForm, resetForm } = useFormContext();
    const realmImage = useRealmImage(realm);
    const [direction, setDirection] = useState("right");
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
    const [showConfirmReset, setShowConfirmReset] = useState(false);

    const { valid } = validateForm();

    let activeIndex = tabs.indexOf(activeTab);
    const prevTab = activeIndex > 0 ? tabs[activeIndex - 1] : null;
    const nextTab =
        activeIndex >= 0 && activeIndex < tabs.length - 1
            ? tabs[activeIndex + 1]
            : null;

    const handleSubmitClose = (response) => {
        setShowConfirmSubmit(false);
        if (!!response) {
            handleSubmit();
        }
    };

    const handleResetClose = (response) => {
        setShowConfirmReset(false);
        if (!!response) {
            resetForm();
        }
    };

    const handleClickTab = (tab, index) => {
        if (activeTab === tab) {
            return;
        }
        let activeIndex = tabs.indexOf(activeTab);
        if (index > activeIndex) {
            setDirection("right");
        } else {
            setDirection("left");
        }
        setActiveTab(tab);
    };

    const renderedTabs = tabs.map((tab, index) => {
        return (
            <TabItem
                key={tab.name}
                tab={tab}
                index={index}
                onTabSelect={handleClickTab}
                active={tab === activeTab}
            />
        );
    });

    const renderedContent = tabs.map((tab, index) => {
        return (
            activeTab === tab && (
                <ColumnPage direction={direction} key={index}>
                    {tab.content}
                </ColumnPage>
            )
        );
    });

    const renderedButtons = (
        <>
            <Button
                secondary
                onClick={
                    prevTab
                        ? () => {
                              handleClickTab(prevTab);
                              setDirection("left");
                          }
                        : () => setShowConfirmReset(true)
                }
            >
                <div>{prevTab ? <AiOutlineLeft /> : null}</div>
                <div style={{ width: "100px" }}>
                    {prevTab ? prevTab.name : "Reset Form"}
                </div>
            </Button>
            <Button
                primary
                onClick={
                    nextTab
                        ? () => {
                              handleClickTab(nextTab);
                              setDirection("right");
                          }
                        : handleSubmit
                }
                disabled={!nextTab && !valid}
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
        <>
            <CreatorWrapper outline={!useTabs}>
                <TabsWrapper>{renderedTabs}</TabsWrapper>
                {/* // <PageHeader>{activeTab.name}</PageHeader> */}
                <ContentWrapper>{renderedContent}</ContentWrapper>
                <NavigationPaneWrapper>{renderedButtons}</NavigationPaneWrapper>
                {realmImage ? <RealmBackgroundImage src={realmImage} /> : null}
            </CreatorWrapper>

            <ConfirmModal
                title='Reset Character?'
                message="Your changes won't be saved until you submit."
                show={showConfirmReset}
                handleClose={handleResetClose}
            ></ConfirmModal>
        </>
    );
}

export default Creator;
