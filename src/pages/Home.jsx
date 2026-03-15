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
        <p className="main-title">
          ⛳ The Diamond Dogs (minus Nate) are back with the 2026 Masters Draft.
          After a disappointing 2025 where Josh choked a 6 shot lead & Evan
          claimed the title, can anyone save this competition from shame...
        </p>
        <TeamLeaderboard />
        <TopPlayerLeaderboard />
      </motion.div>
    </>
  );
}

export default Home;
