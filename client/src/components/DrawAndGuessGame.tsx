import { useEffect, useState } from "react";
import { GameStatus } from "../interfaces";
import { Welcome } from "../views/Welcome";
import { WordChoosing } from "../views/WordChoosing";
import { Drawing } from "../views/Drawing";
import { Guessing } from "../views/Guessing";
import { Waiting } from "../views/Waiting";
import { useSocket } from "../contexts/SocketProvider";

interface DrawAndGuessGameProps {
  points: number[];
  setPoints: React.Dispatch<React.SetStateAction<number[]>>;
}

export const DrawAndGuessGame = ({
  setPoints,
  points,
}: DrawAndGuessGameProps) => {
  const [role, setRole] = useState("");
  const [image, setImage] = useState("");
  const [waitingForSecondPlayer, setWaitingForSecondPlayer] = useState(false);
  const [gameDifficulty, setGameDifficulty] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [playerDrawing, setPlayerDrawing] = useState("player1");
  const [currentView, setCurrentView] = useState("welcome");

  const socketContext = useSocket();

  const resetGame = () => {
    if (playerDrawing === "player1") {
      setPlayerDrawing("player2");
    } else {
      setPlayerDrawing("player1");
    }
    setCurrentWord("");
    setImage("");
    setGameDifficulty("");
    setCurrentView("word-choosing");
  };

  const goToWordChoosing = () => {
    setCurrentView("word-choosing");
  };

  const startGame = (word: string) => {
    socketContext?.socket.emit("select-word", word);
    setCurrentWord(word);
    setCurrentView("drawing");
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
    setCurrentWord(word);
    const difficulty =
      word.length >= 6 ? "HARD" : word.length >= 5 ? "MEDIUM" : "EASY";
    setGameDifficulty(difficulty);
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
        setImage(data);
        setCurrentView("guessing");
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
    }
  }, [socketContext?.socket, image]);

  switch (currentView) {
    case "welcome":
      return (
        <Welcome
          waitingForSecondPlayer={waitingForSecondPlayer}
          role={role}
          goToWordChoosing={goToWordChoosing}
        />
      );
    case "word-choosing":
      return role === playerDrawing ? (
        <WordChoosing startGame={startGame} />
      ) : (
        <Waiting />
      );
    case "drawing":
      return (
        <Drawing
          setCurrentView={setCurrentView}
          setImage={setImage}
          role={role}
          currentWord={currentWord}
        />
      );
    case "guessing":
      return role !== playerDrawing ? (
        <Guessing
          playerDrawing={playerDrawing}
          points={points}
          setPoints={setPoints}
          resetGame={resetGame}
          gameDifficulty={gameDifficulty}
          currentWord={currentWord}
          image={image}
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
