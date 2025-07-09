
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const Timer = ({ currentLevel, maxLevel }) => {
  const [seconds, setSeconds] = useState(null); // Start with null to check when backend time is fetched

  const intervalRef = useRef(null);

  // ✅ Fetch time on mount
  useEffect(() => {
    const fetchTimer = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/game/progress/getTime', {
          withCredentials: true,
        });
        const savedTime = res.data.timer || 0;
        setSeconds(savedTime);
       
      } catch (error) {
        console.error('Error fetching timer:', error);
        setSeconds(0); // Fallback if backend fails
      }
    };
    fetchTimer();
  }, []);

  // ✅ Start timer only when `seconds` is loaded from backend
  useEffect(() => {
    if (seconds === null) return; // Do nothing until seconds is fetched

    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      saveTimer(); // Save on unmount
    };
  }, [seconds]); // Start counting only after seconds is set

  // ✅ Save every 5 seconds
  useEffect(() => {
    if (seconds === null) return;
    const interval = setInterval(() => {
      saveTimer();
    }, 5000);
    return () => clearInterval(interval);
  }, [seconds]);

  // ✅ Save on level change
  useEffect(() => {
    if (seconds !== null && currentLevel !== 1) {
      saveTimer();
    }
  }, [currentLevel]);

  // ✅ Stop timer if final level is completed
  useEffect(() => {
    if (currentLevel > maxLevel) {
      clearInterval(intervalRef.current);
      saveTimer();
    }
  }, [currentLevel, maxLevel]);

  const saveTimer = async () => {
    try {
      await axios.patch(
        'http://localhost:3000/api/v1/game/progress/time',
        { timer: seconds },
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Error saving timer:', error);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  if (seconds === null) return null; // or a loader/spinner

  return (
    <div className="bg-white/90 backdrop-blur-lg px-4 py-2 rounded-2xl shadow text-green-700 text-[15px] font-semibold">
    ⏱ Time: {formatTime(seconds)}
    </div>

  );
};

export default Timer;
