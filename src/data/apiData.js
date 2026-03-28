import { playerImages } from "../data/playerImages";

const API_KEY = import.meta.env.VITE_GOLF_API_KEY;
const TOURNAMENT_ID = import.meta.env.VITE_TOURNAMENT_ID;
const CACHE_KEY = "golf_leaderboard_cache";
const CACHE_DURATION = 15 * 60 * 1000;

console.log("[v0] API_KEY exists:", !!API_KEY);
console.log("[v0] TOURNAMENT_ID:", TOURNAMENT_ID);

// 🌐 Fetch + cache leaderboard data
export async function fetchLeaderboard(force = false) {
  console.log("[v0] fetchLeaderboard called, force:", force);
    const cached = localStorage.getItem(CACHE_KEY);
    if (!force && cached) { // 👈 skip cache if forced
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION && Array.isArray(data)) {
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

  localStorage.setItem(CACHE_KEY, JSON.stringify({
    timestamp: Date.now(),
    data: json.Players, // 👈 store array only
  }));

  console.log("🌐 Fresh data fetched");
  return json.Players; // 👈 return array only
}

const calcHoleToPar = (hole) => {
  if (hole.ToPar !== null && hole.ToPar !== undefined) {
    if (hole.ToPar !== 0 || hole.IsPar === true) return hole.ToPar;
  }

  // 🔁 Fallback: flag-based calculation
  if (hole.DoubleEagle) return -3;
  if (hole.Eagle) return -2;
  if (hole.Birdie) return -1;
  if (hole.Bogey) return 1;
  if (hole.DoubleBogey) return 2;
  if (hole.WorseThanDoubleBogey) return 3;
  return 0;
};


export function mapPlayers(apiResponse) {
  return apiResponse.map((player) => ({
    id: player.PlayerID,
    name: player.Name,
    score: player.TotalScore ?? 0,
    missedCut: player.MadeCut === 0,
    rounds: [0, 1, 2, 3].map((i) => {
      const r = player.Rounds.find((r) => r.Number === i + 1);
      if (!r || r.Holes.length === 0) return null;
      return r.Holes.reduce((total, hole) => total + calcHoleToPar(hole), 0); // 👈 use flags
    }),
    thumbImg: playerImages[player.PlayerID] ?? "/images/default.png",
  }));
}

// ⏱️ Check if tournament is currently live
export function isTournamentLive(apiResponse) {
  return apiResponse.some(
    (player) => player.TotalThrough !== null && player.TotalThrough < 18
  );
}
