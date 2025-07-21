// frontend/src/context/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      // Establish connection only when user is logged in
      const newSocket = io('http://localhost:5001'); // Your backend URL
      setSocket(newSocket);

      return () => newSocket.close();
    } else {
      // If user logs out, disconnect socket
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [isAuthenticated]); // Rerun when auth state changes

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};