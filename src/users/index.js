const errors = require('../errors');
const users = new Map();

const addUser = (socketId)=>{
    users.set(socketId,{
        room: null,
        role: null
    });
}

const getUser = (socketId)=>{
    if(users.has(socketId)){
        return {user : users.get(socketId)}
    } else {
        return {error: {
            msg : `Error in getUser : No such user with id ${socketId}`,
            type : errors.NO_USER_ID
        }}
    }
}

const getUserRoom = (socketId)=>{
    if(users.has(socketId)){
        return users.get(socketId).room;
    } else {
        return { error : {
            msg : `Error in getUserRoom : No such user with id ${socketId}`,
            type : errors.NO_USER_ID
        }
        }
    }
}

const updateUser = (socketId,update)=>{
    if(users.has(socketId)){
        users.set(socketId,{...users.get(socketId),...update});
        return {user: users.get(socketId)};
    } else {
        return {error: {
            msg : `Error in updateUser : No such user with id ${socketId}`,
            type : errors.NO_USER_ID
        }}
    }
}

const removeUser = (socketId)=>{
    if(users.has(socketId)){
        users.delete(socketId);
    } else {
        return {error: {
            msg : `Error in removeUser : No such user with id ${socketId}`,
            type : errors.NO_USER_ID
        }}
        
    }
}

const getAllUsers = ()=>{
    return users;
}

module.exports = {
    addUser,getUser,updateUser,removeUser,getUserRoom,getAllUsers
}