import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { createDeck } from "../firebase/firestore"; // Assuming you have this function
import WaitingArea from "../components/WaitingArea"; // Assuming this component exists
import * as cheerio from "cheerio";

// Define the structure of a Card
interface Card {
  question: string;
  answer: string; // Assuming answer is a single answer for simplicity
}

interface Deck {
  name: string;
  cardRefs: string[];
  totalCards: number;
}

interface FileState {
  fileContent: string;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  selectedFileName: string | null;
}

// FileSelector component to handle deck file upload
class FileSelector extends React.Component<{ onDeckCreated: (deckId: string) => void; gameId: string | null }, FileState> {
  constructor(props: { onDeckCreated: (deckId: string) => void; gameId: string | null }) {
    super(props);
    this.state = {
      fileContent: "",
      isLoading: false,
      error: null,
      success: null,
      selectedFileName: null,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  async uploadDeckToFirebase(cards: Card[], filename: string, gameId: string) {
    this.setState({ isLoading: true, error: null, success: null });
  
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
  
    try {
      const deckId = await createDeck(
        shuffledCards,
        filename.replace(".txt", ""),
        gameId
      );
      
      this.setState({
        isLoading: false,
        success: `Deck successfully created with ID: ${deckId}`,
      });
  
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

    if (!file.name.endsWith(".txt")) {
      this.setState({ error: "Please select a .txt file" });
      return;
    }

    this.setState({ selectedFileName: file.name });

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

        const { gameId } = this.props; // Use gameId passed from the parent component

        if (gameId) {
          await this.uploadDeckToFirebase(parsedData, file.name, gameId); // Pass gameId here
        } else {
          this.setState({ error: "No Game ID available." });
        }
      } catch (error) {
        this.setState({
          error:
            "Error processing file. Please ensure it's in the correct format." + error,
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
      <div className="flex flex-col items-center w-full max-w-xl mx-auto">
        {!this.state.selectedFileName ? (
          <label className="w-full cursor-pointer">
            <div className="border-2 border-dashed border-gray-400 rounded-lg p-8 hover:border-blue-500 transition-colors duration-200">
              <div className="flex flex-col items-center space-y-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-300">
                    Drop your deck file here
                  </p>
                  <p className="text-sm text-gray-400">
                    or click to select (.txt only)
                  </p>
                </div>
              </div>
            </div>
            <input
              type="file"
              onChange={this.handleChange}
              accept=".txt"
              disabled={this.state.isLoading}
              className="hidden"
            />
          </label>
        ) : (
          <div className="w-full rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-lg font-medium">
                  Deck Name: {this.state.selectedFileName}
                </span>
              </div>
              {!this.state.isLoading && !this.state.success && (
                <button
                  onClick={() => this.setState({ selectedFileName: null })}
                  className="text-sm text-gray-400 hover:text-gray-300"
                >
                  Change file
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 w-full text-center">
          {this.state.isLoading && (
            <div className="flex items-center justify-center space-x-2 text-blue-400">
              <div className="w-4 h-4 rounded-full border-2 border-b-transparent border-blue-400 animate-spin"></div>
              <span>Creating deck...</span>
            </div>
          )}

          {this.state.error && (
            <div className="text-red-400 bg-red-900/20 rounded-lg p-3">
              {this.state.error}
            </div>
          )}

          {this.state.success && (
            <div className="text-green-400 bg-green-900/20 rounded-lg p-3">
              {this.state.success}
            </div>
          )}
        </div>
      </div>
    );
  }
}

// Parse the file into the correct format for cards
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

// Main StartGame component to display game state
function StartGame() {
  const navigate = useNavigate();
  const [gameId, setGameId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [deckId, setDeckId] = useState<string>("");

  useEffect(() => {
    const storedGameId = Cookies.get("gameId");
    const storedUsername = Cookies.get("username");

    setGameId(storedGameId || null);
    setUsername(storedUsername || null);
  }, []);

  const handleGameplay = () => {
    if (gameId && deckId) {
      navigate(`/gameplay/${deckId}/${gameId}`);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 space-y-12">
      <div className="py-4">
        <h1 className="text-7xl font-bold">Game ID: {gameId}</h1>
      </div>

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

        {/* Pass gameId to FileSelector */}
        <FileSelector gameId={gameId} onDeckCreated={setDeckId} />

        {/* Only show this button if deckId is available */}
        {deckId && (
          <button
            className="text-white rounded-lg h-12 shadow-md hover:bg-gray-600"
            onClick={handleGameplay}
          >
            Start Gameplay
          </button>
        )}

        {/* WaitingArea component */}
        <WaitingArea />
      </div>
    </div>
  );
}

export default StartGame;
