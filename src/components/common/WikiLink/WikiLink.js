import { GiOpenBook } from "react-icons/gi";
import classNames from "classnames";
import { StyledWikiLink } from "./WikiLink.style";

const root = "http://concordlarpaus.wikidot.com/";

function WikiLink({ path, ...rest }) {
    //const url = path ? root + path.join(":") : root;
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
