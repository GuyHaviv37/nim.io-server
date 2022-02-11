const {createGame} = require('../games');
const {updateUser} = require('../users');
const {PLAYER_1} = require('../constants');

const newGameHandler = (io, client) => ({roomId,heaps},callback) => {
    const {error , game} = createGame(roomId,heaps,client.id);
    if(error) return callback(error);

    const updatedUser = updateUser(client.id,{room: game.id, role: PLAYER_1})
    if(updatedUser.error) return callback(updatedUser.error);

    client.join(game.id);
    client.emit('init',{newGame : game})
    client.emit('roleUpdate',{userRole : updatedUser.user.role})

    // console.log(getAllUsers());
    callback();
}

module.exports = newGameHandler;