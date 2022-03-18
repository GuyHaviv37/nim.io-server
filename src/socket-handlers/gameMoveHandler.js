const {getUserRoom} = require('../users');
const {getGame, updateGame} = require('../games');
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
                type: 'NOT_PLAYER_TURN',
                msg: `This is not your turn`
            });
        }
    
        const {heaps, player1, player2} = currentGame;
    
        if(!isHeapIndexValid(heapIndex)){
            return callback({
                type: 'INVALID_HEAP_INDEX',
                msg : `No valid heap was selected`
            })
        }
        if(!isAmountToRemoveValid(heaps[heapIndex], amount)){
            return callback({
                type: 'INVALID_AMOUNT_TO_REMOVE',
                msg : `Cannot remove ${amount} of items from heap ${heapIndex}`
            })
        }
        
        heaps[heapIndex] -= amount;
        const currentPlayerTurn = currentGame.currentPlayerTurn === player1 ? player2 : player1;
        updateGame(userRoom, {heaps, currentPlayerTurn});
    
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