const {getUserRoom, removeUser, updateUser, getUser} = require('../users');
const {removePlayerFromGame, removeGame} = require('../games');
const {PLAYER_1} = require('../constants');

const disconnectHandler = (io, client) => () => {
    try {
        const userRoom = getUserRoom(client.id);
    
        // update game with the disconnected user removed
        const {switchedRoles , updatedGame} = removePlayerFromGame(userRoom, client.id);
    
        // check if player removed was PLAYER_1 , if so PLAYER_2 is now PLAYER_1 (and can be joined with ease)
        if(switchedRoles){
            const userToUpdate = updatedGame.player1;
            updateUser(userToUpdate,{role : PLAYER_1});
            io.to(userToUpdate).emit('roleUpdate',{userRole : getUser(userToUpdate).role});
        }
        // send game update to the room
        io.to(userRoom).emit('gameUpdate',{update: updatedGame});
    
        // remove client from the users db
        removeUser(client.id)
        // if there are no more connected players to this game , remove it from games db
        if(updatedGame.playersConnected <= 0){
            removeGame(updatedGame.id);
        }
    
    } catch (error) {
        console.error(error);
        removeUser(client.id);
    }
};

module.exports = disconnectHandler;