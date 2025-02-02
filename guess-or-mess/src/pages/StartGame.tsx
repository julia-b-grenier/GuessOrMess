import * as cheerio from "cheerio";
import * as React from "react";
import { Card } from "../types/game";
import { createDeck } from "../firebase/firestore";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

interface FileState {
  fileContent: string;
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

export class FileSelector extends React.Component<{ onDeckCreated: (deckId: string) => void }, FileState> {
  constructor(props: { onDeckCreated: (deckId: string) => void }) {
    super(props);
    this.state = {
      fileContent: "",
      isLoading: false,
      error: null,
      success: null,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  async uploadDeckToFirebase(cards: Card[], filename: string) {
    this.setState({ isLoading: true, error: null, success: null });

    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);

    try {
      const deckId = await createDeck(shuffledCards, filename.replace(".txt", ""));
      this.setState({
        isLoading: false,
        success: `Deck successfully created with ID: ${deckId}`,
      });

      // Notify parent component (StartGame) about deck creation
      this.props.onDeckCreated(deckId);
    } catch (error) {
      this.setState({
        isLoading: false,
        error: "Failed to create deck. Please try again.",
      });
      console.error("Error creating deck:", error);
    }
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      this.setState({ fileContent: content });

      try {
        const parsedData = parseAnkiDeck(content);
        if (parsedData.length === 0) {
          this.setState({ error: "No valid cards found in file" });
          return;
        }

        await this.uploadDeckToFirebase(parsedData, file.name);
      } catch (error) {
        this.setState({
          error: "Error processing file. Please ensure it's in the correct format." + error,
        });
      }
    };

    reader.onerror = () => {
      this.setState({ error: "Error reading file" });
    };

    reader.readAsText(file);
  }

  render() {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center">
          <input
            type="file"
            onChange={this.handleChange}
            accept=".txt"
            disabled={this.state.isLoading}
            className="mb-4"
          />

          {this.state.isLoading && <div className="text-blue-600">Creating deck...</div>}
          {this.state.error && <div className="text-red-600">{this.state.error}</div>}
          {this.state.success && <div className="text-green-600">{this.state.success}</div>}
        </div>
      </div>
    );
  }
}

const parseAnkiDeck = (deckData: string) => {
  const pairs: { question: string; answer: string }[] = [];
  const lines = deckData.split("\n").filter((line) => line.trim() !== "");

  lines.forEach((line) => {
    const [question, answerHTML] = line.split("\t");
    const $ = cheerio.load(answerHTML);
    const answer = $("span").text().trim() || answerHTML;
    pairs.push({ question: question.trim(), answer });
  });

  return pairs;
};

function StartGame() {
  const navigate = useNavigate();
  const handleGameplay = () => {
    navigate(`/gameplay/${deckId}`);
  };

  const [gameId, setGameId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [deckId, setDeckId] = useState<string>("");

  useEffect(() => {
    const storedGameId = Cookies.get("gameId");
    const storedUsername = Cookies.get("username");

    setGameId(storedGameId || null);
    setUsername(storedUsername || null);
  }, []);

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

      {/* Pass the function to update deckId */}
      <FileSelector onDeckCreated={setDeckId} />

      {deckId && (
        <button
          className="text-white rounded-lg h-12 shadow-md hover:bg-gray-600"
          onClick={handleGameplay}
        >
          Start Gameplay
        </button>
      )}
    </div>
  );
}

export default StartGame;
