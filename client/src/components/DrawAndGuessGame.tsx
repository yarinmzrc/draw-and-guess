import { useEffect, useState } from "react";
import { GameStatus, TGameState } from "../interfaces";
import { Welcome } from "../views/Welcome";
import { WordChoosing } from "../views/WordChoosing";
import { Drawing } from "../views/Drawing";
import { Guessing } from "../views/Guessing";
import { Waiting } from "../views/Waiting";
import { useSocket } from "../contexts/SocketProvider";

const gameStateDefault = {
  image: "",
  playerDrawing: "player1",
  currentWord: "",
  currentView: "welcome",
  gameDifficulty: "",
};

interface DrawAndGuessGameProps {
  points: number[];
  setPoints: React.Dispatch<React.SetStateAction<number[]>>;
}

export const DrawAndGuessGame = ({
  setPoints,
  points,
}: DrawAndGuessGameProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [gameState, setGameState] = useState<TGameState>(gameStateDefault);
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [waitingForSecondPlayer, setWaitingForSecondPlayer] = useState(false);

  const socketContext = useSocket();

  const resetGame = () => {
    if (gameState.playerDrawing === "player1") {
      setGameState((prev) => ({ ...prev, playerDrawing: "player2" }));
    } else {
      setGameState((prev) => ({ ...prev, playerDrawing: "player1" }));
    }
    setGameState((prev) => ({
      ...prev,
      currentWord: "",
      gameDifficulty: "",
      currentView: "word-choosing",
      image: "",
    }));
  };

  const goToWordChoosing = () => {
    setGameState((prev) => ({ ...prev, currentView: "word-choosing" }));
  };

  const startGame = (word: string) => {
    socketContext?.socket.emit("select-word", word);
    setGameState((prev) => ({
      ...prev,
      currentWord: word,
      currentView: "drawing",
    }));
  };

  const assignRole = (roleFromServer: string) => {
    if (roleFromServer === "player1") {
      setWaitingForSecondPlayer(true);
    } else if (roleFromServer === "player2") {
      socketContext?.socket.emit("player2available");
    }
    setRole(roleFromServer);
  };

  const setGameWordAndDifficulty = (word: string) => {
    const difficulty =
      word.length >= 6 ? "HARD" : word.length >= 5 ? "MEDIUM" : "EASY";
    setGameState((prev) => ({
      ...prev,
      currentWord: word,
      gameDifficulty: difficulty,
    }));
  };

  useEffect(() => {
    if (socketContext?.socket) {
      socketContext?.socket.on("connect", () => {
        socketContext.socket.on("assignedRole", (roleFromServer) => {
          assignRole(roleFromServer);
        });
        socketContext.socket.on("disconnect", () => {
          socketContext?.socket.emit("disconnection", role);
        });
      });
      socketContext.socket.on("can-start-game", () => {
        setWaitingForSecondPlayer((prev) => !prev);
      });
      socketContext.socket.on("selected-word", (word) => {
        setGameWordAndDifficulty(word);
      });
      socketContext.socket.on("image", (data) => {
        setGameState((prev) => ({
          ...prev,
          image: data,
          currentView: "guessing",
        }));
        return () =>
          socketContext?.socket.removeListener("image", () => {
            return;
          });
      });
      socketContext.socket.on("ended-game", (pointsFromGame) => {
        setPoints([...pointsFromGame]);
        resetGame();
        return () =>
          socketContext?.socket.removeListener("ended-game", () => {
            return;
          });
      });
      socketContext.socket.on("refresh-page", () => {
        setMessage("disconnection appeard, please refresh page");
      });
    }
  }, [socketContext?.socket, gameState.image]);

  useEffect(() => {
    if (role) {
      setIsLoading(false);
    }
  }, [role]);

  if (isLoading) return <p>Loading ...</p>;

  if (message) return <p>{message}</p>;

  switch (gameState.currentView) {
    case "welcome":
      return (
        <Welcome
          waitingForSecondPlayer={waitingForSecondPlayer}
          role={role}
          goToWordChoosing={goToWordChoosing}
        />
      );
    case "word-choosing":
      return role === gameState.playerDrawing ? (
        <WordChoosing startGame={startGame} />
      ) : (
        <Waiting />
      );
    case "drawing":
      return (
        <Drawing
          gameState={gameState}
          setGameState={setGameState}
          role={role}
        />
      );
    case "guessing":
      return role !== gameState.playerDrawing ? (
        <Guessing
          gameState={gameState}
          points={points}
          setPoints={setPoints}
          resetGame={resetGame}
        />
      ) : (
        <Waiting />
      );
    case "waiting":
      return <Waiting />;
    default:
      return <h1>error</h1>;
  }
};
