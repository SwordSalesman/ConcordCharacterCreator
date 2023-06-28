import classNames from "classnames";
import {
  ContentPaneContent,
  ContentPaneWrapper,
  PaneBackgroundImage,
} from "./ContentPane.style";

function ContentPane({ background, children }) {
  const renderedBackground = background ? (
    <div>
      <PaneBackgroundImage
        src={background}
        alt="Blurred background of a realmic logo"
      ></PaneBackgroundImage>
    </div>
  ) : null;

  return (
    <ContentPaneWrapper>
      {renderedBackground}
      <ContentPaneContent bg={background}>{children}</ContentPaneContent>
    </ContentPaneWrapper>
  );
}

export default ContentPane;
