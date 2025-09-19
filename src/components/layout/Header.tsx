import { BiAdjust, BiSolidBadgeCheck } from "react-icons/bi";
import ConcordSigil from "../../data/images/concord-logo.png";
import { useTheme } from "styled-components";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import React, { useState } from "react";
import { APPROVED, DENIED, PATH_APPROVALS, PATH_GROUPS, PATH_HOME } from "../../utils/constants";
import { useRouter } from "next/router";
import Image from "next/image";
import { FormContextProvider } from "@/context/formContext";
import useUserContext from "@/hooks/use-user-context";
import useFormContext from "@/hooks/use-form-context";
import { Button } from "../common/Button/Button";
import { cn } from "@/lib/utils";

export function Header({ toggleTheme, handleShowLogin, handleLogoClick }: any) {
	return (
		<FormContextProvider>
			<HeaderInternal
				toggleTheme={toggleTheme}
				handleShowLogin={handleShowLogin}
				handleLogoClick={handleLogoClick}
			/>
		</FormContextProvider>
	);
}

function HeaderInternal({ toggleTheme, handleShowLogin, handleLogoClick }: any) {
	const theme = useTheme();
	const userContext = useUserContext();
	const user = userContext?.user;
	const isAdmin = userContext?.isAdmin;
	const { approval, date } = useFormContext();

	const { pathname, push } = useRouter();

	const [showApprovalModal, setShowApprovalModal] = useState(false);

	const isDev = process.env.REACT_APP_DEBUG_TEXT === "DevMode";

	let tickColor = theme.textSoft;
	let submissionStatus = "Not Submitted";
	if (!!date && (!approval?.status || approval.date < date)) {
		tickColor = theme.warning;
		submissionStatus = "Awaiting Review";
	} else if (approval?.status === DENIED) {
		tickColor = theme.error;
		submissionStatus = "Changes Requested";
	} else if (approval?.status === APPROVED) {
		tickColor = theme.warning;
		submissionStatus = "Approved";
	}

	if (!date) {
		tickColor = theme.textSoft;
	} else {
		if (approval?.status === APPROVED) {
			tickColor = theme.success;
		} else if (approval?.status === DENIED) {
			tickColor = theme.error;
		}
	}

	function handleApprovalSelect() {
		setShowApprovalModal(true);
	}

	function handleCloseApprovalModal() {
		setShowApprovalModal(false);
	}

	function FlexRow({ className, children }: { className?: string; children: React.ReactNode }) {
		return (
			<div className={cn("flex items-center flex-row flex-1 gap-1", className)}>
				{children}
			</div>
		);
	}

	return (
		<>
			<div className="h-12 w-full px-2 flex items-center justify-between bg-background border-b border-borderSoft fixed top-0 z-100">
				<FlexRow>
					{isAdmin && (
						<Button
							variant={pathname === PATH_APPROVALS ? "primary" : "outline"}
							onClick={() => push(PATH_APPROVALS)}
						>
							<div className="flex gap-2 items-center">
								<p>Approvals</p>
							</div>
						</Button>
					)}
					<Button
						onClick={() => push(PATH_HOME)}
						variant={pathname === PATH_HOME ? "primary" : "outline"}
					>
						<div className="flex gap-2 items-center">
							<p>Character</p>
						</div>
					</Button>
					<Button
						onClick={() => push(PATH_GROUPS)}
						variant={pathname === PATH_GROUPS ? "primary" : "outline"}
					>
						<div className="flex gap-2 items-center">
							<p>Band</p>
						</div>
					</Button>
					{isDev ? (
						<div className="absolute top-0 left-0 pointer-events-none select-none opacity-40">
							<p>development</p>
						</div>
					) : null}
				</FlexRow>

				{/* <div className="flex items-center justify-center"> */}
				{/* <Button onClick={handleLogoClick} className="p-0.5"> */}
				<Image
					src={ConcordSigil}
					alt="Concord Logo"
					className={`h-8 w-8 ${theme.name === "light" ? "" : "invert"}`}
					width={24}
					height={24}
				/>
				{/* </Button> */}
				{/* </div> */}

				<FlexRow className="justify-end">
					{user && pathname === PATH_HOME ? (
						<Button onClick={handleApprovalSelect}>
							<div className="flex gap-2 items-center" color={tickColor}>
								<p>{submissionStatus}</p>
								<BiSolidBadgeCheck />
							</div>
						</Button>
					) : null}
					<Button onClick={handleShowLogin}>
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
						<div className="flex gap-2 items-center">
							<BiAdjust />
						</div>
					</Button>
				</FlexRow>
			</div>
			{/* <ApprovalModal
				show={showApprovalModal}
				handleClose={handleCloseApprovalModal}
				submissionDate={date}
				approval={approval}
				highlightColor={tickColor}
				options={null}
			/> */}
		</>
	);
}
