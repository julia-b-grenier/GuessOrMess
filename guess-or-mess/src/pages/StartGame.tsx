import * as cheerio from "cheerio";
import * as React from "react";
import { Card } from "../types/game";
import { createDeck } from "../firebase/firestore";
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';  // Make sure to import js-cookie

interface FileState {
  fileContent: string;
  isLoading: boolean;
  error: string | null;
  success: string | null;
}
export class FileSelector extends React.Component<{}, FileState> {
  constructor(props: {}) {
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

    try {
      const deckId = await createDeck(cards, filename.replace(".txt", ""));
      this.setState({
        isLoading: false,
        success: `Deck successfully created with ID: ${deckId}`,
      });
      return deckId;
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
          error:
            "Error processing file. Please ensure it's in the correct format.",
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

          {this.state.isLoading && (
            <div className="text-blue-600">Creating deck...</div>
          )}

          {this.state.error && (
            <div className="text-red-600">{this.state.error}</div>
          )}

          {this.state.success && (
            <div className="text-green-600">{this.state.success}</div>
          )}
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
