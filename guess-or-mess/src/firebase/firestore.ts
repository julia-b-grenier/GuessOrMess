// src/firestore.ts
import { Card, Deck } from "../types/game";
import { db } from "./firebase";
import { doc, getDoc, setDoc, addDoc, updateDoc, arrayUnion, collection, writeBatch, increment, onSnapshot} from "firebase/firestore";

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
    currentCard: 0,
  });

  return gameId;
};

export const getPlayersInGame = async (gameId: string) => {
  const gameRef = doc(db, "games", gameId);
  const gameSnap = await getDoc(gameRef);

  if (!gameSnap.exists()) {
    throw new Error(`Game ${gameId} not found`);
  }

  const playersRefPaths = gameSnap.data().players || [];

  // Fetch the player data for each player reference path
  const playersData = await Promise.all(
    playersRefPaths.map(async (playerRefPath: string) => {
      const playerRef = doc(db, playerRefPath);  // Create a reference to the player document
      const playerSnap = await getDoc(playerRef);  // Fetch the player data
      
      if (!playerSnap.exists()) {
        console.error(`Player data not found for ${playerRefPath}`);
        return null; // In case player data is not found, return null (or handle it differently)
      }
      
      return playerSnap.data(); // Return player data
    })
  );

  return playersData.filter(player => player !== null); // Filter out any null values (in case some players were not found)
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


export const getCardsOfDeck = async (deckId: string) => {
  const deckDocRef = doc(db, 'decks', deckId);
  const deckDocSnap = await getDoc(deckDocRef);

  if (!deckDocSnap.exists()) {
    throw new Error("Deck not found");
  }

  const deckData = deckDocSnap.data();
  console.log(deckData)
  
  if (!deckData || !deckData.cardRefs || deckData.cardRefs.length === 0) {
    throw new Error("No cards in this deck");
  }

  const cardPromises = deckData.cardRefs.map(async (cardRefId: string) => {
    const cardDocRef = doc(db, 'cards', cardRefId);
    const cardDocSnap = await getDoc(cardDocRef);

    if (cardDocSnap.exists()) {
      console.log(cardDocSnap.data())
      return cardDocSnap.data(); 
    } else {
      console.error(`Card with ID ${cardRefId} not found.`);
      return null;
    }
  });

  const cards = await Promise.all(cardPromises);

  return cards.filter(card => card !== null);
}

export const incrementCurrentCard = async (gameId: string) => {
  const gameRef = doc(db, "games", gameId);
  await updateDoc(gameRef, {
    currentCard: increment(1),
  });
};

export const getCurrentCard = async (gameId: string) => {
  const gameRef = doc(db, "games", gameId);
  const gameSnap = await getDoc(gameRef);

  if (!gameSnap.exists()) {
    throw new Error(`Game ${gameId} not found`);
  }

  const gameData = gameSnap.data();
  return gameData?.currentCard || 0; 
};

export const listenToCurrentCard = (gameId: string, callback: (currentCard: number) => void) => {
  const gameRef = doc(db, "games", gameId);

  const unsub = onSnapshot(gameRef, (doc) => {
    const gameData = doc.data();
    if (gameData) {
      const currentCard = gameData.currentCard || 0;
      callback(currentCard); 
    }
  });

  return unsub;
};