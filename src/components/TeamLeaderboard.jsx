import { animated as _animated, useSpring, useTrail } from "@react-spring/web";
import { useLayoutEffect, useRef, useState } from "react";
import useLeaderboardPlayers from "../hooks/useLeaderboardPlayers";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import { participants } from "../data/participants";
import { formatRound, formatScore, getPlayerTotal } from "../utils/scores";

// const getTeamScore = (participant, players) => {
//   return participant.picks.reduce((total, pickId) => {
//     const player = players.find((p) => p.id === pickId);
//     return total + (player ? player.score : 0);
//   }, 0);
// };

const getTeamScore = (participant, players) => {
  return participant.picks.reduce((total, pickId) => {
    const player = players.find((p) => p.id === pickId);
    return total + (player ? getPlayerTotal(player) : 0); // ← use getPlayerTotal instead of player.score
  }, 0);
};

function AccordionPanel({ open, panelId, reducedMotion, children }) {
  const innerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (!open) return;
    if (!innerRef.current) return;
    setHeight(innerRef.current.scrollHeight);
  }, [open, children]);

  const springStyle = useSpring({
    height: open ? height : 0,
    opacity: open ? 1 : 0,
    immediate: reducedMotion,
    config: { tension: 260, friction: 30 },
  });

  return (
    <_animated.div
      id={panelId}
      style={{
        ...springStyle,
        overflow: "hidden",
        pointerEvents: open ? "auto" : "none",
      }}
      role="region"
      aria-label="Picked players details"
    >
      <div ref={innerRef}>{children}</div>
    </_animated.div>
  );
}

export default function TeamLeaderboard() {
  const [openId, setOpenId] = useState(null);
  const { players, loading, error, lastUpdated } = useLeaderboardPlayers();
  const reducedMotion = usePrefersReducedMotion();

  const ranked = [...participants]
    .map((p) => ({
      ...p,
      totalScore: getTeamScore(p, players),
    }))
    .sort((a, b) => a.totalScore - b.totalScore);

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
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm sm:text-base font-semibold tracking-wide uppercase text-masters-green">
          Team Leaderboard
        </h2>
        {lastUpdated && (
          <p className="text-xs text-muted-page">
            Updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      <div className="rounded-xl border border-divider-line bg-card-surface shadow-card-surface overflow-hidden">
        {/* Header Row - Desktop */}
        <div className="hidden sm:grid grid-cols-[48px_1fr_80px_32px] items-center gap-4 px-5 py-3 bg-masters-green text-white text-xs uppercase tracking-wider font-medium">
          <div className="text-center">Pos</div>
          <div>Participant</div>
          <div className="text-right">Score</div>
          <div />
        </div>

        <div className="divide-y divide-divider-line">
          {ranked.map((participant, index) => {
            const isOpen = openId === participant.id;
            const panelId = `team-panel-${participant.id}`;
            const pickedPlayers = participant.picks
              .map((pickId) => players.find((p) => p.id === pickId))
              .filter(Boolean)
              .sort((a, b) => getPlayerTotal(a) - getPlayerTotal(b));

            const rowAnim = trail[index];
            const rowStyle = rowAnim
              ? {
                  opacity: rowAnim.opacity,
                  transform: rowAnim.x.to((x) => `translate3d(${x}px,0,0)`),
                }
              : undefined;

            const posClass = index === 0 ? "text-gold-rank font-bold" : "text-muted-page";
            const scoreClass =
              participant.totalScore < 0
                ? "text-under-score"
                : participant.totalScore > 0
                  ? "text-over-score"
                  : "text-even-score";

            return (
              <div key={participant.id} className="bg-row-surface">
                <_animated.button
                  type="button"
                  className="w-full grid grid-cols-[40px_1fr_auto_28px] sm:grid-cols-[48px_1fr_80px_32px] items-center gap-3 sm:gap-4 px-4 py-4 sm:px-5 sm:py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:bg-row-hover-surface transition-colors text-left"
                  style={rowStyle}
                  onClick={() => setOpenId(isOpen ? null : participant.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  {/* Position */}
                  <span className={`text-center text-sm font-semibold tabular-nums ${posClass}`}>
                    {index + 1}
                  </span>

                  {/* Participant info - image + name on same line */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-masters-green/30 flex-shrink-0"
                      src={participant.thumbImg}
                      alt={participant.name}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="text-sm sm:text-base font-medium text-name-page truncate">
                      {participant.name}
                    </span>
                  </div>

                  {/* Score */}
                  <span className={`text-right text-lg sm:text-xl font-bold tabular-nums ${scoreClass}`}>
                    {formatScore(participant.totalScore)}
                  </span>

                  {/* Chevron */}
                  <span className="text-muted-page text-xs text-center flex-shrink-0">
                    {isOpen ? "▲" : "▼"}
                  </span>
                </_animated.button>

                <AccordionPanel
                  open={isOpen}
                  panelId={panelId}
                  reducedMotion={reducedMotion}
                >
                  {isOpen ? (
                    <div className="px-4 py-5 sm:px-5 sm:py-6 bg-row-alt-surface border-t border-divider-line">
                      <div className="grid gap-3 sm:gap-4">
                        {pickedPlayers.map((player) => {
                          const total = getPlayerTotal(player);
                          const totalClass =
                            total < 0
                              ? "text-under-score"
                              : total > 0
                                ? "text-over-score"
                                : "text-even-score";

                          return (
                            <div
                              key={player.id}
                              className={`rounded-lg border border-divider-line bg-card-surface p-4 sm:p-5 shadow-sm ${
                                player.missedCut ? "opacity-60" : ""
                              }`}
                            >
                              {/* Player row - all on one line */}
                              <div className="flex items-center gap-3 sm:gap-4">
                                <img
                                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-masters-green/20 flex-shrink-0"
                                  src={player.thumbImg}
                                  alt={player.name}
                                  loading="lazy"
                                  decoding="async"
                                />
                                <div className="flex-1 min-w-0 flex items-center gap-2">
                                  <span className="text-sm font-medium text-name-page truncate">
                                    {player.name}
                                  </span>
                                  {player.missedCut && (
                                    <span className="inline-flex items-center rounded bg-under px-1.5 py-0.5 text-[10px] font-bold text-white flex-shrink-0">
                                      MC
                                    </span>
                                  )}
                                </div>

                                {/* Round scores - inline on desktop */}
                                <div className="hidden sm:flex items-center gap-2 text-xs text-muted-page tabular-nums">
                                  <span className="px-2.5 py-1.5 rounded bg-surface-muted">
                                    R1: {formatRound(player.rounds[0], player.missedCut, 0)}
                                  </span>
                                  <span className="px-2.5 py-1.5 rounded bg-surface-muted">
                                    R2: {formatRound(player.rounds[1], player.missedCut, 1)}
                                  </span>
                                  <span className="px-2.5 py-1.5 rounded bg-surface-muted">
                                    R3: {formatRound(player.rounds[2], player.missedCut, 2)}
                                  </span>
                                  <span className="px-2.5 py-1.5 rounded bg-surface-muted">
                                    R4: {formatRound(player.rounds[3], player.missedCut, 3)}
                                  </span>
                                </div>

                                <span className={`text-sm sm:text-base font-bold tabular-nums ${totalClass} flex-shrink-0`}>
                                  {formatScore(total)}
                                </span>
                              </div>

                              {/* Mobile round scores */}
                              <div className="sm:hidden mt-4 grid grid-cols-4 gap-2 text-center text-[11px] text-muted-page tabular-nums">
                                <div className="px-2 py-2 rounded bg-surface-muted">
                                  <div className="text-[9px] uppercase tracking-wide mb-1">R1</div>
                                  {formatRound(player.rounds[0], player.missedCut, 0)}
                                </div>
                                <div className="px-2 py-2 rounded bg-surface-muted">
                                  <div className="text-[9px] uppercase tracking-wide mb-1">R2</div>
                                  {formatRound(player.rounds[1], player.missedCut, 1)}
                                </div>
                                <div className="px-2 py-2 rounded bg-surface-muted">
                                  <div className="text-[9px] uppercase tracking-wide mb-1">R3</div>
                                  {formatRound(player.rounds[2], player.missedCut, 2)}
                                </div>
                                <div className="px-2 py-2 rounded bg-surface-muted">
                                  <div className="text-[9px] uppercase tracking-wide mb-1">R4</div>
                                  {formatRound(player.rounds[3], player.missedCut, 3)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </AccordionPanel>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
