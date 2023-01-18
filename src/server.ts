import { createServer } from "http";
import { Server, Socket } from "socket.io";

export enum GameStatus {
  notStarted = "NOT STARTED",
  playerOneConnected = "PLAYER ONE CONNECTED",
  playerTwoConnected = "PLAYER TWO CONNECTED",
}

const gameData = {
  status: GameStatus.notStarted,
};

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let playerOne: Socket | null = null;
let playerTwo: Socket | null = null;

io.on("connection", (socket) => {
  if (!playerOne) {
    playerOne = socket;
    socket.emit("assignedRole", "player1");
  } else if (!playerTwo) {
    playerTwo = socket;
    socket.emit("assignedRole", "player2");
  }
  socket.on("player2available", () => {
    socket.broadcast.emit("can-start-game");
  });
  socket.on("select-word", (word) => {
    socket.broadcast.emit("selected-word", word);
  });
  socket.on("draw-image", (data) => {
    socket.broadcast.emit("image", data);
  });
  socket.on("end-game", (points) => {
    socket.broadcast.emit("ended-game", points);
  });
});

httpServer.listen(5000);
