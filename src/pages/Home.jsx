import TeamLeaderboard from "../components/TeamLeaderboard";
import TopPlayerLeaderboard from "../components/TopPlayerLeaderboard";
import logo from "../assets/masters.webp";
import { motion } from "framer-motion";

function Home() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <img className="img" src={logo} />
        <h1 className="main-title">⛳ LEADERBOARDS</h1>
        <TeamLeaderboard />
        <TopPlayerLeaderboard />
      </motion.div>
    </>
  );
}

export default Home;
