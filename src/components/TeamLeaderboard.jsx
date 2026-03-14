import { data } from '../data/scores.js'
import '../css/TeamLeaderboard.css'

const formatScore = (score) => {
  if (score === 0) return "E";
  if (score > 0) return `+${score}`;
  return `${score}`;
};

const getTeamScore = (participant, players) => {
  return participant.picks.reduce((total, pickId) => {
    const player = players.find(p => p.id === pickId);
    return total + (player ? player.score : 0);
  }, 0);
};

function TeamLeaderboard() {
  const { players, participants } = data;

  const ranked = [...participants]
    .map(p => ({
      ...p,
      totalScore: getTeamScore(p, players)
    }))
    .sort((a, b) => a.totalScore - b.totalScore);

  return (
    <div className="leaderboard-wrapper">
      <h2 className="leaderboard-title">Team Leaderboard</h2>

      <div className="leaderboard">
        {ranked.map((participant, index) => (
          <div className="leaderboard__row" key={participant.id}>
            <span className="leaderboard__position">{index + 1}</span>
            <img
              className="leaderboard__thumb"
              src={participant.thumbImg}
              alt={participant.name}
            />
            <span className="leaderboard__name">{participant.name}</span>
            <span className={`leaderboard__score ${participant.totalScore < 0 ? 'score--under' : participant.totalScore > 0 ? 'score--over' : 'score--even'}`}>
              {formatScore(participant.totalScore)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamLeaderboard;
