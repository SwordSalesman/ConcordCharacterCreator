import classNames from "classnames";
import {
    ContentPaneContent,
    ContentPaneWrapper,
    PaneBackgroundImage,
} from "./ContentPane.style";
import { useTheme } from "styled-components";

function ContentPane({
    background,
    mobileShow,
    imageCenter,
    children,
    ...rest
}) {
    const renderedBackground = background ? (
        <PaneBackgroundImage
            src={background}
            mobileShow={mobileShow}
            imageCenter={imageCenter}
            alt='Blurred background of a realmic logo'
        ></PaneBackgroundImage>
    ) : null;

    return (
        <ContentPaneWrapper {...rest}>
            <ContentPaneContent>{children}</ContentPaneContent>
            {renderedBackground}
        </ContentPaneWrapper>
    );
}

export default ContentPane;
