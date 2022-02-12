const InvalidHeapsSizesError = () => ({type: 'INAVLID_HEAPS_SIZES', msg: 'Heap size must be between 1 and 25'});
const FullRoomError = (roomId) => ({type: 'FULL_ROOM', msg: `Cannot join a room ${roomId} either full or empty`});
const RoomNotFoundError = (roomId) => ({type: 'ROOM_NOT_FOUND', msg: `No room with id: ${roomId} was found`});
const UserNotFoundInRoom = (userId, roomId) => ({type: 'USER_NOT_IN_ROOM', msg: `User ${userId} is not in room ${roomId}`});
const NotEnoughPlayersError = () => ({type: 'NOT_ENOUGH_PLAYERS', msg: 'Cannot remove player from empty room'});

module.exports = {
    InvalidHeapsSizesError,
    FullRoomError,
    RoomNotFoundError,
    UserNotFoundInRoom,
    NotEnoughPlayersError,
}