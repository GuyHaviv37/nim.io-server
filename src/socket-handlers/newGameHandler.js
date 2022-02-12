const {createGame} = require('../games');
const {updateUser} = require('../users');
const {PLAYER_1} = require('../constants');

const newGameHandler = (client) => ({roomId,heaps},callback) => {
    try {
        const game = createGame(roomId, heaps, client.id);
        const updatedUser = updateUser(client.id,{room: game.id, role: PLAYER_1})
        if(updatedUser.error) return callback(updatedUser.error);

        client.join(game.id);
        client.emit('init',{newGame : game})
        client.emit('roleUpdate',{userRole : updatedUser.user.role})

        callback();
    } catch (error) {
        callback(error);
    }
}

module.exports = newGameHandler;