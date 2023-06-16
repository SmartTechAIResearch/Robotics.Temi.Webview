import { useEffect, useState } from 'react';
import { useSocket } from '../SocketContext';

export function useShutdown() {
  const [shutdownCount, setShutdownCount] = useState(0);
  const socket = useSocket();

  useEffect(() => {
    console.debug("Incremented the ShutdownCounter, now at:", shutdownCount);
    if (shutdownCount === 15) {
        console.warn("Shutting down the application");
        socket.emit("shutdown");
    }
  }, [shutdownCount, socket]);

  useEffect(() => {
    if (shutdownCount >= 1) {
        setTimeout(() => {
            console.debug("Resetting the Shutdown counter because nothing happened the last 10 seconds.");
            setShutdownCount(0);
        }, 10000);
    }
  });

  return setShutdownCount;
}
