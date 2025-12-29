import React, { createContext, useState, useContext, useRef, useEffect, useCallback } from "react";
import { AppState, AppStateStatus } from "react-native";
import { getCrashPoint } from "../utils/getCrashPoint";
import Sound from "react-native-sound";
import { useSound } from "../context/SoundContext";

type GameStatus = "IDLE" | "COUNTDOWN" | "RUNNING" | "CRASHED";

type GameState = {
  status: GameStatus;
  crashPoint: number;
  countdown: number;
  history: string[]; // <--- ADD THIS

  getCurrentMultiplier: () => number;
  startGame: () => void;
};

const GameContext = createContext<GameState | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<GameStatus>("IDLE");
  const [countdown, setCountdown] = useState(0);
  const [crashPoint, setCrashPoint] = useState(2.00);
  const [history, setHistory] = useState<string[]>([]);

  const multiplierRef = useRef(1.00);
  const startTimeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const crashPointRef = useRef(2.00);

  const { soundEnabled } = useSound();

  const playStartSound = () => {
    if (!soundEnabled) return;
    const s = new Sound("startingplane.mp3", Sound.MAIN_BUNDLE, (e) => {
      if (!e) s.play(() => s.release());
    });
  };

  const playCrashSound = () => {
    if (!soundEnabled) return;
    const s = new Sound("flewaway1.mp3", Sound.MAIN_BUNDLE, (e) => {
      if (!e) s.play(() => s.release());
    });
  };

  const getGrowthSpeed = (currentMultiplier: number) => {
    if (currentMultiplier < 6) return 0.06;
    if (currentMultiplier < 10) return 0.10;
    if (currentMultiplier < 18) return 0.18;
    if (currentMultiplier < 28) return 0.28;
    if (currentMultiplier < 45) return 0.45;
    if (currentMultiplier < 70) return 0.70;
    return 1.2;
  };

  const gameTick = () => {
    const now = Date.now();
    const dt = (now - lastFrameTimeRef.current) / 1000;
    lastFrameTimeRef.current = now;

    const current = multiplierRef.current;
    const speed = getGrowthSpeed(current);

    const next = current + (current * speed * dt);
    multiplierRef.current = next;

    if (next >= crashPointRef.current) {
      handleCrash(next);
      return;
    }

    rafIdRef.current = requestAnimationFrame(gameTick);
  };

  const handleCrash = (finalVal: number) => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    multiplierRef.current = finalVal;
    setStatus("CRASHED");

    playCrashSound();
    const formattedCrash = finalVal.toFixed(2);
    setHistory((prev) => [formattedCrash, ...prev]);
    
    setTimeout(() => {
      startCountdown();
    }, 3000);
  };

  const startCountdown = () => {
    setStatus("COUNTDOWN");
    setCountdown(5);

    let count = 5;
    const interval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        startGameLogic();
      }
    }, 1000);
  };

  const startGameLogic = () => {
    const newCrashPoint = getCrashPoint({ totalBetAmount: 1000, cashouttotal: 0 });
    setCrashPoint(newCrashPoint);
    crashPointRef.current = newCrashPoint;

    multiplierRef.current = 1.00;
    startTimeRef.current = Date.now();
    lastFrameTimeRef.current = Date.now();

    setStatus("RUNNING");
    playStartSound();

    gameTick();
  };

  useEffect(() => {
    startCountdown();

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const getCurrentMultiplier = useCallback(() => {
    return multiplierRef.current;
  }, []);

  const value: GameState = {
    status,
    crashPoint,
    countdown,
    history, // <--- ADD THIS
    getCurrentMultiplier,
    startGame: startCountdown,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used inside GameProvider");
  return context;
};