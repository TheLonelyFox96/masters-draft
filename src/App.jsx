import "./css/App.css";
import Home from "./pages/Home";
import { AnimatePresence } from "framer-motion";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";

function App() {
  return (
    <AnimatePresence mode="wait">
      <div>
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </AnimatePresence>
  );
}

export default App;
