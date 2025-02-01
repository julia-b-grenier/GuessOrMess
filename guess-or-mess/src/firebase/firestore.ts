// src/firestore.ts
import { Card, Deck } from "../types/game";
import { db } from "./firebase";
import { doc, getDoc, setDoc, addDoc, updateDoc, arrayUnion, collection, writeBatch } from "firebase/firestore";

export const createNewGame = async () => {
  // Generate gameId that is a 5 alphanumerical code
  const generateGameId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let gameId = '';
    for (let i = 0; i < 5; i++) {
      gameId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return gameId;
  };

  const gameId = generateGameId();

  const gameRef = doc(db, "games", gameId);
  await setDoc(gameRef, {
    deck: null,
    players: [],
  });

  return gameId;
};

export const getPlayersInGame = async (gameId: string) => {
  const gameRef = doc(db, "games", gameId);
  const gameSnap = await getDoc(gameRef);

  if (!gameSnap.exists()) {
    throw new Error(`Game ${gameId} not found`);
  }

  return gameSnap.data().players || [];
};

export const addPlayerToGame = async (username: string, gameId: string) => {
  // Check if the game exists before adding a player
  const gameRef = doc(db, "games", gameId);
  const gameSnap = await getDoc(gameRef);

  if (!gameSnap.exists()) {
    throw new Error(`Game ${gameId} not found`);
  }

  const gameData = gameSnap.data();
  if (!gameData.players) {
    gameData.players = [];
  }

  // Check if the username is already in the game's players array
  const existingPlayersRef = gameData.players; // List of player document paths

  // Fetch each player's document to check usernames
  for (const playerPath of existingPlayersRef) {
    const playerDoc = await getDoc(doc(db, playerPath));
    if (playerDoc.exists() && playerDoc.data().username === username) {
      throw new Error(`Username "${username}" is already taken in this game.`);
    }
  }

  // Create a reference to the players collection
  const playersCollectionRef = collection(db, "players");

  // Add the new player document with Firestore's auto-generated ID
  const playerRef = await addDoc(playersCollectionRef, {
    username: username,
    score: 0,
  });

  // Update the game document by adding the player's reference to the players array
  await updateDoc(gameRef, {
    players: arrayUnion(playerRef.path), // Add the player's path reference to the game document
  });

  return playerRef.path;
};

export const createDeck = async (cards: Card[], deckName: string) => {
  const batch = writeBatch(db);
  const cardRefs: string[] = [];

  for (const card of cards) {
    const cardDocRef = doc(collection(db, 'cards'));
    batch.set(cardDocRef, {
      ...card,
    })
    cardRefs.push(cardDocRef.id);
  }

  // Create deck document
  const deckDocRef = doc(collection(db, 'decks'));
  const newDeck: Deck = {
    name: deckName,
    cardRefs,
    totalCards: cardRefs.length,
  };

  batch.set(deckDocRef, newDeck);

  await batch.commit();
  return deckDocRef.id;
}