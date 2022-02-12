const {getUserRoom} = require('../users');
const {getGame} = require('../games');

// TODO: move to utils
const checkGameOver = (heaps)=>{
    const sum = heaps.reduce((acc,curr) => acc+curr,0);
    return sum <= 0;
}

const gameMoveHandler = (io, client) => ({heapIndex,amount}, callback) => {
    try {
        const userRoom = getUserRoom(client.id);
        // handle error check if userRoom was not found !!
        const currentGame = getGame(userRoom).game;
    
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
    } catch (error) {
        callback(error);
    }
};

module.exports = gameMoveHandler;