import { useEffect, useState } from "react";
import { DrawAndGuessGame } from "./components/DrawAndGuessGame";
import { SocketProvider, useSocket } from "./contexts/SocketProvider";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

function App() {
  const [id, setId] = useState(uuidv4());
  const [points, setPoints] = useState([0, 0]);
  const socketContext = useSocket();

  useEffect(() => {
    socketContext?.socket.on("ended-game", (pointsUpdated) => {
      setPoints([...pointsUpdated]);
    });
  }, [socketContext?.socket]);

  return (
    <div className="App">
      <p>Player 1 Score: {points[0]}</p>
      <p>Player 2 Score: {points[1]}</p>
      <SocketProvider id={id}>
        <DrawAndGuessGame setPoints={setPoints} points={points} />
      </SocketProvider>
    </div>
  );
}

export default App;
