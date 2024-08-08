// Component for "Required" in red
const Required = ({ error, children }) => {
  return (
    <div className="inline-flex justify-normal items-center text-[#c91202] text-[10px] mx-[6px] md:text-[11px] max-h-[12px] md:max-h-[14px] whitespace-nowrap flex-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-message-square-warning w-[18px] h-auto shrink m-0 p-0"
        preserveAspectRatio="xMinYMin meet"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M12 7v2" />
        <path d="M12 13h.01" />
      </svg>
      <p className="inline-block ml-1 p-0 overflow-visible text-wrap max-w-[230px] md:max-w-[253px] min-h-full">
        {error}
        {children}
      </p>
    </div>
  );
};
export default Required;
