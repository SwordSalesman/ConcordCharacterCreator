import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import useFormContext from "../../hooks/use-form-context.js";
import { ColumnPage } from "./ColumnPageWrapper.js";
import { JSX, useEffect, useState } from "react";
// import ConfirmModal from "../../componentsOLD/common/Modal/ConfirmModal";
import { Banner } from "../common/Banner/Banner.js";
import { saveUserForm } from "../../hooks/use-firebase";
import toast from "react-hot-toast";
import React from "react";
// import IntroPage from "./tabs/IntroPage.js";
import { RiExternalLinkLine } from "react-icons/ri";
import { PATH_GROUPS } from "../../utils/constants.ts";
import { Button } from "../common/Button/Button";
import useUserContext from "@/hooks/use-user-context";
import { realms } from "../../data/tables/realms";
import LoginModal from "../common/Modal/LoginModal.tsx";
import { Modal } from "../common/Modal/Modal.tsx";
import { cn } from "@/lib/utils.ts";
import { IntroPage } from "./tabs/IntroPage.tsx";
import { fadeStripStyle } from "@/styles/Global.ts";
import RealmPage from "./tabs/RealmPage.tsx";
import Image from "next/image";
import SkillsPage from "./tabs/SkillsPage.tsx";

export interface Tab {
	name: string;
	content: JSX.Element;
}
const tabs: Tab[] = [
	{ name: "Intro", content: <IntroPage /> },
	{ name: "Realm", content: <RealmPage /> },
	{ name: "Skills", content: <SkillsPage /> },
	{ name: "tab1", content: <div>Content 1</div> },
	{ name: "tab2", content: <div>Content 2</div> },
	{ name: "tab3", content: <div>Content 3</div> },
	// { name: "Options", content: <OptionsPage /> },
	// { name: "Background", content: <BackgroundPage /> },
	// { name: "Review", content: <ReviewPage /> },
];

export function Creator() {
	const { user, name } = useUserContext();
	const { getSimpleForm, resetForm, realm, validateForm, date, setDate } = useFormContext();
	const realmImage = realms.find((r) => r.name === realm)?.image;
	const [activeTab, setActiveTab] = useState(tabs[0]);
	const [direction, setDirection] = useState("right");

	const [showLoginModal, setShowLoginModal] = useState(false);
	const [showResetModal, setShowResetModal] = useState(false);
	const [showSubmitModal, setShowSubmitModal] = useState(false);

	const { valid } = validateForm();

	let activeIndex = tabs.indexOf(activeTab);
	const prevTab = activeIndex > 0 && activeIndex < tabs.length ? tabs[activeIndex - 1] : null;
	const nextTab =
		activeIndex >= 0 && activeIndex < tabs.length - 1 ? tabs[activeIndex + 1] : null;

	const handleSave = async () => {
		toast.promise(saveUserForm(getSimpleForm(), setDate, name), {
			loading: "Submitting",
			success: "Character submitted!",
			error: (err) => `Submission failed, check network connection. Error code: ${err}`,
		});
	};

	const handleSubmit = async () => {
		if (!user) {
			setShowLoginModal(true);
		} else {
			setShowSubmitModal(true);
		}
	};

	const handleReset = () => {
		resetForm();
		setShowResetModal(false);
	};

	const handleClickTab = (tab: Tab, index?: number) => {
		if (activeTab === tab) {
			return;
		}
		let activeIndex = tabs.indexOf(activeTab);
		if (index && index > activeIndex) {
			setDirection("right");
		} else {
			setDirection("left");
		}
		setActiveTab(tab);
	};

	const renderedTabs = tabs.map((tab, index) => {
		const active = tab === activeTab;
		return (
			<button
				type="button"
				onClick={() => {
					handleClickTab(tab, index);
				}}
				className={cn(
					"border-b-[3px] border-transparent mt-[2px] h-[30px] transition flex-1 opacity-50 text-base",
					`${fadeStripStyle} sm:bg-none`,
					active ? "border-primary text-strong opacity-100" : "text-text",
					active
						? "max-sm:block max-sm:border-0 max-sm:m-0 max-sm:text-[1.1rem] max-sm:h-[45px]"
						: "max-sm:hidden"
				)}
			>
				{tab.name}
			</button>
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

	return (
		<>
			{/* <Banner /> */}

			<div
				className={cn(
					"relative overflow-hidden min-w-[300px] w-full flex flex-col items-center mb-[65px] m-auto",
					"border-2 border-solid border-secondary rounded-t-xl",
					"max-sm:rounded-t-none max-sm:h-full max-sm:w-full max-sm:border-0 max-sm:mt-[10px]"
				)}
			>
				<div
					className={cn(
						"flex justify-center mb-3 w-full items-center",
						"h-10 sm:h-8",
						`max-sm:${fadeStripStyle} sm:bg-secondary`
					)}
				>
					{renderedTabs}
				</div>
				<div className="relative flex justify-center text-center items-start min-h-[300px] px-3 mb-[40px] sm:min-h-[500px]">
					{renderedContent}
				</div>
				<div
					className={cn(
						"w-full flex justify-between h-16 px-2 pt-2 z-10 max-sm:fixed max-sm:bottom-0",
						"sm:h-13",
						"max-sm:border-t max-sm:bg-card"
					)}
				>
					<Button
						onClick={
							prevTab
								? () => {
										handleClickTab(prevTab);
										setDirection("left");
								  }
								: () => setShowResetModal(true)
						}
						className="w-30"
					>
						{prevTab ? <AiOutlineLeft /> : null}
						{prevTab ? prevTab.name : "Reset Form"}
					</Button>
					<Button
						variant={"primary"}
						onClick={
							nextTab
								? () => {
										handleClickTab(nextTab);
										setDirection("right");
								  }
								: handleSubmit
						}
						disabled={!nextTab && !valid}
						className="w-30"
					>
						<div>{nextTab ? nextTab.name : "Save & Submit"}</div>
						{nextTab ? (
							<div>
								<AiOutlineRight />
							</div>
						) : null}
					</Button>
				</div>
				{realmImage ? (
					<Image
						src={realmImage}
						className={`sm:absolute fixed w-[500px] z-[-1] pointer-events-none bottom-[-80px] left-[-80px]
							select-none blur-[2px] opacity-20 dark:opacity-40 animate-realm-logo-in`}
						alt="Realm Background"
					/>
				) : null}
			</div>

			<LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
			<Modal
				title="Save & Submit Character?"
				subtitle="You can submit multiple times."
				open={showSubmitModal}
				onClose={() => setShowSubmitModal(false)}
				actions={[
					{ label: "Cancel", onClick: () => setShowSubmitModal(false) },
					{ label: "Submit", onClick: handleSave, variant: "primary" },
				]}
				size="small"
			/>
			<Modal
				title="Reset Form?"
				subtitle="Your changes won't be saved until you submit."
				open={showResetModal}
				onClose={() => setShowResetModal(false)}
				actions={[
					{ label: "Cancel", onClick: () => setShowResetModal(false) },
					{ label: "Submit", onClick: handleReset, variant: "primary" },
				]}
				size="small"
			/>
		</>
	);
}
