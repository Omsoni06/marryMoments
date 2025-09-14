"use client";
import { useEffect, useRef } from "react";
import { initSocket, disconnectSocket } from "@/lib/socket";

export const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = initSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  return socketRef.current;
};
