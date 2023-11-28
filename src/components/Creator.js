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
import { useEffect, useState } from "react";
import ConfirmModal from "./common/Modal/ConfirmModal";
import useUserContext from "../hooks/use-user-context";
import { Banner } from "./common/Banner/Banner";
import { saveUserForm } from "../hooks/use-firebase";
import toast from "react-hot-toast";
import React from "react";
import IntroPage from "./pages/intro/IntroPage";
import RealmPage from "./pages/realm/RealmPage";
import SkillsPage from "./pages/skills/SkillsPage";
import OptionsPage from "./pages/options/OptionsPage";
import BackgroundPage from "./pages/background/BackgroundPage";
import ReviewPage from "./pages/review/ReviewPage";

const useTabs = false;
const tabs = [
    { name: "Intro", content: <IntroPage /> },
    { name: "Realm", content: <RealmPage /> },
    { name: "Skills", content: <SkillsPage /> },
    { name: "Options", content: <OptionsPage /> },
    { name: "Background", content: <BackgroundPage /> },
    { name: "Review", content: <ReviewPage /> },
];

function Creator({ handleShowLogin, handleCloseLogin }) {
    const { user, name } = useUserContext();
    const {
        getSimpleForm,
        resetForm,
        realm,
        validateForm,
        date,
        setDate,
        approval,
    } = useFormContext();
    const realmImage = useRealmImage(realm);
    const [showBanner, setShowBanner] = useState(false);
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [direction, setDirection] = useState("right");

    const [showConfirmReset, setShowConfirmReset] = useState(false);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

    const { valid } = validateForm();

    let activeIndex = tabs.indexOf(activeTab);
    const prevTab = activeIndex > 0 ? tabs[activeIndex - 1] : null;
    const nextTab =
        activeIndex >= 0 && activeIndex < tabs.length - 1
            ? tabs[activeIndex + 1]
            : null;

    useEffect(() => {
        handleCloseLogin();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        if (user && date) {
            setShowBanner(true);
        } else {
            setShowBanner(false);
            setTimeout(() => {
                setShowBanner(true);
            }, 45000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, date]);

    const handleSave = async () => {
        toast.promise(saveUserForm(getSimpleForm(), setDate, name), {
            loading: "Submitting",
            success: "Character submitted!",
            error: "Submission failed, check network connection",
        });
    };

    const handleSubmit = async () => {
        if (!user) {
            handleShowLogin();
        } else {
            setShowConfirmSubmit(true);
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
                <div style={{ width: nextTab ? "100px" : "116px" }}>
                    {nextTab ? nextTab.name : "Save & Submit"}
                </div>
                {nextTab ? (
                    <div>
                        <AiOutlineRight />
                    </div>
                ) : null}
            </Button>
        </>
    );

    return (
        <>
            <Banner
                show={showBanner}
                dateSubmitted={date}
                approval={approval}
            />

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

            <ConfirmModal
                title='Save & Submit Character?'
                message='You can submit multiple times.'
                show={showConfirmSubmit}
                handleClose={(response) => {
                    setShowConfirmSubmit(false);
                    if (!!response) handleSave();
                }}
            ></ConfirmModal>
        </>
    );
}

export default Creator;
