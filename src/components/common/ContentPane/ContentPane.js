import classNames from "classnames";
import {
  ContentPaneContent,
  ContentPaneWrapper,
  PaneBackgroundImage,
} from "./ContentPane.style";
import { useTheme } from "styled-components";

function ContentPane({ background, forceShow, children, ...rest }) {
  const renderedBackground = background ? (
    <div>
      <PaneBackgroundImage
        src={background}
        forceShow={forceShow}
        alt="Blurred background of a realmic logo"
      ></PaneBackgroundImage>
    </div>
  ) : null;

  return (
    <ContentPaneWrapper {...rest}>
      {renderedBackground}
      <ContentPaneContent>{children}</ContentPaneContent>
    </ContentPaneWrapper>
  );
}

export default ContentPane;
