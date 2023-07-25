import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './chat.entity';
import { Channel } from 'diagnostics_channel';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    
  ) {}
  handleDisconnect(client: Socket) {
    // Logique de déconnexion
  console.log(`Client ${client.id} disconnected.`);
  // Autres actions à effectuer lors de la déconnexion

  // Éventuellement, émettre un événement pour informer les autres clients de la déconnexion
  this.server.emit('user disconnected', client.id);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const messages = await this.messageRepository.find();
    client.emit('chat messages', messages);
  }

  @SubscribeMessage('chat message')
  async handleMessage(@MessageBody() message: { text: string; user: User; channelId: number; }): Promise<void> {

    const newMessage = new Message();
    newMessage.sender = message.user.id;
    newMessage.message = message.text;
    newMessage.date = new Date();
    newMessage.channelId = message.channelId;
    newMessage.user = message.user;
    newMessage.username = message.user.username;
    newMessage.imageUrl = message.user.imageUrl;
  

    console.log("nm userrrrrrrrrrrrrrrr => "+newMessage.user.username)
    console.log()

    await this.messageRepository.save(newMessage);

    this.server.emit('chat message', newMessage);
    console.log('user => ', newMessage);
  }
}
