
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const Timer = ({ currentLevel, maxLevel }) => {
  const [seconds, setSeconds] = useState(null);
  const intervalRef = useRef(null);

  
  useEffect(() => {
    const handleReset = () => {
      setSeconds(0);
    };
    window.addEventListener('resetTimer', handleReset);
    return () => window.removeEventListener('resetTimer', handleReset);
  }, []);

  useEffect(() => {
    const fetchTimer = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/game/progress/getTime', {
          withCredentials: true,
        });
        setSeconds(res.data.timer || 0);
      } catch (err) {
        console.error('Error fetching timer:', err);
        setSeconds(0);
      }
    };
    fetchTimer();
  }, []);

  useEffect(() => {
    if (seconds === null) return;
    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      saveTimer();
    };
  }, [seconds]);

  useEffect(() => {
    if (seconds === null) return;
    const interval = setInterval(() => {
      saveTimer();
    }, 5000);
    return () => clearInterval(interval);
  }, [seconds]);

  useEffect(() => {
    if (seconds !== null && currentLevel !== 1) {
      saveTimer();
    }
  }, [currentLevel]);

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
    } catch (err) {
      console.error('Error saving timer:', err);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  if (seconds === null) return null;

  return (
   <div className="bg-white/90 backdrop-blur-lg px-4 py-2 rounded-2xl shadow text-green-700 text-[15px] font-semibold">
   ⏱ Time: {formatTime(seconds)}
   </div>

 );
};

export default Timer;
