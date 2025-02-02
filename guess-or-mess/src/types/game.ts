export interface Player {
    username: string;
    score: number;
}

export interface Game {
    deck: string | null;    // Reference to deck document
    players: string[];      // Array of references to player documents
}

export interface Card {
    question: string;
    answer: string;
}

export interface Deck {
    name: string;
    cardRefs: string[];
    totalCards: number;
}