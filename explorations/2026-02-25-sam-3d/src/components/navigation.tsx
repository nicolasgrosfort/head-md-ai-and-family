"use client";

import { Button } from "@/components/button";
import { Place } from "@/utils/types";

type NavigationProps = {
  places: Place[];
  currentIndex: number;
  toggleShowList: () => void;
  showList: boolean;
  isSoundOn: boolean;
  toggleIsSoundOn: () => void;
  onNavigate: (index: number) => void;
};

export const Navigation = ({
  places,
  currentIndex,
  showList,
  isSoundOn,
  toggleIsSoundOn,
  toggleShowList,
  onNavigate,
}: NavigationProps) => {
  const nextPlace = places[currentIndex + 1] ?? places[0];
  const previousPlace = places[currentIndex - 1] ?? places[places.length - 1];

  return (
    <>
      <div className="fixed top-0 right-0 p-4 sm:p-6 flex gap-2">
        <Button onClick={() => toggleIsSoundOn()} isSelected={isSoundOn}>
          {`sound ~> [${isSoundOn ? "on" : "off"}]`}
        </Button>
      </div>

      <div className="fixed bottom-0 left-0 p-4 sm:p-6 w-full flex justify-center gap-2 sm:gap-4">
        <div className="flex justify-start">
          <Button
            onClick={() =>
              onNavigate(
                places.findIndex(
                  (place) => place.model === previousPlace.model,
                ),
              )
            }
            isHidden={!previousPlace}
            className="min-w-0"
          >
            {`<=|`}
          </Button>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={toggleShowList}
            isSelected={showList}
            className="shrink-0"
          >
            {showList ? "[close]" : "[list]"}
          </Button>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() =>
              onNavigate(
                places.findIndex((place) => place.model === nextPlace.model),
              )
            }
            isHidden={!nextPlace}
            className="min-w-0"
          >
            {` |=>`}
          </Button>
        </div>
      </div>
    </>
  );
};
