import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { Message } from './chat.entity';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private messageRepository;
    server: Server;
    constructor(messageRepository: Repository<Message>);
    handleDisconnect(client: Socket): void;
    handleConnection(client: Socket, ...args: any[]): Promise<void>;
    handleMessage(message: {
        text: string;
        user: User;
    }): Promise<void>;
}
