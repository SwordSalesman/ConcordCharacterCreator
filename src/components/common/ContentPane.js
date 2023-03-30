import classNames from "classnames";

function ContentPane({ background, children }) {
  const renderedBackground = background ? (
    <div>
      <img
        className="absolute top-6 mix-blend-multiply blur-[1px] w-full max-w-[400px] opacity-10"
        src={background}
        alt="Blurred background of a realmic logo"
      ></img>
      {/* <div className="absolute inset-0 w-full h-full bg-white opacity-[92%]"></div> */}
    </div>
  ) : null;

  return (
    <div className="relative w-[49%] h-[450px] p-0">
      {renderedBackground}
      <div className="absolute h-full w-full overflow-x-hidden">{children}</div>
    </div>
  );

  // if (background) {
  //   const classesBackground = classNames(
  //     "absolute w-[340px] h-96",
  //     `bg-${background}`,
  //     "bg-left bg-no-repeat bg-[length:400px_400px]"
  //   );

  //   const classesFilter = classNames(
  //     "absolute w-[340px] h-96",
  //     "backdrop-blur-[2px]"
  //   );

  //   return (
  //     <div className="relative w-[340px] h-96 overflow-scroll py-1">
  //       <div className="absolute">
  //         <div className={classesBackground}></div>
  //         <div className={classesFilter}></div>
  //       </div>
  //       <div className="absolute">{children}</div>
  //     </div>
  //   );
  // }
  // return (
  //   <div className="relative w-[340px] h-96 overflow-scroll py-1">
  //     <div className="">{children}</div>
  //   </div>
  // );
}

export default ContentPane;
