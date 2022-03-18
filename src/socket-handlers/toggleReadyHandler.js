const {getUserRoom} = require('../users');
const {getGame, updateGame} = require('../games');

const toggleReadyHandler = (io, client) => ({isReady}, callback) => {
    try {
        const userRoom = getUserRoom(client.id);
        const currentGame = getGame(userRoom);
        
        const {player1, player2} = currentGame;
        if (client.id === player1) {
            updateGame(userRoom, {isPlayer1Ready: isReady});
        } else if (client.id === player2) {
            updateGame(userRoom, {isPlayer2Ready: isReady});
        } else {
            console.log(`Player with id: ${client.id} is not specifed in this game - cannot change ready status`);
        }
        console.log('finished toggeling - sending msg through socket');
        // Update the room that playerX is ready
        io.to(userRoom).emit('gameUpdate',{update: getGame(userRoom)})
    
        callback();
    } catch (error) {
        callback(error);
    }
};

module.exports = toggleReadyHandler;