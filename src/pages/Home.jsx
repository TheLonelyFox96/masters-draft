import TeamLeaderboard from "../components/TeamLeaderboard";
import TopPlayerLeaderboard from "../components/TopPlayerLeaderboard";
import logo from "../assets/masters.webp";

function Home() {
  return (
    <>
    <img className="img" src={logo} />
    <h1 className="main-title">⛳ Leaderboards</h1>
    <TeamLeaderboard />
    <TopPlayerLeaderboard />
    </>
  )
}

export default Home;
