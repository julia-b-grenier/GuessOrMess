import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartGame from './pages/StartGame';
import JoinGame from './pages/JoinGame';
import Lobby from './pages/Lobby';
import Home from './pages/Home';
import Leaderboard from './components/Leaderboard';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start-game" element={<StartGame />}></Route>
        <Route path="/join-game" element={<JoinGame />}></Route>
        <Route path="/lobby/:gameCode" element={<Lobby />}></Route>
        <Route path="/leaderboard" element={<Leaderboard />}></Route>
      </Routes>
    </Router>
  )
}

export default App
