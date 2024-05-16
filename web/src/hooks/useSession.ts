import { getSession, getSessions } from "@/lib/api";
import { Session } from "@/lib/session";
import { useCallback, useEffect, useRef, useState } from "react";

const POLLING_INTERVAL = 1000;

function useInterval<T extends () => void>(callback: T, delay: number) {
  if (delay <= 0) {
    throw new Error("Delay must be positive");
  }

  const savedCallback = useRef<T>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

export function useSession(sessionId: string): Session | null {
  const [session, setSession] = useState<Session | null>(null);

  const fetchSession = useCallback(async () => {
    const session = await getSession(sessionId);
    setSession(session);
  }, [sessionId]);

  useInterval(fetchSession, POLLING_INTERVAL);

  return session;
}

export function useSessions(): Session[] {
  const [sessions, setSessions] = useState<Session[]>([]);

  const fetchSessions = useCallback(async () => {
    const sessions = await getSessions();
    setSessions(sessions);
  }, []);

  useInterval(fetchSessions, POLLING_INTERVAL);

  return sessions;
}
