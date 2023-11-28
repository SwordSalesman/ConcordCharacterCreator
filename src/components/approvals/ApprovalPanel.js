import styled, { useTheme } from "styled-components";
import { useEffect, useState } from "react";
import TextInput from "../common/TextInput/TextInput";
import Button from "../common/Button/Button";
import useUserContext from "../../hooks/use-user-context";
import { saveApproval } from "../../hooks/use-firebase";
import toast from "react-hot-toast";
import { APPROVED, DENIED } from "../../helpers/constants";

function ApprovalPanel({ character, handleApproval }) {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [author, setAuthor] = useState("");
    const [date, setDate] = useState("");
    const [comment, setComment] = useState("");
    const [status, setStatus] = useState(null);
    const { name } = useUserContext();
    const [validInputs, setValidInputs] = useState({
        validStatus: true,
        validComment: true,
    });

    function handleSubmit(e) {
        e.preventDefault();
        const valid = validateInputs();
        if (!valid) {
            return;
        } else {
            setLoading(true);
            toast.promise(saveApproval(name, comment, status, character.id), {
                success: (approval) => {
                    setLoading(false);
                    handleApproval({ ...approval, id: character.id });
                    setAuthor(name);
                    setDate(approval.date);
                    return status === APPROVED
                        ? "Approval submitted"
                        : "Changes requested";
                },
                loading: "Submitting...",
                error: (err) => {
                    setLoading(false);
                    return `Failed to submit approval, ${err}`;
                },
            });
        }
    }

    useEffect(() => {
        setComment(character?.approval?.comment ?? "");
        setStatus(character?.approval?.status ?? null);
        setAuthor(character?.approval?.author ?? "");
        setDate(character?.approval?.date ?? "");
        setValidInputs({ validStatus: true, validComment: true });
    }, [character]);

    function handleSelect(name) {
        if (!character || loading) {
            return;
        }
        if (status === name) {
            setStatus(null);
        } else {
            setStatus(name);
        }
    }

    const validateInputs = () => {
        const validStatus = status !== null;
        const validComment = status === APPROVED || comment.length > 0;
        setValidInputs({ validStatus, validComment });
        return validStatus && validComment;
    };

    const statusOptions = [
        {
            name: APPROVED,
            label: "Approve",
            icon: <p>👍</p>,
            color: theme.success,
        },
        {
            name: DENIED,
            label: "Request Changes",
            icon: <p>👎</p>,
            color: theme.error,
        },
    ].map((s) => {
        return (
            <StatusOption
                onClick={() => handleSelect(s.name)}
                active={status === s.name}
                color={s.color}
                disabled={!character || loading}
            >
                {s.icon}
                <p>{s.label}</p>
            </StatusOption>
        );
    });

    return (
        <ApprovalPanelWrapper>
            <VerticalFade />
            <ApprovalForm onSubmit={handleSubmit}>
                <h2 style={{ fontSize: "1.2em" }}>Approval Form</h2>

                {author && date ? (
                    <i>
                        {author} on {date}
                    </i>
                ) : (
                    <i>Pending review</i>
                )}

                <StatusOptions error={!validInputs.validStatus}>
                    {statusOptions}
                </StatusOptions>
                <TextInput
                    value={comment}
                    onChange={setComment}
                    placeholder='This will be shown to the player'
                    title='Comments'
                    fixed={false}
                    disabled={!character || loading}
                    invalid={!validInputs.validComment}
                    invalidText='Denied submissions should include a comment'
                />
                <Button
                    style={{ marginTop: "15px" }}
                    outline
                    disabled={!character || loading}
                >
                    Submit
                </Button>
            </ApprovalForm>
        </ApprovalPanelWrapper>
    );
}

export default ApprovalPanel;

const ApprovalPanelWrapper = styled.div`
    border: 1px solid ${(props) => props.theme.border};
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    height: fit-content;
    position: relative;
    font-size: 0.9em;
    /* overflow: hidden; */
`;

const VerticalFade = styled.div`
    width: 100%;
    height: 40px;
    position: absolute;
    top: -41px;
    z-index: 3;
    background: linear-gradient(
        180deg,
        rgba(255, 0, 0, 0) 0%,
        ${(props) => props.theme.background} 90%
    );
`;

const StatusOptions = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    margin: 14px 0 10px 0;
    width: fit-content;

    border-radius: 6px;
    border: ${(props) => (props.error ? "2px solid" : "none")};
    border-color: ${(props) => props.theme.error};
`;

const StatusOption = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px;

    border: 1px solid ${(props) => props.theme.border};
    border-radius: 6px;
    background-color: ${(props) =>
        props.active ? props.color : props.theme.backgroundRaised};
    color: ${(props) => (props.active ? "white" : "default")};
    opacity: ${(props) => (props.disabled ? "0.7" : "1")};
    cursor: ${(props) => (props.disabled ? "default" : "pointer")};

    line-height: 1em;

    &:hover {
        filter: brightness(
            ${(props) => (props.theme.name === "light" ? "0.95" : "1.1")}
        );
    }
`;

const ApprovalForm = styled.form`
    padding: 14px;
`;
