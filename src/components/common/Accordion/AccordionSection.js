import styled from "styled-components";
import WikiLink from "../WikiLink/WikiLink";

export function AccordionSection({ title, link, children }) {
    return (
        <SectionWrapper>
            <TitleWrapper>
                <p>{title}</p>
                {link && <WikiLink path={link} />}
            </TitleWrapper>
            <ContentWrapper>{children}</ContentWrapper>
        </SectionWrapper>
    );
}

const SectionWrapper = styled.div`
    width: 100%;
`;

const TitleWrapper = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    gap: 1em;
`;

const ContentWrapper = styled.div`
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
`;
