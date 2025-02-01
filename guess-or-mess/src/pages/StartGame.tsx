import * as cheerio from 'cheerio';
import * as React from 'react';

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
    return (
        <div>
            <h2>Welcome to Start Game Page</h2>
            <p>Game will begin soon!</p>
            <FileSelector />
        </div>
    );
}

export default StartGame;
