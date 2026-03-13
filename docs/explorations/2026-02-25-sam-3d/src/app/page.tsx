"use client";

import { Button } from "@/components/button";
import { Loading } from "@/components/loading";
import { Navigation } from "@/components/navigation";
import { PlaceData } from "@/components/place-data";
import { PlaceList } from "@/components/place-list";
import { Scene } from "@/components/scene";
import { Place } from "@/utils/types";
import { Suspense, useState } from "react";
import placesData from "../data/places.json";

const places = placesData.places as Place[];

export default function Page() {
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showList, setShowList] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const currentPlace = places[currentIndex];

  const toggleShowList = () =>
    setShowList((currentShowList) => !currentShowList);

  const toggleSetIsSoundOn = () =>
    setIsSoundOn((currentIsSoundOn) => !currentIsSoundOn);

  const goToPlace = (index: number) => {
    if (index >= 0 && index < places.length) {
      setCurrentIndex(index);
    }
  };

  return (
    <div className="fixed inset-0">
      {isReady ? (
        <>
          <Suspense fallback={<Loading />}>
            <Scene place={currentPlace} isSoundOn={isSoundOn} />
          </Suspense>

          {showList && (
            <PlaceList
              places={places}
              currentIndex={currentIndex}
              onNavigate={goToPlace}
            />
          )}

          <PlaceData place={currentPlace} />

          <Navigation
            showList={showList}
            isSoundOn={isSoundOn}
            toggleIsSoundOn={toggleSetIsSoundOn}
            toggleShowList={toggleShowList}
            currentIndex={currentIndex}
            onNavigate={goToPlace}
            places={places}
          />
        </>
      ) : (
        <div className="flex h-full w-full justify-center items-center flex-col gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Kankyò</h1>
          <p className="text-center text-sm sm:text-base">
            A sonic journey through immersive <br />
            Japanese urban landscapes.
          </p>
          <Button onClick={() => setIsReady(true)}>Start</Button>
          <p className="text-right text-xs sm:text-sm fixed bottom-0 right-0 p-4 sm:p-6">
            {"~~>"} [2026]
          </p>
          <p className="text-right text-xs sm:text-sm fixed bottom-0 left-0 p-4 sm:p-6">
            Made with &lt;3 by{" "}
            <a href="https://tekh.studio" target="_blank" className="underline">
              tèkh studio
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
