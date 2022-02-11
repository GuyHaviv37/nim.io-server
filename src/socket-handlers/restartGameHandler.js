const {resetGame} = require('../games');

const restartGameHandler = (io) => ({roomId}, callback) => {
    const {updatedGame, error} = resetGame(roomId);
    if (error) return callback(error);
    
    io.in(updatedGame.id).emit('gameUpdate',{update : updatedGame, isRestart: true});
}

module.exports = restartGameHandler;