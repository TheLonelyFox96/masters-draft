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
  const rounds = player?.rounds ?? [];

  // Missed cut players only have meaningful scores for the first two rounds.
  if (player?.missedCut) {
    const r0 = typeof rounds[0] === "number" ? rounds[0] : 0;
    const r1 = typeof rounds[1] === "number" ? rounds[1] : 0;
    return r0 + r1;
  }

  return rounds.reduce((acc, v) => {
    return acc + (typeof v === "number" ? v : 0);
  }, 0);
}

