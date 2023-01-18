import { FormEvent, useState } from "react";
import { useSocket } from "../contexts/SocketProvider";
import { GuessingProps } from "../interfaces";

export const Guessing = ({
  image,
  currentWord,
  gameDifficulty,
  setPoints,
  playerDrawing,
  points,
  resetGame,
}: GuessingProps) => {
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const socketContext = useSocket();

  const addPointsToTheWinner = () => {
    let pointsFromGame = points;
    const difficultyPoints =
      gameDifficulty === "HARD" ? 5 : gameDifficulty === "MEDIUM" ? 3 : 1;
    if (playerDrawing === "player1") {
      pointsFromGame[1] += difficultyPoints;
    } else if (playerDrawing === "player2") {
      pointsFromGame[0] += difficultyPoints;
    }
    socketContext?.socket.emit("end-game", pointsFromGame);
    setPoints([...pointsFromGame]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (guess === currentWord) {
      console.log("Yes!");
      addPointsToTheWinner();
      resetGame();
    } else {
      setMessage("Wrong Answer, try again");
    }
  };
  return (
    <div>
      <div style={{ border: "1px solid white" }} className="image-container">
        <img src={image} alt="" />
      </div>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Guess"
          type="text"
        />
        <button style={{ margin: "5px" }} type="submit">
          Submit
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};
