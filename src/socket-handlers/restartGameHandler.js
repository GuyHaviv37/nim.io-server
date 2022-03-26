const {resetGame, updateGame} = require('../games');

const restartGameHandler = (io) => ({roomId, newHeaps}, callback) => {
    try {
        let updatedGame = resetGame(roomId);
        if (newHeaps) {
            updatedGame = updateGame(roomId, {heaps: newHeaps, originalHeaps: [...newHeaps]});
        }
        
        io.in(updatedGame.id).emit('gameUpdate',{update : updatedGame, isRestart: true});
    } catch (error) {
        callback(error);
    }
}

module.exports = restartGameHandler;