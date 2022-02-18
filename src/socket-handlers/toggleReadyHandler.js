const {getUserRoom} = require('../users');
const {getGame} = require('../games');

const toggleReadyHandler = (io, client) => ({isReady}, callback) => {
    try {
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
    
        // console.log(getAllGames());
        callback();
    } catch (error) {
        callback(error);
    }
};

module.exports = toggleReadyHandler;