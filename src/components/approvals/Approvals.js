import { useEffect, useState } from "react";
import { getCharacterList, getApprovalList } from "../../hooks/use-firebase";
import {
    ApprovalListWrapper,
    ApprovalSelectWrapper,
    ApprovalsWrapper,
} from "./Approvals.style";
import useUserContext from "../../hooks/use-user-context";
import { Navigate } from "react-router-dom";
import { APPROVED, DENIED, PATH_HOME, PENDING } from "../../helpers/constants";
import CharacterList from "./characterList/CharacterList";
import ListFilter from "./ListFilter";
import CharacterCard from "./CharacterCard";
import ApprovalPanel from "./ApprovalPanel";

function Approvals() {
    const [characters, setCharacters] = useState([]);
    const [selectedChar, setSelectedChar] = useState(null);
    const [filter, setFilter] = useState(PENDING);
    const [dateOrder, setDateOrder] = useState(true);
    const { isAdmin } = useUserContext();
    const [counts, setCounts] = useState({
        pending: 0,
        approved: 0,
        denied: 0,
        total: 0,
    });

    useEffect(() => {
        async function fetchCharacters() {
            const chars = await getCharacterList();
            const apprs = await getApprovalList();

            if (chars && apprs) {
                let newChars = chars.map((c) => {
                    const approval = apprs.find((a) => a.id === c.id);
                    return { ...c, approval: approval };
                });
                setCharacters(newChars);
                calcCounts(newChars);
            }
        }
        if (isAdmin) {
            fetchCharacters();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdmin]);

    function handleSelectFilter(f) {
        if (f === filter) {
            setFilter(null);
        } else {
            setFilter(f);
        }
    }

    function calcCounts(chars) {
        const pendingCount = chars.filter((c) => {
            return (
                !c.approval?.status ||
                c.date.localeCompare(c.approval?.date) > 0
            );
        }).length;
        const approvedCount = chars.filter((c) => {
            return c.approval?.status === APPROVED;
        }).length;
        const deniedCount = chars.filter((c) => {
            return c.approval?.status === DENIED;
        }).length;
        setCounts({
            pending: pendingCount,
            approved: approvedCount,
            denied: deniedCount,
            total: chars.length,
        });
    }

    function handleApproval(approval) {
        const newChars = characters.map((c) => {
            if (c.id !== approval.id) return c;
            return { ...c, approval: approval };
        });
        setCharacters(newChars);
        calcCounts(newChars);
    }

    function toggleDateOrder() {
        setDateOrder(!dateOrder);
    }

    const sortedFilteredCharacters = characters
        .filter((c) => {
            if (!filter) return true;
            if (
                filter === PENDING &&
                (!c.approval?.status ||
                    c.date.localeCompare(c.approval?.date) > 0)
            ) {
                return true;
            }
            return c.approval?.status === filter;
        })
        .sort((a, b) => a.date.localeCompare(b.date) * (dateOrder ? 1 : -1));

    return isAdmin ? (
        <ApprovalsWrapper>
            <ApprovalListWrapper>
                <ListFilter
                    filter={filter}
                    selectFilter={handleSelectFilter}
                    dateOrder={dateOrder}
                    toggleDateOrder={toggleDateOrder}
                    counts={counts}
                />
                <CharacterList
                    characters={sortedFilteredCharacters}
                    handleSelect={setSelectedChar}
                    activeCharacter={selectedChar}
                />
            </ApprovalListWrapper>
            <ApprovalSelectWrapper>
                <CharacterCard character={selectedChar} />
                <ApprovalPanel
                    character={selectedChar}
                    handleApproval={handleApproval}
                />
            </ApprovalSelectWrapper>
        </ApprovalsWrapper>
    ) : (
        <Navigate to={PATH_HOME} />
    );
}

export default Approvals;
