type TextBoxProps = { children: React.ReactNode };

export const TextBox = ({ children }: TextBoxProps) => {
  return (
    <span
      className={`
        block
      bg-white/40
        backdrop-blur-md 
        border-2 border-black
        px-4 sm:px-6 py-2 sm:py-3`}
    >
      {children}
    </span>
  );
};
