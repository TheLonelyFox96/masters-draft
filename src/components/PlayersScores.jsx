import { useState } from "react";
import { data } from "../data/scores.js";
import "../css/PlayersScores.css";
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

function PlayersScores() {
  const { players, participants } = data;
  const [openId, setOpenId] = useState(participants.map((p) => p.id));

  const handleToggle = (id) => {
    setOpenId(
      openId.includes(id)
        ? openId.filter((openId) => openId !== id) // already open → remove it
        : [...openId, id],
    );
  };

  return (
    <div className="leaderboard-wrapper">
      <h2 className="leaderboard-subtitle">Player Scores</h2>

      {participants.map((participant) => {
        const getPlayerTotal = (player) => {
          return player.missedCut
            ? player.rounds[0] + player.rounds[1]
            : player.rounds.reduce((a, b) => a + b, 0);
        };

        const pickedPlayers = participant.picks
          .map((pickId) => players.find((p) => p.id === pickId))
          .filter(Boolean)
          .sort((a, b) => getPlayerTotal(a) - getPlayerTotal(b)); // ✅

        const isOpen = openId.includes(participant.id);

        return (
          <div className="accordion" key={participant.id}>
            {/* Header */}
            <div
              className={`accordion__header ${isOpen ? "accordion__header--open" : ""}`}
              onClick={() => handleToggle(participant.id)}
            >
              <div className="accordion__participant">
                <img
                  className="accordion__thumb"
                  src={participant.thumbImg}
                  alt={participant.name}
                />
                <span className="accordion__name">{participant.name}</span>
              </div>
              <span className="accordion__chevron">{isOpen ? "▲" : "▼"}</span>
            </div>

            {/* Content */}
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
                        const total = player.missedCut
                          ? player.rounds[0] + player.rounds[1]
                          : player.rounds.reduce((a, b) => a + b, 0);

                        return (
                          <tr
                            key={player.id}
                            className={
                              player.missedCut ? "row--missed-cut" : ""
                            }
                          >
                            <td className="scores-table__name">
                              <img
                                className="scores-table__thumb"
                                src={player.thumbImg}
                                alt={player.name}
                              />
                              {player.name}
                              {player.missedCut && (
                                <span className="badge--mc">MC</span>
                              )}
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
                              className={`scores-table__total ${total < 0 ? "score--under" : total > 0 ? "score--over" : "score--even"}`}
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
  );
}

export default PlayersScores;
