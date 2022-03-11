const UserNotFoundError = (userId) => ({type: 'NO_USER_FOUND', msg: `No user with id: ${userId} was found`});
const UserNotInRoom = (userId) => ({type: 'USER_WITHOUT_ROOM', msg: `User with id: ${userId} is currently not in any rooms`})

module.exports = {
    UserNotFoundError,
    UserNotInRoom,
}
