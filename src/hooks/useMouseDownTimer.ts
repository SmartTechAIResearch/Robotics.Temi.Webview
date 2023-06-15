import { useEffect, useRef } from 'react';

export function useMouseDownTimer(callback, delay) {
  const timerId = useRef<NodeJS.Timeout | undefined>();

  const startTimer = () => {
    console.log("Mouse held down, timer started ...");
    timerId.current = setTimeout(callback, delay);
  };

  const stopTimer = () => {
    console.log("... Timer stopped")
    clearTimeout(timerId.current);
  };

  useEffect(() => {
    return () => {
      // Clean up on unmount
      clearTimeout(timerId.current);
    };
  }, []);

  return [startTimer, stopTimer];
}
