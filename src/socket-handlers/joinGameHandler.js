const {joinGame} = require('../games');
const {updateUser} = require('../users');
const {PLAYER_2} = require('../constants');

const joinGameHandler = (io, client) => ({roomId},callback) => {
    try {
        const game = joinGame(roomId, client.id);
        const updatedUser = updateUser(client.id,{room: game.id, role : PLAYER_2});
        if(updatedUser.error) return callback(updatedUser.error);

        client.join(game.id);
        // broadcast to all clients in the room that game is init'ed for display.
        io.in(game.id).emit('init',{newGame : game});

        client.emit('roleUpdate',{userRole : updatedUser.user.role})

        callback();
    } catch (error) {
        callback(error);
    }
    
}

module.exports = joinGameHandler;