import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartGame from './components/StartGame';
import JoinGame from './components/JoinGame';
import Home from './components/Home';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/start-game" element={<StartGame />}></Route>
        <Route path="/join-game" element={<JoinGame />}></Route>
      </Routes>
    </Router>
  )
}

export default App
