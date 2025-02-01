// src/firestore.ts
import { db } from "./firebase";
import { doc, getDoc, setDoc, addDoc, updateDoc, arrayUnion, collection } from "firebase/firestore";

export const createNewGame = async () => {
  // Generate gameId that is a 5 alphanumerical code
  const generateGameId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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
};