import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { JSX, useState } from "react";
import { Button } from "../common/Button/Button.tsx";
import useUserContext from "@/hooks/use-user-context";
import LoginModal from "../common/Modal/LoginModal.tsx";
import { Modal } from "../common/Modal/Modal.tsx";
import { cn } from "@/lib/utils.ts";
import { fadeStripStyle } from "@/styles/Global.ts";
import Image from "next/image";
import { getRealmData } from "@/utils/data-helper.tsx";
import useFormContext from "@/hooks/use-form-context.ts";
import { Banner } from "../common/Banner/Banner.tsx";

export interface Tab {
	name: string;
	content: JSX.Element;
}

/*
 * Generic Creator component that can be used for both Character and Group creation.
 */
export function Creator({
	tabs,
	valid,
	onSubmit,
	onReset,
}: {
	tabs: Tab[];
	valid: boolean;
	onSubmit: () => void;
	onReset: () => void;
}) {
	const { user } = useUserContext();
	const { form } = useFormContext();
	const { realm } = form;
	const realmImage = realm ? getRealmData(realm)?.image : undefined;
	const [activeTab, setActiveTab] = useState(tabs[0]);
	const [direction, setDirection] = useState("right");

	const [showLoginModal, setShowLoginModal] = useState(false);
	const [showResetModal, setShowResetModal] = useState(false);
	const [showSubmitModal, setShowSubmitModal] = useState(false);

	let activeIndex = tabs.indexOf(activeTab);
	const prevTab = activeIndex > 0 && activeIndex < tabs.length ? tabs[activeIndex - 1] : null;
	const nextTab =
		activeIndex >= 0 && activeIndex < tabs.length - 1 ? tabs[activeIndex + 1] : null;

	const handleSubmit = async () => {
		if (!user) {
			setShowLoginModal(true);
		} else {
			setShowSubmitModal(true);
		}
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
				key={tab.name}
				onClick={() => {
					handleClickTab(tab, index);
				}}
				className={cn(
					"border-b-[3px] border-transparent mt-[2px] h-[30px] transition flex-1 opacity-50 text-base sm:cursor-pointer",
					`${fadeStripStyle} sm:bg-none`,
					active ? "border-primary text-strong opacity-100" : "text-text",
					active
						? "max-sm:block max-sm:border-0 max-sm:m-0 max-sm:text-[1.1rem] max-sm:h-[45px]"
						: "max-sm:hidden",
				)}
			>
				{tab.name}
			</button>
		);
	});

	const renderedContent = tabs.map((tab, index) => {
		return (
			activeTab === tab && (
				<div
					key={index}
					className={`h-full w-full relative flex justify-around flex-row max-sm:flex-col ${
						direction === "left"
							? "animate-page-slide-in-left"
							: "animate-page-slide-in-right"
					}`}
				>
					{tab.content}
				</div>
			)
		);
	});

	return (
		<>
			{/* <Banner /> */}

			<div
				className={cn(
					"relative overflow-hidden min-w-[300px] w-full flex flex-col items-center m-auto mb-[65px] mt-1",
					"border-2 border-solid border-secondary rounded-t-xl",
					"max-sm:rounded-t-none max-sm:h-full max-sm:w-full max-sm:border-0 max-sm:mt-[10px]",
				)}
			>
				{/* Tabs */}
				<div
					className={cn(
						"flex justify-center mb-2 w-full items-center h-10 sm:h-8",
						`max-sm:${fadeStripStyle} sm:bg-secondary`,
					)}
				>
					{renderedTabs}
				</div>
				{/* Content */}
				<div className="relative flex justify-center text-center items-start min-h-[300px] mb-[40px] px-3 sm:min-h-[500px] w-full">
					{renderedContent}
				</div>
				{/* Navigation Buttons */}
				<div
					className={
						"w-full flex justify-between h-16 px-2 pt-2 z-10 max-sm:fixed max-sm:bottom-0 sm:h-13 max-sm:border-t max-sm:bg-card"
					}
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
							select-none blur-[2px] opacity-10 dark:opacity-35 animate-realm-logo-in`}
						alt="Realm Background"
					/>
				) : null}
			</div>

			<LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
			<Modal
				title="Save & Submit?"
				subtitle="You can submit multiple times."
				open={showSubmitModal}
				onClose={() => setShowSubmitModal(false)}
				actions={[
					{ label: "Cancel", onClick: () => setShowSubmitModal(false) },
					{
						label: "Submit",
						onClick: () => {
							onSubmit();
							setShowSubmitModal(false);
						},
						variant: "primary",
					},
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
					{
						label: "Reset",
						onClick: () => {
							onReset();
							setShowResetModal(false);
						},
						variant: "primary",
					},
				]}
				size="small"
			/>
		</>
	);
}
