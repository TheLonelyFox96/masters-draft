import PlayersScores from "../components/PlayersScores";
import { motion } from "framer-motion";
function PlayersScore() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="main-title">⛳ Players Scores</h1>
        <PlayersScores />
      </motion.div>
    </>
  );
}

export default PlayersScore;
