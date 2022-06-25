const jwt = require('jsonwebtoken');
const _ = require('lodash');

module.exports = class User {
    userId: number;
    socket: {
        send: any;
        request: {
            app: any;
        };
    };
    constructor(socket: { send: any, request: { app: any; }; }, token: any) {
        this.socket = socket;

        try {
            if(token) {
                const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
                this.userId = decoded.i;
            }
            else {
                this.socket.request.app.get('logger').error('token is not defined');
                this.userId = 0;
            }
        }
        catch(error) {
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

    send(data: any) {
        if(this.socket) {
            this.socket.send(data);
            return true;
        }
        else return false;
    }
}