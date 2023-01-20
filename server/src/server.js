"use strict";
exports.__esModule = true;
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var httpServer = (0, http_1.createServer)();
var io = new socket_io_1.Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
var playerOne = null;
var playerTwo = null;
io.on("connection", function (socket) {
  if (!playerOne) {
    playerOne = socket;
    socket.emit("assignedRole", "player1");
  } else if (!playerTwo) {
    playerTwo = socket;
    socket.emit("assignedRole", "player2");
  }
  socket.on("player2available", function () {
    socket.broadcast.emit("can-start-game");
  });
  socket.on("select-word", function (word) {
    socket.broadcast.emit("selected-word", word);
  });
  socket.on("draw-image", function (data) {
    socket.broadcast.emit("image", data);
  });
  socket.on("end-game", function (points) {
    socket.broadcast.emit("ended-game", points);
  });
  socket.on("disconnect", function () {
    playerOne = null;
    playerTwo = null;
    socket.broadcast.emit("refresh-page");
  });
});
httpServer.listen(process.env.PORT || 5020, function () {
  console.log("listeninssg yes");
});
