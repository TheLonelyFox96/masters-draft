import "./css/App.css";
import Home from "./pages/Home";
import { AnimatePresence } from "framer-motion";
import { Routes, Route } from "react-router-dom";
import PlayersScore from "./pages/PlayersScore";
import NavBar from "./components/NavBar";

function App() {
  return (
    <AnimatePresence mode="wait">
      <div>
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playersscores" element={<PlayersScore />} />
          </Routes>
        </main>
      </div>
    </AnimatePresence>
  );
}

export default App;
