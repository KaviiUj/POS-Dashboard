import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Custom hook to detect user inactivity and trigger a callback
 * @param {number} timeout - Inactivity timeout in milliseconds
 * @param {function} onInactive - Callback function to execute when user becomes inactive
 */
const useInactivityTimeout = (timeout = 15 * 60 * 1000, onInactive) => {
  const [isInactive, setIsInactive] = useState(false);
  const timeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const onInactiveRef = useRef(onInactive);

  // Update the ref when onInactive changes
  useEffect(() => {
    onInactiveRef.current = onInactive;
  }, [onInactive]);

  const resetTimer = useCallback(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Update last activity time
    lastActivityRef.current = Date.now();
    setIsInactive(false);

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setIsInactive(true);
      if (onInactiveRef.current) {
        onInactiveRef.current();
      }
    }, timeout);
  }, [timeout]);

  useEffect(() => {
    // Events to track for user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Reset timer on any user activity
    const handleActivity = () => {
      resetTimer();
    };

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Initialize timer
    resetTimer();

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimer]);

  return { isInactive, resetTimer };
};

export default useInactivityTimeout;

