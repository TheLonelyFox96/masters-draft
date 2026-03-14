import TeamLeaderboard from "../components/TeamLeaderboard";
import TopPlayerLeaderboard from "../components/TopPlayerLeaderboard";

function Home() {
  return (
    <>
    <h1 className="main-title">⛳ Leaderboards</h1>
    <TeamLeaderboard />
    <TopPlayerLeaderboard />
    </>
  )
}

export default Home;
