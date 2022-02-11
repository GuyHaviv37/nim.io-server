const {joinGame} = require('../games');
const {updateUser} = require('../users');
const {PLAYER_2} = require('../constants');

const joinGameHandler = (io, client) => ({roomId},callback) => {
    const {error, game} = joinGame(roomId, client.id);
    if(error) return callback(error)

    const updatedUser = updateUser(client.id,{room: game.id, role : PLAYER_2});
    if(updatedUser.error) return callback(updatedUser.error);

    client.join(game.id);
    // broadcast to all clients in the room that game is init'ed for display.
    io.in(game.id).emit('init',{newGame : game});

    client.emit('roleUpdate',{userRole : updatedUser.user.role})

    // console.log(getAllUsers());
    // console.log(getAllGames());

    callback();
}

module.exports = joinGameHandler;