export function formatScore(score) {
  if (score === 0) return "E";
  if (score > 0) return `+${score}`;
  return `${score}`;
}

export function formatRound(score, missed, roundIndex) {
  if (score === null || score === undefined) return "—";
  if (missed && roundIndex >= 2) return "—";
  if (score === 0) return "E";
  if (score > 0) return `+${score}`;
  return `${score}`;
}

export function getPlayerTotal(player) {
  if (player?.missedCut) {
    const rounds = player?.rounds ?? [];
    const r0 = typeof rounds[0] === "number" ? rounds[0] : 0;
    const r1 = typeof rounds[1] === "number" ? rounds[1] : 0;
    return r0 + r1;
  }
  return player?.score ?? 0; // ← trust the API total directly
}

