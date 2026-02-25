"use client";
import { Button } from "@/components/button";
import { TextBox } from "@/components/text-box";
import { Place } from "@/utils/types";
import { useState } from "react";

type PlaceDataProps = {
  place: Place;
};

export const PlaceData = ({ place }: PlaceDataProps) => {
  const [isDetailVisible, setIsDetailVisible] = useState(true);

  const toggleIsDetailVisible = () =>
    setIsDetailVisible((currentIsDetailVisible) => !currentIsDetailVisible);

  return (
    <div className="fixed top-0 left-0 grid gap-4 p-4 sm:p-6 max-w-110">
      <h2 className={`w-fit`}>
        <Button
          isSelected={isDetailVisible}
          onClick={toggleIsDetailVisible}
          className="text-sm sm:text-xl"
        >
          [{place.name}]
        </Button>
      </h2>
      {isDetailVisible && (
        <div className="flex flex-col gap-2">
          {place.text && (
            <p className="font-medium text-xs sm:text-base">
              <TextBox>{place.text}</TextBox>
            </p>
          )}
          <p className="text-center font-medium text-xs sm:text-sm">
            <TextBox>{place.location}</TextBox>
          </p>
          <p className="text-center font-medium text-xs sm:text-sm">
            <TextBox>{place.date}</TextBox>
          </p>
        </div>
      )}
    </div>
  );
};
