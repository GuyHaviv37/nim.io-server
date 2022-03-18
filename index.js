const http = require('http');
const express = require('express');
const router = require('./src/router');
const socketio = require('socket.io');
const { addUser } = require('./src/users');
const {
    newGameHandler,
    joinGameHandler,
    toggleReadyHandler,
    gameMoveHandler,
    restartGameHandler,
    disconnectHandler
} = require('./src/socket-handlers');

const PORT = process.env.PORT || 8080

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "https://clever-panini-c8e22f.netlify.app",
        methods: ["GET", "POST"],
        credentials: true
    }
});


app.use(router);



io.on('connect', client => {
    addUser(client.id);

    client.on('newGame', newGameHandler(client));
    client.on('joinGame', joinGameHandler(io, client));
    client.on('toggleReady', toggleReadyHandler(io, client));
    client.on('gameMove', gameMoveHandler(io, client));
    client.on('restartGame', restartGameHandler(io));;
    client.on('disconnect', disconnectHandler(io, client));
})

server.listen(PORT, () => console.log(`Server is listening on PORT:${PORT}`));
