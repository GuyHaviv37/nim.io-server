const newGameHandler = require('./newGameHandler');
const joinGameHandler = require('./joinGameHandler');
const toggleReadyHandler = require('./toggleReadyHandler');
const gameMoveHandler = require('./gameMoveHandler');
const restartGameHandler = require('./restartGameHandler');
const disconnectHandler = require('./disconnectHandler');

module.exports = {
    newGameHandler,
    joinGameHandler,
    toggleReadyHandler,
    gameMoveHandler,
    restartGameHandler,
    disconnectHandler
}