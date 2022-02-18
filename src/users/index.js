const errors = require('./errors');
const users = new Map();

const addUser = (socketId) => {
    users.set(socketId, {
        room: null,
        role: null
    });
}

const getUser = (socketId) => {
    if (users.has(socketId)) {
        return users.get(socketId);
    } else {
        throw errors.UserNotFoundError(userId);
    }
}

const getUserRoom = (socketId) => {
    if (users.has(socketId)) {
        const userRoom = users.get(socketId).room;
        if (!userRoom) throw errors.UserNotInRoom(socketId);
        return userRoom;
    } else {
        throw errors.UserNotFoundError(socketId);
    }
}

const updateUser = (socketId, update) => {
    if (users.has(socketId)) {
        users.set(socketId, { ...users.get(socketId), ...update });
        return users.get(socketId);
    } else {
        throw errors.UserNotFoundError(socketId);
    }
}

const removeUser = (socketId) => {
    if (users.has(socketId)) {
        users.delete(socketId);
    } else {
        throw errors.UserNotFoundError(socketId);
    }
}

const getAllUsers = () => {
    return users;
}

module.exports = {
    addUser, getUser, updateUser, removeUser, getUserRoom, getAllUsers
}