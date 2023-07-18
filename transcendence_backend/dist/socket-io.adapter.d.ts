import { IoAdapter } from '@nestjs/platform-socket.io';
import * as socketio from 'socket.io';
export declare class SocketIoAdapter extends IoAdapter {
    private isCorsEnabled;
    constructor(app: any, isCorsEnabled?: boolean);
    createIOServer(port: number, options?: socketio.ServerOptions): socketio.Server;
}
