import {verify} from 'jsonwebtoken';
interface JwtPayload {
    i: string;
}
interface Socket {
    request: any;
    send: any;
}
export class User {
    userId: number;
    socket: Socket;

    constructor(socket: Socket, token: string) {
        this.socket = socket;

        try {
            if(token) {
                const decoded = verify(token, process.env.JWT_SECRET) as JwtPayload;
                this.userId = parseInt(decoded.i);
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