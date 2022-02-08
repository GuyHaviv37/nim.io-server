const http = require('http');
const express = require('express');
const router = require('./router');
const socketio = require('socket.io');
const {createGame,joinGame,getGame, resetGame ,removeGame, getAllGames, removePlayerFromGame} = require('./games');
const {addUser,getUser,updateUser, removeUser,getUserRoom,getAllUsers} = require('./users');
const {PLAYER_1, PLAYER_2} = require('./constants');
const errors = require('./errors');

const PORT = process.env.PORT || 8080

const app = express();
const server = http.createServer(app);
const io = socketio(server,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      }
});


app.use(router);

// TODO: move to utils
const checkGameOver = (heaps)=>{
    const sum = heaps.reduce((acc,curr) => acc+curr,0);
    return sum <= 0;
}

io.on('connect',client =>{
    // Add new user to the db
    addUser(client.id);

    // Establishing a room
    client.on('newGame',({roomId,heaps},callback)=>{
        const {error , game} = createGame(roomId,heaps,client.id);
        if(error) return callback(error);

        const updatedUser = updateUser(client.id,{room: game.id, role: PLAYER_1})
        if(updatedUser.error) return callback(updateUser.error);

        client.join(game.id);
        client.emit('init',{newGame : game})
        client.emit('roleUpdate',{userRole : updatedUser.user.role})

        console.log(getAllUsers());
        callback();
    });

    client.on('joinGame',({roomId},callback)=>{
        const {error, game} = joinGame(roomId, client.id);
        if(error) return callback(error)

        const updatedUser = updateUser(client.id,{room: game.id, role : PLAYER_2});
        if(updatedUser.error) return callback(updateUser.error);

        client.join(game.id);
        // broadcast to all clients in the room that game is init'ed for display.
        io.in(game.id).emit('init',{newGame : game});

        client.emit('roleUpdate',{userRole : updatedUser.user.role})

        console.log(getAllUsers());
        console.log(getAllGames());

        callback();
    });

    client.on('toggleReady', ({isReady}, callback)=> {
        const userRoom = getUserRoom(client.id);
        const currentGame = getGame(userRoom).game;
        const {player1, player2} = currentGame;
        if (client.id === player1) {
            currentGame.isPlayer1Ready = isReady;
        } else if (client.id === player2) {
            currentGame.isPlayer2Ready = isReady;
        } else {
            console.log(`Player with id: ${client.id} is not specifed in this game - cannot change ready status`);
        }
        
        // Update the room that playerX is ready
        io.to(userRoom).emit('gameUpdate',{update: getGame(userRoom).game})

        console.log(getAllGames());
        callback();
    });

    client.on('gameMove',({heapIndex,amount},callback)=>{
        const userRoom = getUserRoom(client.id);
        const currentGame = getGame(userRoom).game;
        // handle error check if game was not found !!

        // Check both players are ready
        if (!currentGame.isPlayer1Ready || !currentGame.isPlayer2Ready) {
            return callback({
                msg: 'At least one player is not ready yet...'
            })
        }
        // Check turn legality
        if (currentGame.currentPlayerTurn !== client.id) {
            console.log(`This is not ${client.id}'s turn`);
            return callback({
                msg: `This is not your turn`
            });
        }

        const {heaps, player1, player2} = currentGame;

        // Validity checks - TODO:  move to utils
        if(heapIndex < 0 || heapIndex > 2){
            // throw error - this should never happen if front-end is used
            return callback({
                msg : `Error on heap index : ${heapIndex}`
            })
        }
        if(amount > heaps[heapIndex] || amount <= 0){
            // throw error - this should never happen if front-end is used
            return callback({
                msg : `Cannot remove ${amount} of items from heap ${heapIndex}`
            })
        }
        // Update legal game move
        heaps[heapIndex] -= amount;
        currentGame.currentPlayerTurn = currentGame.currentPlayerTurn === player1 ? player2 : player1;

        if(checkGameOver(heaps)){
            io.to(userRoom).emit('gameOver',{winner : client.id});
        } else {
            io.to(userRoom).emit('gameUpdate',{update: getGame(userRoom).game})
        }

        callback();
    })

    client.on('restartGame', ({roomId}, callback) => {
        const {updatedGame, error} = resetGame(roomId);
        if (error) return callback(error);
        
        io.in(updatedGame.id).emit('gameUpdate',{update : updatedGame, isRestart: true});
    });

    const disconnectHandler = ()=>{
        // can add error checking on getUserRoom
        const userRoom = getUserRoom(client.id);

        // update game with the disconnected user removed
        const {error,switchedRoles , updatedGame} = removePlayerFromGame(userRoom,client.id);
        if(error && error.type === errors.NO_ROOM_ID){
            // player was removed from a game that does not exists - no need to update game
            removeUser(client.id)
            return;
        }

        // check if player removed was PLAYER_1 , if so PLAYER_2 is now PLAYER_1 (and can be joined with ease)
        if(switchedRoles){
            const userToUpdate = updatedGame.player1;
            const {error} = updateUser(userToUpdate,{role : PLAYER_1});
            if(error) console.error(error.msg); // there shouldnt be any errors
            else io.to(userToUpdate).emit('roleUpdate',{userRole : getUser(userToUpdate).user.role});
        }
        // send game update to the room
        io.to(userRoom).emit('gameUpdate',{update: updatedGame});

        // remove client from the users db
        removeUser(client.id)
        // if there are no more connected players to this game , remove it from games db
        if(updatedGame.playersConnected <= 0){
            removeGame(updatedGame.id);
        }

        console.log(getAllGames());
        console.log(getAllUsers());
    };

    client.on('disconnect',disconnectHandler);
})

server.listen(PORT,()=>console.log(`Server is listening on PORT:${PORT}`));
