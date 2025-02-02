// src/firestore.ts
import { Card, Deck } from "../types/game";
import { db } from "./firebase";
import { doc, getDoc, setDoc, addDoc, updateDoc, arrayUnion, collection, writeBatch, increment, onSnapshot } from "firebase/firestore";

export const createNewGame = async () => {
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
    currentCard: -1,
  });

  return gameId;
};

export const getPlayersInGame = (gameId: string, callback: (players: any[]) => void) => {
  const gameRef = doc(db, "games", gameId);

  const unsubscribe = onSnapshot(gameRef, (gameSnap) => {
    if (!gameSnap.exists()) {
      callback([]);
      return;
    }

    const playersRefPaths = gameSnap.data().players || [];

    Promise.all(
      playersRefPaths.map(async (playerRefPath: string) => {
        const playerRef = doc(db, playerRefPath);
        const playerSnap = await getDoc(playerRef);

        if (playerSnap.exists()) {
          return playerSnap.data();
        }
        return null;
      })
    )
      .then((playersData) => {
        callback(playersData.filter((player) => player !== null));
      })
      .catch((err) => {
        console.error("Failed to fetch player data", err);
        callback([]);
      });
  });

  return unsubscribe;
};


export const addPlayerToGame = async (username: string, gameId: string) => {
  const gameRef = doc(db, "games", gameId);
  const gameSnap = await getDoc(gameRef);

  if (!gameSnap.exists()) {
    throw new Error(`Game ${gameId} not found`);
  }

  const gameData = gameSnap.data();
  if (!gameData.players) {
    gameData.players = [];
  }

  const existingPlayersRef = gameData.players;

  for (const playerPath of existingPlayersRef) {
    const playerDoc = await getDoc(doc(db, playerPath));
    if (playerDoc.exists() && playerDoc.data().username === username) {
      throw new Error(`Username "${username}" is already taken in this game.`);
    }
  }

  const playersCollectionRef = collection(db, "players");

  const playerRef = await addDoc(playersCollectionRef, {
    username: username,
    score: 0,
  });


  await updateDoc(gameRef, {
    players: arrayUnion(playerRef.path),
  });

  return playerRef.path;
};

export const createDeck = async (cards: Card[], deckName: string, gameId: string) => {
  const batch = writeBatch(db);
  const cardRefs: string[] = [];

  for (const card of cards) {
    const cardDocRef = doc(collection(db, "cards"));
    batch.set(cardDocRef, {
      ...card,
    });
    cardRefs.push(cardDocRef.id);
  }

  const deckDocRef = doc(collection(db, "decks"));
  const newDeck: Deck = {
    name: deckName,
    cardRefs,
    totalCards: cardRefs.length,
  };

  batch.set(deckDocRef, newDeck);

  await batch.commit();

  const gameDocRef = doc(db, "games", gameId);
  const gameDocSnap = await getDoc(gameDocRef);

  if (!gameDocSnap.exists()) {
    throw new Error("Game not found.");
  }


  await updateDoc(gameDocRef, {
    deck: deckDocRef.id,
  });

  return deckDocRef.id;
};


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

export const incrementPlayerScore = async (gameId: string, playerId: string) => {
  if (!playerId || !gameId) return;

  const playerDocRef = doc(db, "games", gameId, "players", playerId);

  try {
    const playerDocSnap = await getDoc(playerDocRef);

    if (!playerDocSnap.exists()) {
      console.error("Player document not found.");
      return;
    }

    await updateDoc(playerDocRef, {
      score: increment(1),
    });

    console.log(`Score updated for player ${playerId}`);
  } catch (error) {
    console.error("Error updating player score:", error);
  }
};

export const fetchLeaderboard = async (gameId: string) => {
  const gameDocRef = doc(db, 'games', gameId);
  const gameDocSnap = await getDoc(gameDocRef);

  if (!gameDocSnap.exists()) {
    throw new Error("Game not found");
  }

  const gameData = gameDocSnap.data();

  if (Array.isArray(gameData.players)) {
    // Sort players by descending score
    const sortedPlayers = [...gameData.players].sort(
      (a, b) => b.score - a.score
    );

    const players = await Promise.all(sortedPlayers);
    return players.filter(player => player !== null);
  }
}