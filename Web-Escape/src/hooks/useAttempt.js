import { useEffect, useState } from "react";
import api from "../api/axios";
import useGameStore from "../state/gameStore";

export default function useAttempt(level) {
  const [attemptsLeft, setAttemptsLeft] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (!level) return;

    const fetchAttempts = async () => {
      try {
        const res = await api.get(`/game/progress`);
        const levelAttempt = res.data.levelAttempts.find(
          (lvl) => lvl.levelNumber === level
        );
        setAttemptsLeft(levelAttempt?.attemptsLeft ?? 0);
        if (levelAttempt?.attemptsLeft <= 0) setIsLocked(true);
      } catch (err) {
        console.error("Failed to fetch attempts", err);
      }
    };

    fetchAttempts();
  }, [level]);

  const handleUseAttempt = async () => {
    try {
      const res = await api.post(
        `/game/level/${level}/attempt-used`,
        {}
      );
      setAttemptsLeft(res.data.attemptsLeft);
      if (res.data.attemptsLeft <= 0) setIsLocked(true);
    } catch (err) {
      console.error("Failed to use attempt", err);
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    try {
      const res = await api.post(
        `/game/level/${level}/retry`,
        {}
      );
      setAttemptsLeft(res.data.newAttempts);
      setIsLocked(false);
      window.dispatchEvent(new Event('scoreUpdated'));


    } catch (err) {
      console.error("Retry failed", err);
    } finally {
      setRetrying(false);
    }
  };
  const updateAttempts = (val) => setAttemptsLeft(val);
  return {
    attemptsLeft,
    isLocked,
    retrying,
    handleUseAttempt,
    handleRetry,
    updateAttempts
  };
}
