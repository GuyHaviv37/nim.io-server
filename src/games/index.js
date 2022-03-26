const errors = require('./errors');
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
        throw errors.InvalidHeapsSizesError();
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

    return games.get(roomId);
}

const joinGame = (roomId, player2)=>{
    if(games.has(roomId)){
        const game = games.get(roomId)
        // this will change if spectators are added
        if(game.playersConnected != 1) {
            throw errors.FullRoomError(roomId);
        };
        game.player2 = player2;
        game.playersConnected++;
        game.currentPlayerTurn = Math.random() > 0.5 ? player2 : game.player1;
        return game;
    } else {
        throw errors.RoomNotFoundError(roomId);
    }
}

const getGame = (roomId)=>{
    if(games.has(roomId)){
        return {...games.get(roomId)};
    } else {
        throw errors.RoomNotFoundError(roomId);
    }
}

const updateGame = (roomId, update) => {
    if (games.has(roomId)) {
        const game = games.get(roomId);
        games.set(roomId,{...game,...update});
        return games.get(roomId);
    } else {
        throw errors.RoomNotFoundError(roomId);
    }
}

const removePlayerFromGame = (roomId, userId)=>{
    if(games.has(roomId)){
        const game = games.get(roomId);
        let switchedRoles = false;

        if (userId !== game.player1 && userId !== game.player2) {
            throw errors.UserNotFoundInRoom(userId, roomId);
        }
        if (game.playersConnected < 1) {
            throw errors.NotEnoughPlayersError();
        }
        // assumption maximum players in room are 2
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
        throw errors.RoomNotFoundError(roomId);
    }
}

const removeGame = (roomId) => {
    if(games.has(roomId)){
        games.delete(roomId);
    } else {
        throw errors.RoomNotFoundError(roomId);
    }
}

const resetGame = (roomId) => {
    if(games.has(roomId)) {
        const game = games.get(roomId);
        const resettedGame = resetGameState(game);
        return resettedGame;
    } else {
        throw errors.RoomNotFoundError(roomId);
    }
}

const getAllGames = () => {
    return games;
}

module.exports = {
    createGame,joinGame,getGame,removeGame,removePlayerFromGame,getAllGames,resetGame,updateGame
}