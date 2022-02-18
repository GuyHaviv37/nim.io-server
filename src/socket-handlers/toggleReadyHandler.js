const {getUserRoom} = require('../users');
const {getGame, updateGame} = require('../games');

const toggleReadyHandler = (io, client) => ({isReady}, callback) => {
    try {
        console.log('at toggleReadyHandler');
        const userRoom = getUserRoom(client.id);
        console.log('at toggleReadyHandler/userRoom: ', userRoom);

        const currentGame = getGame(userRoom);
        console.log('at toggleReadyHandler/currentGame: ', currentGame);
        
        const {player1, player2} = currentGame;
        if (client.id === player1) {
            // currentGame.isPlayer1Ready = isReady;
            updateGame(userRoom, {isPlayer1Ready: isReady});
        } else if (client.id === player2) {
            // currentGame.isPlayer2Ready = isReady;
            updateGame(userRoom, {isPlayer2Ready: isReady});
        } else {
            console.log(`Player with id: ${client.id} is not specifed in this game - cannot change ready status`);
        }
        console.log('finished toggeling - sending msg through socket');
        // Update the room that playerX is ready
        io.to(userRoom).emit('gameUpdate',{update: getGame(userRoom)})
    
        // console.log(getAllGames());
        callback();
    } catch (error) {
        callback(error);
    }
};

module.exports = toggleReadyHandler;