import { animated as _animated, useTrail } from "@react-spring/web";
import { useMemo } from "react";
import useLeaderboardPlayers from "../hooks/useLeaderboardPlayers";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { participants } from "../data/participants";
import { formatScore } from "../utils/scores";

const getTopPlayer = (participant, players) => {
  const pickedPlayers = participant.picks
    .map((pickId) => players.find((p) => p.id === pickId))
    .filter(Boolean)
    .sort((a, b) => a.score - b.score);

  return (
    pickedPlayers[0] ?? {
      id: `missing-${participant.id}`,
      name: "—",
      thumbImg: "/images/default.png",
      score: 0,
    }
  );
};

export default function TopPlayerLeaderboard() {
  const { players, loading, error } = useLeaderboardPlayers();
  const reducedMotion = usePrefersReducedMotion();

  const ranked = useMemo(() => {
    return [...participants]
      .map((p) => ({
        ...p,
        topPlayer: getTopPlayer(p, players),
      }))
      .sort((a, b) => a.topPlayer.score - b.topPlayer.score);
  }, [players]);

  const trail = useTrail(ranked.length, {
    from: { opacity: 0, x: -20 },
    to: { opacity: 1, x: 0 },
    config: { tension: 260, friction: 30 },
    immediate: reducedMotion,
  });

  if (loading)
    return (
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="rounded-xl border border-divider-line bg-card-surface shadow-card-surface p-8">
          <p className="text-muted-page">Loading...</p>
        </div>
      </section>
    );

  if (error)
    return (
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="rounded-xl border border-divider-line bg-card-surface shadow-card-surface p-8">
          <p className="text-under-score">{error}</p>
        </div>
      </section>
    );

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-12">
      <h2 className="text-sm sm:text-base font-semibold tracking-wide uppercase text-masters-green mb-5">
        Top Player Leaderboard
      </h2>

      <div className="rounded-xl border border-divider-line bg-card-surface shadow-card-surface overflow-hidden">
        {/* Header Row - Desktop */}
        <div className="hidden sm:grid grid-cols-[48px_1fr_1fr_80px] items-center gap-4 px-5 py-3 bg-masters-green text-white text-xs uppercase tracking-wider font-medium">
          <div className="text-center">Pos</div>
          <div>Participant</div>
          <div>Top Player</div>
          <div className="text-right">Score</div>
        </div>

        <div className="divide-y divide-divider-line">
          {ranked.map((participant, index) => {
            const rowAnim = trail[index];
            const rowStyle = rowAnim
              ? {
                  opacity: rowAnim.opacity,
                  transform: rowAnim.x.to((x) => `translate3d(${x}px,0,0)`),
                }
              : undefined;

            const score = participant.topPlayer.score;
            const scoreClass =
              score < 0 ? "text-under-score" : score > 0 ? "text-over-score" : "text-even-score";
            const posClass = index === 0 ? "text-gold-rank font-bold" : "text-muted-page";

            return (
              <_animated.div
                key={participant.id}
                style={rowStyle}
                className="bg-row-surface hover:bg-row-hover-surface transition-colors"
              >
                {/* Desktop Layout */}
                <div className="hidden sm:grid grid-cols-[48px_1fr_1fr_80px] items-center gap-4 px-5 py-5">
                  {/* Position */}
                  <span className={`text-center text-sm font-semibold tabular-nums ${posClass}`}>
                    {index + 1}
                  </span>

                  {/* Participant */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      className="w-11 h-11 rounded-full object-cover border-2 border-masters-green/30 flex-shrink-0"
                      src={participant.thumbImg}
                      alt={participant.name}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="text-base font-medium text-name-page truncate">
                      {participant.name}
                    </span>
                  </div>

                  {/* Top Player */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      className="w-11 h-11 rounded-full object-cover border-2 border-masters-green/30 flex-shrink-0"
                      src={participant.topPlayer.thumbImg}
                      alt={participant.topPlayer.name}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="text-base font-medium text-name-page truncate">
                      {participant.topPlayer.name}
                    </span>
                  </div>

                  {/* Score */}
                  <span className={`text-right text-xl font-bold tabular-nums ${scoreClass}`}>
                    {formatScore(score)}
                  </span>
                </div>

                {/* Mobile Layout - All on one line */}
                <div className="sm:hidden flex items-center gap-3 px-4 py-4">
                  {/* Position */}
                  <span className={`text-sm font-semibold tabular-nums w-7 text-center flex-shrink-0 ${posClass}`}>
                    {index + 1}
                  </span>

                  {/* Participant + Top Player stacked */}
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    {/* Overlapping avatars */}
                    <div className="flex -space-x-2 flex-shrink-0">
                      <img
                        className="w-9 h-9 rounded-full object-cover border-2 border-card-surface z-10"
                        src={participant.thumbImg}
                        alt={participant.name}
                        loading="lazy"
                        decoding="async"
                      />
                      <img
                        className="w-9 h-9 rounded-full object-cover border-2 border-card-surface"
                        src={participant.topPlayer.thumbImg}
                        alt={participant.topPlayer.name}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    {/* Names stacked */}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-name-page truncate">
                        {participant.name}
                      </div>
                      <div className="text-xs text-muted-page truncate">
                        {participant.topPlayer.name}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <span className={`text-lg font-bold tabular-nums flex-shrink-0 ${scoreClass}`}>
                    {formatScore(score)}
                  </span>
                </div>
              </_animated.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
