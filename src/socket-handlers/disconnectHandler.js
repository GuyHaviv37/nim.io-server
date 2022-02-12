const {getUserRoom, removeUser, updateUser, getUser} = require('../users');
const {removePlayerFromGame, removeGame} = require('../games');
const errors = require('../errors');
const {PLAYER_1} = require('../constants');

const disconnectHandler = (io, client) => () => {
    try {
        const userRoom = getUserRoom(client.id);
        if (userRoom.error) throw {type: 'no user room', msg: 'no user room'};
        // can add error checking on getUserRoom
    
        // update game with the disconnected user removed
        const {error,switchedRoles , updatedGame} = removePlayerFromGame(userRoom, client.id);
        if(error && error.type === errors.NO_ROOM_ID){
            // player was removed from a game that does not exists - no need to update game
            removeUser(client.id)
            return;
        }
    
        // check if player removed was PLAYER_1 , if so PLAYER_2 is now PLAYER_1 (and can be joined with ease)
        if(switchedRoles){
            const userToUpdate = updatedGame.player1;
            const {error} = updateUser(userToUpdate,{role : PLAYER_1});
            if(error) console.error(error.msg); // there shouldnt be any errors
            else io.to(userToUpdate).emit('roleUpdate',{userRole : getUser(userToUpdate).user.role});
        }
        // send game update to the room
        io.to(userRoom).emit('gameUpdate',{update: updatedGame});
    
        // remove client from the users db
        removeUser(client.id)
        // if there are no more connected players to this game , remove it from games db
        if(updatedGame.playersConnected <= 0){
            removeGame(updatedGame.id);
        }
    
        // console.log(getAllGames());
        // console.log(getAllUsers());
    } catch (error) {
        console.error(error);
    } finally {
        removeUser(client.id);
    }
};

module.exports = disconnectHandler;