import * as cheerio from 'cheerio';
import React, { useState, useEffect } from 'react';
import ReactCardFlip from 'react-card-flip';
import FlashCard from './FlashCard';

class Flashcard extends React.Component {
  constructor(props: {}) {
    super(props);
    this.state = {
      isFlipped: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    this.setState((prevState: { isFlipped: boolean }) => ({
      isFlipped: !prevState.isFlipped
    }));
  }

  render() {
    return (
      <ReactCardFlip isFlipped={this.state.isFlipped} flipDirection="vertical">
        <div className="card front">
          <button onClick={this.handleClick}>Submit</button>
          <FlashCard 
            question="What is the capital of France?" 
            options={["Paris", "London", "Berlin", "Madrid"]} 
          />
        </div>
        
        <div className="card back">
          <p>This is the back of the card.</p>
          <button onClick={this.handleClick}>Flip</button>
        </div>
      </ReactCardFlip>
    );
  }
}

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

setTimeout(() => {
  console.log("Hello, World!");
}, 100000);

const parseAnkiDeck = (deckData: string) => {
  const pairs: { question: string; answer: string }[] = [];
  const lines = deckData.split('\n').filter(line => line.trim() !== '');

  lines.forEach(line => {
    const [question, answerHTML] = line.split('\t');
    if (!question || !answerHTML) return;
    
    const $ = cheerio.load(answerHTML);
    const answer = $('span').text().trim() || answerHTML; 
    pairs.push({ question: question.trim(), answer });
  });

  return pairs;
};

function StartGame() {
  return (
    <div>
      <h2>Welcome to Start Game Page</h2>
      <p>Game will begin soon!</p>
      <FileSelector />
      <Flashcard />
    </div>
  );
}

export default StartGame;
