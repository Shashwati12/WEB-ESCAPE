
import React, { useEffect, useState, useRef } from 'react';
import api from '../api/axios';

const Timer = ({ currentLevel, maxLevel }) => {
  const [seconds, setSeconds] = useState(null);
  const intervalRef = useRef(null);


  useEffect(() => {
    const handleReset = async () => {
      setSeconds(0);
      // Save the reset timer value to backend immediately
      try {
        await api.patch('/game/progress/time', { timer: 0 });
      } catch (err) {
        console.error('Error resetting timer:', err);
      }
    };
    window.addEventListener('resetTimer', handleReset);
    return () => window.removeEventListener('resetTimer', handleReset);
  }, []);

  useEffect(() => {
    const fetchTimer = async () => {
      try {
        const res = await api.get('/game/progress/getTime');
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
      saveTimer(seconds);
    };
  }, [seconds]);

  useEffect(() => {
    if (seconds === null) return;
    const interval = setInterval(() => {
      saveTimer(seconds);
    }, 5000);
    return () => clearInterval(interval);
  }, [seconds]);

  useEffect(() => {
    if (seconds !== null && currentLevel !== 1) {
      saveTimer(seconds);
    }
  }, [currentLevel]);

  useEffect(() => {
    if (currentLevel > maxLevel) {
      clearInterval(intervalRef.current);
      saveTimer(seconds);
    }
  }, [currentLevel, maxLevel]);

  const saveTimer = async (timerValue = seconds) => {
    try {
      await api.patch(
        '/game/progress/time',
        { timer: timerValue }
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
