import { FormEvent, useState } from "react";
import { useSocket } from "../contexts/SocketProvider";
import { GuessingProps } from "../interfaces";

export const Guessing = ({
  gameState,
  setPoints,
  points,
  resetGame,
}: GuessingProps) => {
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const socketContext = useSocket();

  const addPointsToTheWinner = () => {
    let pointsFromGame = points;
    const difficultyPoints =
      gameState.gameDifficulty === "HARD"
        ? 5
        : gameState.gameDifficulty === "MEDIUM"
        ? 3
        : 1;
    if (gameState.playerDrawing === "player1") {
      pointsFromGame[1] += difficultyPoints;
    } else if (gameState.playerDrawing === "player2") {
      pointsFromGame[0] += difficultyPoints;
    }
    socketContext?.socket.emit("end-game", pointsFromGame);
    setPoints([...pointsFromGame]);
  };

  const handleTypeAnswer = (e: FormEvent<HTMLInputElement>) => {
    setGuess((e.target as HTMLInputElement).value);
    setMessage("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (guess === gameState.currentWord) {
      addPointsToTheWinner();
      setMessage("Yes! You are correct");
      setTimeout(() => {
        resetGame();
      }, 1000);
    } else {
      setMessage("Wrong Answer, try again");
    }
  };

  return (
    <div>
      <div style={{ border: "1px solid white" }} className="image-container">
        <img src={gameState.image} alt="" />
      </div>
      <form onSubmit={handleSubmit}>
        <input onChange={handleTypeAnswer} placeholder="Guess" type="text" />
        <button
          disabled={message ? true : false}
          style={{ margin: "5px" }}
          type="submit"
        >
          Submit
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};
