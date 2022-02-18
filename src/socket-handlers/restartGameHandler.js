const {resetGame} = require('../games');

const restartGameHandler = (io) => ({roomId}, callback) => {
    try {
        const updatedGame = resetGame(roomId);
        
        io.in(updatedGame.id).emit('gameUpdate',{update : updatedGame, isRestart: true});
    } catch (error) {
        callback(error);
    }
}

module.exports = restartGameHandler;