import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartGame from './pages/StartGame';
import JoinGame from './pages/JoinGame';
import Lobby from './pages/Lobby';
import Home from './pages/Home';
import Gameplay from './pages/Gameplay';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start-game" element={<StartGame />} />
        <Route path="/gameplay/:deckId" element={<Gameplay />} /> 
        <Route path="/join-game" element={<JoinGame />} />
        <Route path="/lobby/:gameCode" element={<Lobby />} />
      </Routes>
    </Router>
  );
}

export default App;
