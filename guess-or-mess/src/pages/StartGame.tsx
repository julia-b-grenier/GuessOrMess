import * as cheerio from 'cheerio';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';  // Make sure to import js-cookie

export class FileSelector extends React.Component<{}, { fileContent: string }> {
    constructor(props: {}) {
        super(props);
        this.state = { fileContent: '' };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            this.setState({ fileContent: content });
            const parsedData = parseAnkiDeck(content);
            console.log(parsedData); 
        };
        reader.readAsText(file);
    }

    render() {
        return (
            <div>
                <input type="file" onChange={this.handleChange} />
            </div>
        );
    }
}

const parseAnkiDeck = (deckData: string) => {
    const pairs: { question: string; answer: string }[] = [];
    const lines = deckData.split('\n').filter(line => line.trim() !== '');

    lines.forEach(line => {
        const [question, answerHTML] = line.split('\t');
        const $ = cheerio.load(answerHTML);
        const answer = $('span').text().trim() || answerHTML; 
        pairs.push({ question: question.trim(), answer });
    });

    return pairs;
};


function StartGame() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Get values from cookies when the component mounts
    const storedGameId = Cookies.get('newGameId');
    const storedUsername = Cookies.get('username');

    setGameId(storedGameId || null);
    setUsername(storedUsername || null);
  }, []);  // Empty dependency array ensures this effect runs only once on mount

  return (
    <div>
      <h2>Welcome to Start Game Page</h2>
      {gameId && username ? (
        <>
          <p>Game ID: {gameId}</p>
          <p>Username: {username}</p>
        </>
      ) : (
        <p>Game and username are not available.</p>
      )}
      <p>Game will begin soon!</p>
    </div>
  );
}

export default StartGame;
