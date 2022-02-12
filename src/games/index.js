const errors = require('../errors');
const {validateInitialHeapSizes, resetGameState} = require('./utils');
const games = new Map();

const EMPTY_GAME = {
    id: '',
    heaps: [],
    originalHeaps: [],
    player1: null,
    player2: null,
    playersConnected: 0,
    currentPlayerTurn: '',
    isPlayer1Ready: false,
    isPlayer2Ready: false,
}


const createGame = (roomId, heaps, player1)=>{
    if (!validateInitialHeapSizes(heaps)) {
        return {error: {msg: 'Heap size must be between 1 and 25'}};
    };

    games.set(roomId,{
        ...EMPTY_GAME,
        id: roomId,
        heaps,
        originalHeaps: [...heaps],
        player1,
        currentPlayerTurn: player1,
        playersConnected: 1,
    });

    return {game : games.get(roomId)}
}

const joinGame = (roomId, player2)=>{
    if(games.has(roomId)){
        const game = games.get(roomId)
        // this will change if spectators are added
        if(game.playersConnected != 1) {
            return {error : {
                msg: `Wrong number of players connected to the game, cannot join`,
                type: errors.FULL_ROOM, 
           }}
        };
        game.player2 = player2;
        game.playersConnected++;
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

const updateGame = (roomId, update)=>{
    if (games.has(roomId)) {
        const game = games.getGame(roomId);
        games.set(roomId,{...game,...update});
        return {game: games.get(roomId)};
    } else {
        return {error: {
            msg : `Error in updateGame : No such game with id ${roomId}`,
            type : errors.NO_ROOM_ID
        }}
    }
}

const removePlayerFromGame = (roomId, userId)=>{
    if(games.has(roomId)){
        const game = games.get(roomId);
        let switchedRoles = false;

        if (game.playersConnected > 2 || game.playersConnected < 1) {
            return {
                error: {
                    msg: 'No players are connected to this game, should have been deleted',
                    type : errors.NO_PLAYERS_FOUND
                }
            }
        }
        if (userId !== game.player1 && userId !== game.player2) {
            return {
                error: {
                    msg: `${userId} is not in game ${roomId}`
                }
            }
        }
        if(game.playersConnected == 2){
            if(userId == game.player1){
                game.player1 = game.player2;
                switchedRoles = true;
            }
            game.player2 = null;
        } else if (game.playersConnected == 1) {
            game.player1 = null;
        }
        game.playersConnected--;
        const resettedGame = resetGameState(game);
        return {switchedRoles, updatedGame : resettedGame}
    } else {
        return {error : {
            msg : `Error in removePlayerFromGame : No such game with id ${roomId}`,
            type : errors.NO_ROOM_ID
        }}
    }
}

const removeGame = (roomId) => {
    if(games.has(roomId)){
        games.delete(roomId);
    } else {
        return {error : {
            msg : `Error in removeGame : No such game with id ${roomId}`,
            type : errors.NO_ROOM_ID
        }}
    }
}

const resetGame = (roomId) => {
    if(games.has(roomId)) {
        const game = games.get(roomId);
        const resettedGame = resetGameState(game);
        return {updatedGame: resettedGame}
    } else {
        return {
            error: {
                msg: `Error in resetGame: no such game with id ${roomId}`,
                type : errors.NO_ROOM_ID
            }
        }
    }
}

const getAllGames = () => {
    return games;
}

module.exports = {
    createGame,joinGame,getGame,updateGame,removeGame,removePlayerFromGame,getAllGames,resetGame
}