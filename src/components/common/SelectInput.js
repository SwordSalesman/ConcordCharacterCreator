import classNames from "classnames";
import ReactDropdown from "react-dropdown";

function SelectInput({
  options,
  title,
  onChange,
  value,
  disabled,
  placeholder,
  ...rest
}) {
  const handleChange = (option) => {
    onChange(option.value);
  };

  const inputClasses = classNames(
    "w-full p-[2px] rounded-lg",
    "border border-gray-300",
    "text-center text-sm font-sans",
    "placeholder:italic placeholder:opacity-70",
    rest.className,
    {
      "bg-white cursor-pointer": !disabled,
      "bg-gray-100 text-gray-400": disabled,
    }
  );

  const menuClasses = classNames("bg-transparent");

  const placeholderClasses = classNames({
    "opacity-30 italic": !value,
  });

  return (
    <div className="w-11/12">
      <div className="text-sm opacity-60 font-serif tracking-tighter">
        {title}
      </div>
      <ReactDropdown
        options={options}
        value={value}
        className={inputClasses}
        menuClassName={menuClasses}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        placeholderClassName={placeholderClasses}
      ></ReactDropdown>
    </div>
  );
}

export default SelectInput;
