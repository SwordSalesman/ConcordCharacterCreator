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
    /* margin: 10px 0; */
`;

const TitleWrapper = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 10px;
`;

const ContentWrapper = styled.div`
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
`;
