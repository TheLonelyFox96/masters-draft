import { playerImages } from "../data/playerImages";

const API_KEY = import.meta.env.VITE_GOLF_API_KEY;
const TOURNAMENT_ID = import.meta.env.VITE_TOURNAMENT_ID;

const CACHE_KEY = "golf_leaderboard_cache";
const CACHE_DURATION_LIVE = 5 * 60 * 1000;       // 5 mins when live
const CACHE_DURATION_PRE = 60 * 60 * 1000;        // 1 hour before tournament

// Thursday 9th April 2025, midnight BST = 23:00 UTC on the 8th
const TOURNAMENT_START = new Date("2025-04-08T23:00:00Z");

console.log("[v0] API_KEY exists:", !!API_KEY);
console.log("[v0] TOURNAMENT_ID:", TOURNAMENT_ID);

// ✅ Has the tournament started yet?
function hasTournamentStarted() {
  return new Date() >= TOURNAMENT_START;
}

// 🌐 Fetch + cache leaderboard data
export async function fetchLeaderboard(force = false) {
  console.log("[v0] fetchLeaderboard called, force:", force);

  // 🚫 Block API calls before tournament starts
  if (!hasTournamentStarted() && !force) {
    console.log("⏳ Tournament hasn't started yet — skipping API fetch");
    return [];
  }

  const cacheDuration = CACHE_DURATION_LIVE;

  const cached = localStorage.getItem(CACHE_KEY);
  if (!force && cached) {
    const { timestamp, data } = JSON.parse(cached);
    if (Date.now() - timestamp < cacheDuration && Array.isArray(data)) {
      console.log("📦 Using cached data");
      return data;
    } else {
      localStorage.removeItem(CACHE_KEY);
    }
  }

  const url = `https://api.sportsdata.io/golf/v2/json/LeaderboardBasic/${TOURNAMENT_ID}?key=${API_KEY}`;
  console.log("[v0] Fetching URL:", url);

  const res = await fetch(url);
  console.log("[v0] Response status:", res.status);

  if (!res.ok) {
    const text = await res.text();
    console.log("[v0] Error response body:", text);
    throw new Error(`API error: ${res.status}`);
  }

  const json = await res.json();

  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      timestamp: Date.now(),
      data: json.Players,
    })
  );

  console.log("🌐 Fresh data fetched");
  return json.Players;
}

// ⏱️ Start polling every 5 minutes once tournament is live
// Returns a cleanup function — call it to stop polling (e.g. on component unmount)
export function startPolling(onData, onError) {
  if (!hasTournamentStarted()) {
    console.log("⏳ Polling skipped — tournament hasn't started yet");

    // Schedule a one-time delayed start for when the tournament begins
    const msUntilStart = TOURNAMENT_START.getTime() - Date.now();
    console.log(`⏰ Will begin polling in ${Math.round(msUntilStart / 1000 / 60)} minutes`);

    const startTimeout = setTimeout(() => {
      console.log("🏌️ Tournament started — beginning poll");
      pollNow();
      intervalId = setInterval(pollNow, CACHE_DURATION_LIVE);
    }, msUntilStart);

    return () => clearTimeout(startTimeout);
  }

  let intervalId;

  async function pollNow() {
    try {
      const data = await fetchLeaderboard();
      if (data.length > 0) onData(mapPlayers(data));
    } catch (err) {
      console.error("❌ Poll failed:", err);
      if (onError) onError(err);
    }
  }

  // Fetch immediately, then every 5 minutes
  pollNow();
  intervalId = setInterval(pollNow, CACHE_DURATION_LIVE);

  // Return cleanup
  return () => clearInterval(intervalId);
}

// 🧮 Calculate a hole's score relative to par
const calcHoleToPar = (hole) => {
  if (hole.ToPar !== null && hole.ToPar !== undefined) {
    if (hole.ToPar !== 0 || hole.IsPar === true) return hole.ToPar;
  }

  if (hole.DoubleEagle) return -3;
  if (hole.Eagle) return -2;
  if (hole.Birdie) return -1;
  if (hole.Bogey) return 1;
  if (hole.DoubleBogey) return 2;
  if (hole.WorseThanDoubleBogey) return 3;
  return 0;
};

// 🏌️ Map raw API players to your app's shape
export function mapPlayers(apiResponse) {
  return apiResponse.map((player) => ({
    id: player.PlayerID,
    name: player.Name,
    score: player.TotalScore ?? 0,
    missedCut: player.MadeCut === 0,
    rounds: [0, 1, 2, 3].map((i) => {
      const r = player.Rounds.find((r) => r.Number === i + 1);
      if (!r || r.Holes.length === 0) return null;
      return r.Holes.reduce((total, hole) => total + calcHoleToPar(hole), 0);
    }),
    thumbImg: playerImages[player.PlayerID] ?? "/images/default.png",
  }));
}

// ⛳ Check if tournament is currently live
export function isTournamentLive(apiResponse) {
  return apiResponse.some(
    (player) => player.TotalThrough !== null && player.TotalThrough < 18
  );
}