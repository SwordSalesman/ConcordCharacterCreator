import classNames from "classnames";
import { ContentPaneWrapper } from "./ContentPane.style";

function ContentPane({ background, image, children }) {
  const renderedBackground =
    background || image ? (
      <div>
        <img
          className={
            "absolute top-6 w-full max-w-[450px]" +
            (background && " blur-[1px] opacity-10")
          }
          src={background ? background : image}
          alt="Blurred background of a realmic logo"
        ></img>
        {/* <div className="absolute inset-0 w-full h-full bg-white opacity-[92%]"></div> */}
      </div>
    ) : null;

  return (
    <div className="relative w-[49%] h-[400px] p-0">
      {renderedBackground}
      <ContentPaneWrapper className="absolute h-full w-full overflow-x-hidden">
        {children}
      </ContentPaneWrapper>
    </div>
  );
}

export default ContentPane;
