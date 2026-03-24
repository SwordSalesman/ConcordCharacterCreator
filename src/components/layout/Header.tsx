import { BiAdjust, BiSolidBadgeCheck } from "react-icons/bi";
import ConcordSigil from "../../data/images/concord-logo.png";
import { useTheme } from "styled-components";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import React, { useState } from "react";
import {
	APPROVED,
	DENIED,
	PATH_APPROVALS,
	PATH_GROUPS,
	PATH_HERO,
	PATH_HOME,
} from "../../utils/constants";
import { useRouter } from "next/router";
import Image from "next/image";
import useUserContext from "@/hooks/use-user-context";
import useFormContext from "@/hooks/use-form-context";
import { Button } from "../common/Button/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { contentNarrow, contentWide } from "./ContentWrapper";
import { getApprovalStatus } from "@/utils/approval-helper";
import LoginModal from "../common/Modal/LoginModal";
import { ApprovalModal } from "../common/Modal/ApprovalModal";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "../ui/navigation-menu";

export function Header({
	toggleTheme,
	handleLogoClick,
}: {
	toggleTheme: () => void;
	handleLogoClick?: () => void;
}) {
	const { user, name, isAdmin, loading } = useUserContext();
	const { approval, form, loading: formLoading } = useFormContext();
	const { date } = form;
	const { pathname, push } = useRouter();
	const [showApprovalModal, setShowApprovalModal] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);

	const { submissionStatus, tickColor } = getApprovalStatus({
		status: approval?.status,
		submissionDate: date,
		approvalDate: approval?.date,
	});

	function handleApprovalSelect() {
		setShowApprovalModal(true);
	}

	function handleCloseApprovalModal() {
		setShowApprovalModal(false);
	}

	function HeaderLink({ label, url, newtab }: { label: string; url: string; newtab?: boolean }) {
		const active = pathname === url;
		return (
			<Link
				href={url}
				className={`flex gap-2 items-center p-0.5 ${active ? "underline" : ""} ${
					newtab ? "cursor:link" : ""
				}`}
				target={newtab ? "_blank" : "_self"}
				rel={newtab ? "noopener noreferrer" : undefined}
			>
				<p>{label}</p>
			</Link>
		);
	}

	const headerLinksData = [
		{ label: "Hero", url: PATH_HERO },
		{ label: "Groups", url: PATH_GROUPS },
		...(isAdmin ? [{ label: "Approvals", url: PATH_APPROVALS }] : []),
		{ label: "Wiki", url: "https://wiki.concordlarp.com/index.php/Main_Page", newtab: true },
	];

	return (
		<>
			<div className={"h-12 w-full z-100"}>
				<div
					className={"flex items-center justify-between h-full m-auto px-3" + contentWide}
				>
					{process.env.NEXT_PUBLIC_DEBUG_TEXT === "DevMode" && (
						<div className="absolute top-2 left-0.5 pointer-events-none select-none opacity-40 text-sm">
							<p className="leading-0">DEV</p>
						</div>
					)}
					<div className="flex items-center flex-row flex-1 gap-1">
						<Link href={PATH_HOME}>
							<Image
								src={ConcordSigil}
								alt="Concord Logo"
								className="h-8 w-8 min-w-8 dark:invert p-1 md:hover:rotate-180 transition-transform duration-500 ease-in-out"
								width={20}
								height={20}
							/>
						</Link>
						<div className="items-center gap-1 hidden sm:flex">
							{headerLinksData.map((link) => {
								return (
									<HeaderLink
										key={link.label}
										label={link.label}
										url={link.url}
										newtab={link.newtab}
									/>
								);
							})}
						</div>
						<NavigationMenu viewport={true} className="flex sm:hidden">
							<NavigationMenuList>
								<NavigationMenuItem>
									<NavigationMenuTrigger>
										{headerLinksData.find((link) => link.url === pathname)
											?.label || "Menu"}
									</NavigationMenuTrigger>
									<NavigationMenuContent>
										<ul className="grid w-[200px] gap-4">
											<li>
												{headerLinksData.map((link) => {
													return (
														<NavigationMenuLink
															key={link.label}
															asChild
														>
															<Link
																href={link.url}
																target={
																	link.newtab ? "_blank" : "_self"
																}
																rel={
																	link.newtab
																		? "noopener noreferrer"
																		: undefined
																}
															>
																{link.label}
															</Link>
														</NavigationMenuLink>
													);
												})}
											</li>
										</ul>
									</NavigationMenuContent>
								</NavigationMenuItem>
							</NavigationMenuList>
						</NavigationMenu>
					</div>

					<div className="flex items-center flex-row flex-1 gap-1 justify-end">
						{user && pathname === PATH_HERO ? (
							<Button
								onClick={handleApprovalSelect}
								spinner={formLoading}
								className="animate-in fade-in"
							>
								<div className="flex gap-2 items-center" color={tickColor}>
									<p>{submissionStatus}</p>
									<BiSolidBadgeCheck />
								</div>
							</Button>
						) : null}
						<Button
							onClick={() => {
								setShowLoginModal(true);
							}}
							spinner={loading}
						>
							<div className="flex gap-2 items-center">
								{user ? (
									<FaUserCheck />
								) : (
									<>
										<p>Sign in</p>
										<FaUserPlus />
									</>
								)}
							</div>
						</Button>
						<Button
							onClick={() => {
								toggleTheme();
							}}
						>
							<BiAdjust />
						</Button>
					</div>
				</div>
			</div>
			<LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
			<ApprovalModal open={showApprovalModal} onClose={() => setShowApprovalModal(false)} />
		</>
	);
}
