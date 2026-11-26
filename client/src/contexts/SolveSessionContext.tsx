import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { MotionBurst } from "../vision/motion";

export interface AnnotatedBurst extends MotionBurst {
  move?: string;
}

export interface SolveSession {
  file: File | null;
  videoUrl: string | null;
  durationSeconds: number;
  startSeconds: number;
  endSeconds: number;
  scramble: string;
  scanInspection: boolean;
  confirmsSingleCube: boolean;
  bursts: AnnotatedBurst[];
  sampledFrames: number;
}

interface SolveSessionContextValue {
  session: SolveSession;
  chooseFile: (file: File | null) => void;
  updateSession: (updates: Partial<SolveSession>) => void;
  setBursts: (bursts: MotionBurst[], sampledFrames: number) => void;
}

const initialSession: SolveSession = {
  file: null,
  videoUrl: null,
  durationSeconds: 0,
  startSeconds: 0,
  endSeconds: 0,
  scramble: "",
  scanInspection: false,
  confirmsSingleCube: false,
  bursts: [],
  sampledFrames: 0,
};

const SolveSessionContext = createContext<SolveSessionContextValue | null>(null);

export function SolveSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SolveSession>(initialSession);

  useEffect(() => {
    const videoUrl = session.videoUrl;
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [session.videoUrl]);

  const chooseFile = (file: File | null) => {
    const videoUrl = file ? URL.createObjectURL(file) : null;
    setSession({ ...initialSession, file, videoUrl });
  };

  const updateSession = (updates: Partial<SolveSession>) => {
    setSession(current => ({ ...current, ...updates }));
  };

  const setBursts = (bursts: MotionBurst[], sampledFrames: number) => {
    setSession(current => ({
      ...current,
      bursts: bursts.map(burst => ({ ...burst })),
      sampledFrames,
    }));
  };

  return <SolveSessionContext.Provider value={{ session, chooseFile, updateSession, setBursts }}>{children}</SolveSessionContext.Provider>;
}

export function useSolveSession() {
  const value = useContext(SolveSessionContext);
  if (!value) throw new Error("useSolveSession must be used within SolveSessionProvider");
  return value;
}
