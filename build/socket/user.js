"use strict";
const jwt = require('jsonwebtoken');
const _ = require('lodash');
module.exports = class User {
    constructor(socket, token) {
        this.socket = socket;
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                this.userId = decoded.i;
            }
            else {
                this.socket.request.app.get('logger').error('token is not defined');
                this.userId = 0;
            }
        }
        catch (error) {
            throw error;
        }
    }
    destroy() {
    }
    getRedisKeyName() {
        return `session:${this.userId}`;
    }
    deleteSession() {
        const redisClient = this.socket.request.app.get('redisClient');
        redisClient.DEL(this.getRedisKeyName());
    }
    getSocket() {
        return this.socket;
    }
    getUserId() {
        return this.userId;
    }
    send(data) {
        if (this.socket) {
            this.socket.send(data);
            return true;
        }
        else
            return false;
    }
};
