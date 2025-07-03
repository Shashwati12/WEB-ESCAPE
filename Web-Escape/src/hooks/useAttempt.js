import { useEffect, useState } from "react";
import axios from "axios";

export default function useAttempt(level) {
  const [attemptsLeft, setAttemptsLeft] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (!level) return;

    const fetchAttempts = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/game/progress`, {
          withCredentials: true,
        });
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
      const res = await axios.post(
        `http://localhost:3000/api/v1/game/level/${level}/attempt-used`,
        {},
        { withCredentials: true }
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
      const res = await axios.post(
        `http://localhost:3000/api/v1/game/level/${level}/retry`,
        {},
        { withCredentials: true }
      );
      setAttemptsLeft(res.data.newAttempts);
      setIsLocked(false);
    } catch (err) {
      console.error("Retry failed", err);
    } finally {
      setRetrying(false);
    }
  };

  return {
    attemptsLeft,
    isLocked,
    retrying,
    handleUseAttempt,
    handleRetry,
  };
}
