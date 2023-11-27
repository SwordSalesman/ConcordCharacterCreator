import React, { useEffect, useMemo, useState } from "react";
import {
    BannerArrow,
    BannerContent,
    BannerSpacer,
    BannerWrapper,
    FullText,
    SummaryText,
} from "./Banner.style";
import { BiChevronUp } from "react-icons/bi";
import gameData from "../../../data/tables/games.json";
import { getCurrentDate } from "../../../helpers/date-helper";

function prettifyDate(date) {
    if (!date) return "";
    const y = date.slice(0, 4);
    const m = date.slice(5, 7);
    const d = date.slice(8, 10);
    return `${d}/${m}/${y}`;
}

function getPrevAndNextGame() {
    const today = getCurrentDate();
    let games = null;
    gameData.forEach((game, index) => {
        if (game.date > today && !games) {
            games = {
                prev: gameData.at(index - 1),
                next: game,
            };
        }
    });
    return games;
}

function getState(prev, dateSubmitted) {
    if (!dateSubmitted) {
        return 0;
    }
    if (dateSubmitted < prev.date) {
        return 1;
    } else {
        return 2;
    }
}

export function Banner({ show, dateSubmitted, approval }) {
    const [expanded, setExpanded] = useState(true);
    const [submitState, setSubmitState] = useState(0);

    const { prev, next } = useMemo(() => getPrevAndNextGame(), []);

    function handleClick() {
        setExpanded((expandValue) => !expandValue);
    }

    function scrollToBanner() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    useEffect(() => {
        if (show) scrollToBanner();
    }, [show]);

    function getStateMessages() {
        if (submitState === 0) {
            return {
                full: `You haven't submitted a character yet. Don't forget to submit for ${next.name}.`,
                summary: "Not Submitted",
            };
        } else if (submitState === 1) {
            return {
                full: `Your last submission was on ${prettifyDate(
                    dateSubmitted
                )}. Don't forget to submit your character for ${next.name}`,
                summary: "Not Submitted",
            };
        } else if (submitState === 2) {
            return {
                full: `Your submission on ${prettifyDate(
                    dateSubmitted
                )} is ready for ${next.name}`,
                summary: "Submitted",
            };
        }
    }

    useEffect(() => {
        setSubmitState(getState(prev, dateSubmitted));
    }, [prev, dateSubmitted]);

    const messages = getStateMessages(submitState);

    if (!show) {
        return <></>;
    }

    return (
        <BannerSpacer>
            <BannerWrapper
                expanded={expanded}
                onClick={handleClick}
                type={submitState === 2 ? "success" : "warning"}
            >
                <BannerArrow expanded={expanded}>
                    <BiChevronUp size={30} />
                </BannerArrow>
                <BannerContent>
                    <FullText expanded={expanded}>
                        {messages.full}
                        <p>{approval ? approval.status : null}</p>
                    </FullText>
                    <SummaryText expanded={expanded}>
                        {messages.summary}
                    </SummaryText>
                </BannerContent>
            </BannerWrapper>
        </BannerSpacer>
    );
}
