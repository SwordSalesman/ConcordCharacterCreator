import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    BannerArrow,
    BannerContent,
    BannerSpacer,
    BannerWrapper,
    FullText,
    SummaryText,
} from "./Banner.style";
import { BiChevronUp } from "react-icons/bi";

// Probably move this stuff into a helper
const winterDate = "06-20";
const summerDate = "09-30";

function prettifyDate(date) {
    if (!date) return "";
    return date.split("-").reverse().join("/");
}

function getPrevAndNextGame(today) {
    // Only gets the last two digits
    const currYear = Number.parseInt(new Date().toISOString().slice(2, 4));
    const lastYearStr = "2" + (currYear - 1).toString();
    const thisYearStr = "2" + currYear.toString();
    const nextYearStr = "2" + (currYear + 1).toString();

    if (today < winterDate) {
        return {
            prev: { date: summerDate, name: "Summer " + lastYearStr },
            next: "Winter " + thisYearStr,
        };
    } else if (today > summerDate) {
        return { prev: "Summer " + thisYearStr, next: "Winter " + nextYearStr };
    } else {
        return { prev: "Winter " + thisYearStr, next: "Summer " + thisYearStr };
    }
}

function getState(prev, dateSubmitted) {
    if (!dateSubmitted) return 0;

    const prevDate = prev.startsWith("Winter") ? winterDate : summerDate;

    if (dateSubmitted.slice(5) < prevDate) {
        return 1;
    } else {
        return 2;
    }
}

export function Banner({ show, dateSubmitted }) {
    const [expanded, setExpanded] = useState(true);
    const [submitState, setSubmitState] = useState(0);

    // Gets date but only "MM-dd"
    const today = new Date().toISOString().slice(5, 10);

    const { prev, next } = useMemo(() => getPrevAndNextGame(today), [today]);

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
                full: `You haven't submitted a character for ${next} - don't forget to submit!`,
                summary: "Not Submitted",
            };
        } else if (submitState === 1) {
            return {
                full: `Your last submission was on ${prettifyDate(
                    dateSubmitted
                )}. Don't forget to submit your character for ${next}`,
                summary: "Not Submitted",
            };
        } else if (submitState === 2) {
            return {
                full: `You're all set! Your submission on ${prettifyDate(
                    dateSubmitted
                )} is ready for ${next}`,
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
                    <FullText expanded={expanded}>{messages.full}</FullText>
                    <SummaryText expanded={expanded}>
                        {messages.summary}
                    </SummaryText>
                </BannerContent>
            </BannerWrapper>
        </BannerSpacer>
    );
}
