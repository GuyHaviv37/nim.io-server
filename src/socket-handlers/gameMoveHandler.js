const {getUserRoom} = require('../users');
const {getGame} = require('../games');
const {arePlayersReady, isPlayersTurn, isHeapIndexValid, isAmountToRemoveValid, isGameOver} = require('./gameUtils');

const gameMoveHandler = (io, client) => ({heapIndex,amount}, callback) => {
    try {
        const userRoom = getUserRoom(client.id);
        const currentGame = getGame(userRoom);
    
        if (!arePlayersReady(currentGame)) {
            return callback({
                msg: 'At least one player is not ready yet...'
            })
        }
        if (!isPlayersTurn(currentGame, client.id)) {
            console.log(`This is not ${client.id}'s turn`);
            return callback({
                msg: `This is not your turn`
            });
        }
    
        const {heaps, player1, player2} = currentGame;
    
        if(!isHeapIndexValid(heapIndex)){
            return callback({
                msg : `Error on heap index : ${heapIndex}`
            })
        }
        if(!isAmountToRemoveValid(heaps[heapIndex], amount)){
            return callback({
                msg : `Cannot remove ${amount} of items from heap ${heapIndex}`
            })
        }
        // Update legal game move - would be best to do it by copy and not by index I guess if we try to mock a db
        heaps[heapIndex] -= amount;
        currentGame.currentPlayerTurn = currentGame.currentPlayerTurn === player1 ? player2 : player1;
    
        if(isGameOver(heaps)){
            io.to(userRoom).emit('gameOver',{winner : client.id});
        } else {
            io.to(userRoom).emit('gameUpdate',{update: getGame(userRoom)})
        }
    
        callback();
    } catch (error) {
        callback(error);
    }
};

module.exports = gameMoveHandler;