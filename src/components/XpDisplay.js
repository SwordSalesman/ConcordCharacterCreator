function XpDisplay({ remaining, total }) {
  return (
    <div
      className="flex bg-gray-200 w-16 h-10 rounded-full 
      items-center justify-center"
    >
      <div className="text-2xl">{remaining}</div>
      <div className="pl-[1px] text-xs opacity-70 italic">/{total} XP</div>
    </div>
  );
}

export default XpDisplay;
