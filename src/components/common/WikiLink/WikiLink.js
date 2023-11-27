import { GiOpenBook } from "react-icons/gi";
import { StyledWikiLink } from "./WikiLink.style";
import React from "react";

const root = "https://wiki.concordlarp.com/index.php/";

function WikiLink({ path, ...rest }) {
    const url = path ? root + path : root;

    const handleClick = (e) => {
        e.stopPropagation();
    };

    return (
        <a href={url} onClick={handleClick} target='_blank' rel='noreferrer'>
            <StyledWikiLink title={url} {...rest}>
                <GiOpenBook size={19} />
            </StyledWikiLink>
        </a>
    );
}

export default WikiLink;
