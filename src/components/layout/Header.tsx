import { BiAdjust } from "react-icons/bi";
import ConcordSigil from "../../data/images/concord-logo.png";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import { useState } from "react";
import { PATH_APPROVALS, PATH_GROUPS, PATH_HERO, PATH_HOME } from "../../utils/constants";
import { useRouter } from "next/router";
import Image from "next/image";
import useUserContext from "@/hooks/use-user-context";
import { Button } from "../common/Button/Button";
import Link from "next/link";
import { contentWide } from "./ContentWrapper";
import LoginModal from "../common/Modal/LoginModal";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { ApprovalButton } from "../common/Button/ApprovalButton";

export function Header({
	toggleTheme,
	handleLogoClick,
}: {
	toggleTheme: () => void;
	handleLogoClick?: () => void;
}) {
	const { user, isAdmin, loading } = useUserContext();
	const { pathname } = useRouter();

	const [showLoginModal, setShowLoginModal] = useState(false);

	function HeaderLink({ label, url, newtab }: { label: string; url: string; newtab?: boolean }) {
		const active = pathname === url;
		return (
			<Link
				href={url}
				className={`flex gap-2 items-center p-0.5 ${active ? "text-special" : ""}`}
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
					className={
						"flex items-center justify-between h-full py-2" +
						contentWide +
						" px-2 m-auto"
					}
				>
					{process.env.NEXT_PUBLIC_DEBUG_TEXT === "DevMode" && (
						<div className="absolute top-2 left-[50%] pointer-events-none select-none opacity-40 text-xs -z-10">
							<div className="translate-x-[-50%]">
								<p className="leading-0">DEV</p>
							</div>
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
														<NavigationMenuLink key={link.label}>
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
						{pathname === PATH_HERO ? <ApprovalButton /> : null}
						<Button
							onClick={() => {
								setShowLoginModal(true);
							}}
							spinner={loading}
							size={user ? "icon" : "default"}
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
							size="icon"
						>
							<BiAdjust />
						</Button>
					</div>
				</div>
			</div>
			<LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
		</>
	);
}
