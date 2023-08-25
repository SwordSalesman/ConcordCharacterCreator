import { ContentPaneContent, ContentPaneWrapper } from "./ContentPane.style";

function ContentPane({ children, ...rest }) {
    return (
        <ContentPaneWrapper {...rest}>
            <ContentPaneContent>{children}</ContentPaneContent>
        </ContentPaneWrapper>
    );
}

export default ContentPane;
