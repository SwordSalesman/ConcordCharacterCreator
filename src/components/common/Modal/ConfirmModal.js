/* eslint-disable react-hooks/exhaustive-deps */
import { Modal } from "@mui/material";
import { ModalBox, ModalRow, ModalText } from "./Modal.style";
import Button from "../Button/Button";

function ConfirmModal({ show, handleClose, title, message, options }) {
    return (
        <Modal
            open={show}
            onClose={() => handleClose(false)}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
            style={{ backdropFilter: "blur(2px)" }}
        >
            <ModalBox>
                <ModalText>
                    {title && <h1>{title}</h1>}
                    {message && <p>{message}</p>}
                </ModalText>
                <ModalRow style={{ marginTop: 16 }}>
                    <Button wide secondary onClick={() => handleClose(false)}>
                        Cancel
                    </Button>
                    <Button wide primary onClick={() => handleClose(true)}>
                        Confirm
                    </Button>
                </ModalRow>
            </ModalBox>
        </Modal>
    );
}

export default ConfirmModal;
