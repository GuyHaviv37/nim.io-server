const validateInitialHeapSizes = (heaps) => heaps.every((heapSize) => heapSize < 25 && heapSize >= 0);

const resetGameState = (game) => {
    game.heaps = [...game.originalHeaps];
    game.currentPlayerTurn = Math.random() > 0.5 ? player2 : game.player1;
    game.isPlayer1Ready = false;
    game.isPlayer2Ready = false;
    return game;
}

module.exports = {
    validateInitialHeapSizes, resetGameState,
}