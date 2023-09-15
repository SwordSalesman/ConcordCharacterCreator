import styled from "styled-components";

export function AccordionSection({ title, children }) {
    return (
        <SectionWrapper>
            <TitleWrapper>{title}</TitleWrapper>
            <ContentWrapper>{children}</ContentWrapper>
        </SectionWrapper>
    );
}

const SectionWrapper = styled.div`
    width: 100%;
`;

const TitleWrapper = styled.div``;

const ContentWrapper = styled.div`
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
`;
