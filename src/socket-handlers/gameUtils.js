const isGameOver = (heaps) => {
    const sum = heaps.reduce((acc, curr) => acc + curr, 0);
    return sum <= 0;
};

const arePlayersReady = (game) => {
    return game.isPlayer1Ready && game.isPlayer2Ready
};

const isPlayersTurn = (game, playerId) => {
    return game.currentPlayerTurn === playerId
};

const isHeapIndexValid = (heapIndex) => {
    return heapIndex >= 0 && heapIndex <= 2
};

const isAmountToRemoveValid = (heapSize, amount) => {
    return amount > 0 && amount <= heapSize
};

module.exports = {
    isGameOver,
    arePlayersReady,
    isPlayersTurn,
    isHeapIndexValid,
    isAmountToRemoveValid
}