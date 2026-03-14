import './css/App.css'
import Home from './pages/Home';
import { Routes, Route } from 'react-router-dom';
import PlayersScores from './pages/PlayersScore';
import NavBar from './components/NavBar';

function App() {
  return (
    <div>
      <NavBar />
    <main className='main-content'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/playersscores" element={<PlayersScores />} />
      </Routes>
    </main>
    </div>
  );
}

export default App;
