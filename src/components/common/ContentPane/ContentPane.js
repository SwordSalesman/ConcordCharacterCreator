import { ContentPaneContent, ContentPaneWrapper } from "./ContentPane.style";
import React from "react";

function ContentPane({ children, ...rest }) {
    return (
        <ContentPaneWrapper {...rest}>
            <ContentPaneContent>{children}</ContentPaneContent>
        </ContentPaneWrapper>
    );
}

export default ContentPane;
