function TextInput({ value, onChange, title, placeholder }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div className="w-11/12">
      <div className="text-sm opacity-60 font-serif tracking-tighter">
        {title}
      </div>
      <textarea
        value={value || ""}
        className="input border w-full min-h-fit py-1 border-gray-300 px-1 ml-2 leading-4 text-center bg-white rounded-lg"
        type="text"
        onChange={handleChange}
        placeholder={placeholder}
      ></textarea>
    </div>
  );
}

export default TextInput;
