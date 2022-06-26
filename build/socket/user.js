"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class User {
    constructor(socket, token) {
        this.socket = socket;
        try {
            if (token) {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
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
}
exports.User = User;
