import classNames from "classnames";

function TextInput({ value, onChange, title, placeholder, ...rest }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  const inputClasses = classNames(
    "w-full h-7 pt-1 px-1 bg-white rounded-lg",
    "border border-gray-300 bg-white",
    "leading-4 text-center text-sm font-sans",
    "placeholder:italic placeholder:opacity-70",
    rest.className
  );

  return (
    <div className="w-11/12">
      <div className="text-sm opacity-60 font-serif tracking-tighter">
        {title}
      </div>
      <textarea
        value={value || ""}
        className={inputClasses}
        type="text"
        onChange={handleChange}
        placeholder={placeholder}
        spellcheck="false"
        maxLength="1000"
      ></textarea>
    </div>
  );
}

export default TextInput;
