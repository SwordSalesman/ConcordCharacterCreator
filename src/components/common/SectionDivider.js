function SectionDivider({ text, number }) {
  return (
    <div className="flex justify-center bg-gradient-to-r from-gray-300 to-gray-200 text-gray-700 font-sans">
      <div className="font-semibold">{text}</div>
      <div className="px-1 ml-1 rounded-full bg-gradient-to-r from-gray-400 to-gray-400 text-white">
        {number}
      </div>
    </div>
  );
}

export default SectionDivider;
