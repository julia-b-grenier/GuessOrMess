import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <h1>GUESS OR MESS</h1>
      <div>
        <Link to="/start-game">
          <button>Start Game</button>
        </Link>
        <Link to="/join-game">
          <button>Join Game</button>
        </Link>
      </div>
    </>
  );
}

export default Home;
