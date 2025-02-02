import Cookies from 'js-cookie';  // Make sure to import js-cookie
import WaitingArea from '../components/WaitingArea';

const JoinGame = () => {
  // Get values from cookies when the component mounts
  const storedUsername = Cookies.get('username');
  
  return (
    <div>
      <h2>
        Welcome to the Join Game Page {storedUsername}
      </h2>
      <WaitingArea />
    </div>
  );
};

export default JoinGame;
