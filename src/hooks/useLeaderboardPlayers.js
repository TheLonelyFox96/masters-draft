import { useEffect, useRef, useState } from "react";
import {
  fetchLeaderboard,
  mapPlayers,
  isTournamentLive,
} from "../data/apiData";

const POLL_MS = 5 * 60 * 1000;

/**
 * Fetches leaderboard players (with localStorage caching inside `fetchLeaderboard`)
 * and optionally polls while the tournament is live.
 */
export default function useLeaderboardPlayers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    let intervalId = null;

    const loadData = async (force = false) => {
      console.log("[v0] loadData called, force:", force);
      try {
        const raw = await fetchLeaderboard(force);
        console.log("[v0] fetchLeaderboard returned:", raw?.length, "players");
        if (!isMountedRef.current) return false;

        const mapped = mapPlayers(raw);
        console.log("[v0] mapPlayers returned:", mapped?.length, "players");
        setPlayers(mapped);
        setLastUpdated(new Date());
        setError(null);

        return isTournamentLive(raw);
      } catch (err) {
        console.error("[v0] Failed to fetch leaderboard", err);
        if (!isMountedRef.current) return false;
        setError("Failed to load leaderboard. Please try again.");
        return false;
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    };

    const init = async () => {
      const isLive = await loadData(false);
      if (!isLive) return;

      intervalId = setInterval(async () => {
        const stillLive = await loadData(true);
        if (!stillLive && intervalId) clearInterval(intervalId);
      }, POLL_MS);
    };

    init();

    return () => {
      isMountedRef.current = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return { players, loading, error, lastUpdated };
}

