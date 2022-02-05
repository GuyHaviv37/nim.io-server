const errors = require('./errors');
const {PLAYER_1, PLAYER_2} = require('./constants');
const games = new Map();


const createGame = (roomId,heaps,player1)=>{
    games.set(roomId,{
        id: roomId,
        heaps,
        originalHeaps : [...heaps],
        player1,
        player2: null,
        spectators: [],
        playersConnected : 1,
        currentPlayerTurn: player1,
        isPlayer1Ready: false,
        isPlayer2Ready: false,
    });

    return {game : games.get(roomId)}
}

const joinGame = (roomId,player2)=>{
    if(games.has(roomId)){
        const game = games.get(roomId)
        // this will change if spectators are added
        if(game.playersConnected != 1) return {error : `Wrong number of players connected to the game, cannot join`};
        game.player2 = player2;
        game.playersConnected++;
        //console.log(game);
        return {game};
    } else {
        return {error: {
            msg : `Tried to join room ${roomId}, but no such room exists`,
            type : errors.NO_ROOM_ID
        }}
    }
}

const getGame = (roomId)=>{
    if(games.has(roomId)){
        return {game : games.get(roomId)}
    } else {
        return {error: {
            msg : `Error in getGame : No such game with id ${roomId}`,
            type : errors.NO_ROOM_ID
        }}
    }
}

const updateGame = (roomId,update)=>{
    if(games.has(roomId)){
        games.set(roomId,{...games.get(roomId),...update});
        return {game: games.get(roomId)};
    } else {
        return {error: {
            msg : `Error in updateGame : No such game with id ${roomId}`,
            type : errors.NO_ROOM_ID
        }}
    }
}

const removePlayerFromGame = (roomId,userId)=>{
    if(games.has(roomId)){
        const game = games.get(roomId);
        let switchedRoles = false;
        if(game.playersConnected == 2){
            if(userId == game.player1){
                game.player1 = game.player2;
                switchedRoles = true;
            }
            game.player2 = null;
            game.playersConnected--;
            game.heaps = [...game.originalHeaps];
            return {switchedRoles, updatedGame : game}
        }else if(game.playersConnected == 1){
            game.player1 = null;
            game.playersConnected--;
            game.heaps = [...game.originalHeaps];
            return {switchedRoles, updatedGame : game}
        } else{
            return {error: {
                msg: 'No players are connected to this game, should have been deleted',
                type : errors.NO_PLAYERS_FOUND
            }
            }
        }
    } else {
        return {error : {
            msg : `Error in removePlayerFromGame : No such game with id ${roomId}`,
            type : errors.NO_ROOM_ID
        }}
    }
}

const removeGame = (roomId)=>{
    if(games.has(roomId)){
        games.delete(roomId);
    } else {
        return {error : {
            msg : `Error in removeGame : No such game with id ${roomId}`,
            type : errors.NO_ROOM_ID
        }}
    }
}

const getAllGames = ()=>{
    return games;
}

module.exports = {
    createGame,joinGame,getGame,updateGame,removeGame,removePlayerFromGame,getAllGames,
}