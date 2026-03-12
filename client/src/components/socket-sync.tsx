"use client";

import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { isConnectedAtom, modelUrlAtom } from "../store/atoms";
import { getSocket } from "../utils/socket";

export const SocketSync = ({ children }: { children: React.ReactNode }) => {
  const setIsConnected = useSetAtom(isConnectedAtom);
  const setModel = useSetAtom(modelUrlAtom);

  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("model", (nextModel) => {
      setModel(nextModel);
    });

    return () => {
      socket.off("model");
      socket.disconnect();
    };
  }, [setModel, setIsConnected]);

  return children;
};
