import { data } from "../data/scores.js";
import { useState } from "react";
import "../css/TeamLeaderboard.css";
import { motion, AnimatePresence } from "framer-motion";

const formatScore = (score) => {
  if (score === 0) return "E";
  if (score > 0) return `+${score}`;
  return `${score}`;
};

const formatRound = (score, missed, roundIndex) => {
  if (missed && roundIndex >= 2) return "—";
  if (score === 0) return "E";
  if (score > 0) return `+${score}`;
  return `${score}`;
};

const getTeamScore = (participant, players) => {
  return participant.picks.reduce((total, pickId) => {
    const player = players.find((p) => p.id === pickId);
    return total + (player ? player.score : 0);
  }, 0);
};

const getPlayerTotal = (player) => {
  return player.missedCut
    ? player.rounds[0] + player.rounds[1]
    : player.rounds.reduce((a, b) => a + b, 0);
};

function TeamLeaderboard() {
  const { players, participants } = data;

  const [openId, setOpenId] = useState(null);

  const handleToggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const ranked = [...participants]
    .map((p) => ({
      ...p,
      totalScore: getTeamScore(p, players),
    }))
    .sort((a, b) => a.totalScore - b.totalScore);

  return (
    <div className="leaderboard-wrapper">
      <h2 className="leaderboard-title">Team Leaderboard</h2>

      <div className="leaderboard">
        <div className="leaderboard__header">
          <span>Pos</span>
          <span></span>
          <span>Participant</span>
          <span>Score</span>
        </div>

        {ranked.map((participant, index) => {
          const isOpen = openId === participant.id;

          const pickedPlayers = participant.picks
            .map((pickId) => players.find((p) => p.id === pickId))
            .filter(Boolean)
            .sort((a, b) => getPlayerTotal(a) - getPlayerTotal(b)); // ✅ consistent sort

          return (
            <div className="participant" key={participant.id}>
              {/* Leaderboard Row */}
              <motion.div
                className={`leaderboard__row ${isOpen ? "leaderboard__row--open" : ""}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleToggle(participant.id)}
              >
                <span
                  className="leaderboard__position"
                  style={{
                    color:
                      index === 0 ? "var(--color-gold)" : "var(--color-muted)",
                  }}
                >
                  {index + 1}
                </span>
                <img
                  className="leaderboard__thumb"
                  src={participant.thumbImg}
                  alt={participant.name}
                />
                <span className="leaderboard__name">{participant.name}</span>
                <span
                  className={`leaderboard__score ${
                    participant.totalScore < 0
                      ? "score--under"
                      : participant.totalScore > 0
                        ? "score--over"
                        : "score--even"
                  }`}
                >
                  {formatScore(participant.totalScore)}
                </span>
                <span className="leaderboard__chevron">
                  {isOpen ? "▲" : "▼"}
                </span>
              </motion.div>

              {/* Accordion Content */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <table className="scores-table">
                      <thead>
                        <tr>
                          <th>Player</th>
                          <th>R1</th>
                          <th>R2</th>
                          <th>R3</th>
                          <th>R4</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pickedPlayers.map((player) => {
                          // ✅ using pickedPlayers not re-mapping
                          console.log(player);
                          const total = getPlayerTotal(player); // ✅ reusing helper
                          return (
                            <tr
                              key={player.id}
                              className={
                                player.missedCut ? "row--missed-cut" : ""
                              }
                            >
                              <td>
                                <div className="scores-table__name">
                                  <img
                                    className="scores-table__thumb"
                                    src={player.thumbImg}
                                    alt={player.name}
                                  />
                                  {player.name}
                                  {player.missedCut && (
                                    <span className="badge--mc">MC</span>
                                  )}
                                </div>
                              </td>

                              <td>
                                {formatRound(
                                  player.rounds[0],
                                  player.missedCut,
                                  0,
                                )}
                              </td>
                              <td>
                                {formatRound(
                                  player.rounds[1],
                                  player.missedCut,
                                  1,
                                )}
                              </td>
                              <td>
                                {formatRound(
                                  player.rounds[2],
                                  player.missedCut,
                                  2,
                                )}
                              </td>
                              <td>
                                {formatRound(
                                  player.rounds[3],
                                  player.missedCut,
                                  3,
                                )}
                              </td>
                              <td
                                className={`scores-table__total ${
                                  total < 0
                                    ? "score--under"
                                    : total > 0
                                      ? "score--over"
                                      : "score--even"
                                }`}
                              >
                                {formatScore(total)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TeamLeaderboard;
