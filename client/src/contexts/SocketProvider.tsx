import React, { useState, useContext, useEffect, createContext } from "react";
import { io, Socket } from "socket.io-client";
import { config } from "../../config";

const environment = process.env.NODE_ENV;

const BASE_URL =
  environment === "development"
    ? config.development.url
    : config.production.url;

export interface SocketContextType {
  socket: Socket;
}

const SocketContext = React.createContext<SocketContextType | null>(null);

export function useSocket() {
  return useContext(SocketContext);
}

interface SocketProviderProps {
  id: string;
  children?: React.ReactNode;
}

export function SocketProvider({ id, children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket>();

  const fetchSocket = async () => {
    const newSocket = await io(BASE_URL, {
      forceNew: true,
    });
    setSocket(newSocket);
    return () => newSocket.close();
  };

  useEffect(() => {
    fetchSocket();
  }, [id]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
