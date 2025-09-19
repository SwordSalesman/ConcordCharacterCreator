import { BiAdjust, BiSolidBadgeCheck } from "react-icons/bi";
import Button from "../Button/Button";
import ConcordSigil from "../../../data/images/concord-logo.png";
import ConcordSigilInv from "../../../data/images/concord-logo-inv.png";
import { useTheme } from "styled-components";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import useUserContext from "../../../hooks/use-user-context";
import React, { useState } from "react";
import { APPROVED, DENIED, PATH_APPROVALS, PATH_GROUPS, PATH_HOME } from "../../../utils/constants";
import useFormContext from "../../../hooks/use-form-context";
import ApprovalModal from "../Modal/ApprovalModal";
import { useRouter } from "next/router";
import Image from "next/image";
import { FormContextProvider } from "@/context/formContext";

export function Header({ toggleTheme, handleShowLogin, handleLogoClick }) {
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

function HeaderInternal({ toggleTheme, handleShowLogin, handleLogoClick }) {
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

	return (
		<>
			<div className="h-12 w-full px-2 flex items-center justify-between bg-background border-b border-borderSoft fixed top-0 z-100">
				<div className="flex items-center flex-row flex-1">
					{isAdmin && (
						<Button
							primary={pathname === PATH_APPROVALS}
							onClick={() => push(PATH_APPROVALS)}
						>
							<div className="flex gap-2 items-center" to={PATH_APPROVALS}>
								<p>Approvals</p>
							</div>
						</Button>
					)}
					<Button onClick={() => push(PATH_HOME)} primary={pathname === PATH_HOME}>
						<div className="flex gap-2 items-center" to={PATH_HOME}>
							<p>Character</p>
						</div>
					</Button>
					<Button onClick={() => push(PATH_GROUPS)} primary={pathname === PATH_GROUPS}>
						<div className="flex gap-2 items-center" to={PATH_GROUPS}>
							<p>Band</p>
						</div>
					</Button>
					{isDev ? (
						<div className="absolute top-0 left-0 pointer-events-none select-none opacity-40">
							<p>development</p>
						</div>
					) : null}
				</div>

				<div
					className="h-10 w-10 flex items-center justify-center"
					// href={"https://wiki.concordlarp.com/index.php"}
					// target="_blank"
					// rel="noreferrer"
				>
					<Button onClick={handleLogoClick}>
						<Image
							src={theme.name === "light" ? ConcordSigil : ConcordSigilInv}
							alt="Concord Logo"
							className="h-8 w-8"
							width={24}
							height={24}
						/>
					</Button>
				</div>

				<div className="flex items-center justify-end flex-row flex-1">
					{user && pathname === PATH_HOME ? (
						<Button small onClick={handleApprovalSelect}>
							<div className="flex gap-2 items-center" color={tickColor}>
								<p>{submissionStatus}</p>
								<BiSolidBadgeCheck />
							</div>
						</Button>
					) : null}
					<Button small onClick={handleShowLogin}>
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
						small
					>
						<div className="flex gap-2 items-center">
							<BiAdjust />
						</div>
					</Button>
				</div>
			</div>
			<ApprovalModal
				show={showApprovalModal}
				handleClose={handleCloseApprovalModal}
				submissionDate={date}
				approval={approval}
				highlightColor={tickColor}
			/>
		</>
	);
}
