type LoadingProps = {
  isHidden?: boolean;
  textValue?: string;
};

export const Loading = ({
  isHidden,
  textValue = "Loading...",
}: LoadingProps) => {
  if (isHidden) return null;

  return (
    <p
      className={`
        fixed 
        top-[50%] left-[50%]
        translate-x-[-50%] translate-y-[-50%]  
        font-semibold
        text-sm sm:text-xl
      `}
    >
      {textValue}
    </p>
  );
};
