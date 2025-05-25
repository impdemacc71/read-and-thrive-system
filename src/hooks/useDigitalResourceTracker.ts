
import { useState, useEffect, useRef } from 'react';

interface UsageSession {
  resourceId: string;
  startTime: number;
  endTime?: number;
  totalTime: number;
}

export const useDigitalResourceTracker = (resourceId: string) => {
  const [isActive, setIsActive] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load existing usage data from localStorage
  useEffect(() => {
    const savedUsage = localStorage.getItem(`usage-${resourceId}`);
    if (savedUsage) {
      setTotalTime(parseInt(savedUsage, 10));
    }
  }, [resourceId]);

  const startTracking = () => {
    if (!isActive) {
      setIsActive(true);
      startTimeRef.current = Date.now();
      
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const currentSession = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setSessionTime(currentSession);
        }
      }, 1000);
    }
  };

  const stopTracking = () => {
    if (isActive && startTimeRef.current) {
      setIsActive(false);
      const sessionDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const newTotalTime = totalTime + sessionDuration;
      
      setTotalTime(newTotalTime);
      setSessionTime(0);
      
      // Save to localStorage
      localStorage.setItem(`usage-${resourceId}`, newTotalTime.toString());
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      startTimeRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isActive,
    totalTime,
    sessionTime,
    startTracking,
    stopTracking,
    formatTime
  };
};
