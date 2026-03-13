import { Button } from "@/components/button";
import { Place } from "@/utils/types";

type PlaceListProps = {
  places: Place[];
  currentIndex: number;
  onNavigate: (nextIndex: number) => void;
};

export const PlaceList = ({
  places,
  currentIndex,
  onNavigate,
}: PlaceListProps) => {
  return (
    <div className="fixed bottom-14 sm:bottom-20 flex justify-center overflow-scroll w-full max-w-dvw">
      <div className="grid grid-cols-3 gap-1 sm:gap-2 grid-flow-row p-4 sm:p-6 w-fit">
        {places.map((place, index) => (
          <Button
            key={place.model}
            onClick={() => onNavigate(index)}
            isSelected={currentIndex === index}
          >
            {place.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
