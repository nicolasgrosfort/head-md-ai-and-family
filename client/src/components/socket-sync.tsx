"use client";

import { useSetAtom } from "jotai";
import { useEffect } from "react";
import {
  imageAtom,
  isConnectedAtom,
  maskAtom,
  modelAtom,
  objectAtom,
  objectTitleAtom,
  speechAtom,
  storyAtom,
  storyTitleAtom,
} from "../store/atoms";
import { getSocket } from "../utils/socket";

export const SocketSync = ({ children }: { children: React.ReactNode }) => {
  const setIsConnected = useSetAtom(isConnectedAtom);
  const setSpeech = useSetAtom(speechAtom);
  const setStory = useSetAtom(storyAtom);
  const setStoryTitle = useSetAtom(storyTitleAtom);
  const setObject = useSetAtom(objectAtom);
  const setObjectTitle = useSetAtom(objectTitleAtom);
  const setImage = useSetAtom(imageAtom);
  const setMask = useSetAtom(maskAtom);
  const setModel = useSetAtom(modelAtom);

  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("speech", (nextSpeech) => {
      setSpeech(nextSpeech);
    });

    socket.on("storyTitle", (nextStoryTitle) => {
      setStoryTitle(nextStoryTitle);
    });

    socket.on("story", (nextStory) => {
      setStory(nextStory);
    });

    socket.on("object", (nextObject) => {
      setObject(nextObject);
    });

    socket.on("objectTitle", (nextObjectTitle) => {
      setObjectTitle(nextObjectTitle);
    });

    socket.on("image", (nextImage) => {
      setImage(nextImage);
    });

    socket.on("mask", (nextMask) => {
      setMask(nextMask);
    });

    socket.on("model", (nextModel) => {
      setModel(nextModel);
    });

    return () => {
      socket.off("speech");
      socket.off("story");
      socket.off("storyTitle");
      socket.off("object");
      socket.off("objectTitle");
      socket.off("image");
      socket.off("mask");
      socket.off("model");
      socket.disconnect();
    };
  }, [
    setSpeech,
    setModel,
    setIsConnected,
    setMask,
    setImage,
    setObjectTitle,
    setObject,
    setStoryTitle,
    setStory,
  ]);

  return children;
};
