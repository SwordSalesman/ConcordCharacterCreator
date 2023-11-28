/* eslint-disable react-hooks/exhaustive-deps */
import { Modal } from "@mui/material";
import React from "react";
import { ModalBox, ModalRow, ModalText } from "./Modal.style";
import Button from "../Button/Button";
import { APPROVED, DENIED } from "../../../helpers/constants";
import { StyledBorder } from "../../pages/review/ReviewPage.style";

function ApprovalModal({
    show,
    handleClose,
    submissionDate,
    approval,
    highlightColor,
    options,
}) {
    let title = "Approval Pending";
    let submissionInfo = `Latest submission ${submissionDate}`;
    let subtitle = "Your character is set to be approved by the team";
    let comment = null;

    if (!submissionDate) {
        title = "Character Approval";
        submissionInfo = null;
        subtitle =
            "When you submit your character you'll be able to see your approval status here.";
        comment = null;
    } else if (approval?.status === APPROVED) {
        title = "Character Approved";
        subtitle = `${approval?.author} on ${approval?.date}:`;
        comment = approval?.comment ? `"${approval?.comment}"` : null;
    } else if (approval?.status === DENIED) {
        title = "Changes Requested";
        subtitle = `${approval?.author} on ${approval?.date}:`;
        comment = approval?.comment ? `"${approval?.comment}"` : null;
    }

    return (
        <Modal
            open={show}
            onClose={() => handleClose(false)}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
            style={{ backdropFilter: "blur(2px)" }}
        >
            <ModalBox wide>
                <ModalText>
                    <h1 style={{ color: highlightColor }}>{title}</h1>
                    {submissionInfo ? (
                        <div style={{ paddingBottom: 8, opacity: 0.8 }}>
                            <p>{submissionInfo}</p>
                        </div>
                    ) : null}
                    <StyledBorder />
                    <div style={{ paddingTop: 8 }}>
                        <p>{subtitle}</p>
                    </div>
                    {comment ? (
                        <div style={{ paddingTop: 8 }}>
                            <i>{comment}</i>
                        </div>
                    ) : null}
                </ModalText>
                <ModalRow style={{ marginTop: 16 }}>
                    <Button outline onClick={() => handleClose(true)}>
                        Close
                    </Button>
                </ModalRow>
            </ModalBox>
        </Modal>
    );
}

export default ApprovalModal;
