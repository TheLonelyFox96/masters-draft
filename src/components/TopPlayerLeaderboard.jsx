import { data } from "../data/scores.js";
import "../css/TeamLeaderboard.css";
import { motion } from "framer-motion";

const formatScore = (score) => {
  if (score === 0) return "E";
  if (score > 0) return `+${score}`;
  return `${score}`;
};

const getTopPlayer = (participant, players) => {
  const pickedPlayers = participant.picks
    .map((pickId) => players.find((p) => p.id === pickId))
    .filter(Boolean)
    .sort((a, b) => a.score - b.score);

  return pickedPlayers[0];
};

function TopPlayersLeaderboard() {
  const { players, participants } = data;

  const ranked = [...participants]
    .map((p) => ({
      ...p,
      topPlayer: getTopPlayer(p, players),
    }))
    .sort((a, b) => a.topPlayer.score - b.topPlayer.score);

  return (
    <div className="top-players-wrapper">
      <h2 className="top-players-title">Players Leaderboard</h2>

      <div className="top-players">
        {/* Header Row */}
        <div className="top-players__header">
          <span>Participant</span>
          <span>Top Player</span>
          <span>Score</span>
        </div>

        {ranked.map((participant, index) => (
          <motion.div
            className="top-players__row"
            key={participant.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }} // ← stagger by index!
          >
            {/* Participant */}
            <div className="top-players__participant">
              <span
                className="top-players__position"
                style={{
                  color:
                    index === 0 ? "var(--color-gold)" : "var(--color-muted)",
                }}
              >
                {index + 1}
              </span>
              <img
                className="top-players__thumb"
                src={participant.thumbImg}
                alt={participant.name}
              />
              <span className="top-players__name">{participant.name}</span>
            </div>

            {/* Top Player */}
            <div className="top-players__player">
              <img
                className="top-players__thumb"
                src={participant.topPlayer.thumbImg}
                alt={participant.topPlayer.name}
              />
              <span className="top-players__name">
                {participant.topPlayer.name}
              </span>
            </div>

            {/* Score */}
            <span
              className={`top-players__score 
              ${
                participant.topPlayer.score < 0
                  ? "score--under"
                  : participant.topPlayer.score > 0
                    ? "score--over"
                    : "score--even"
              }`}
            >
              {formatScore(participant.topPlayer.score)}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default TopPlayersLeaderboard;
