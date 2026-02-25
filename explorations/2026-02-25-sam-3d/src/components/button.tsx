type ButtonProps = {
  onClick: () => void;
  isHidden?: boolean;
  children: React.ReactNode;
  isSelected?: boolean;
  className?: string;
};

export const Button = ({
  isHidden,
  isSelected,
  onClick,
  children,
  className,
}: ButtonProps) => {
  if (isHidden) return null;

  return (
    <button
      onClick={onClick}
      className={`
        backdrop-blur-md 
        border-2 border-black
        px-2 py-2 sm:px-6 sm:py-3
        text-xs sm:text-base
        cursor-pointer
        font-semibold
        whitespace-nowrap overflow-hidden text-ellipsis
        ${isSelected ? "bg-black/40 text-white" : "bg-white/40 text-black"}
        ${className}
        `}
    >
      {children}
    </button>
  );
};
