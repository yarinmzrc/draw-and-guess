import React, { useState, useContext, useEffect, createContext } from "react";
import { io, Socket } from "socket.io-client";

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
  const [socket, setSocket] = useState<any>();

  const fetchSocket = async () => {
    const newSocket = await io(`https://guarded-stream-67963.herokuapp.com/`, {
      query: { id },
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
