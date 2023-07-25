import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';

@WebSocketGateway({ namespace: 'channel' })
export class ChannelGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(Channel)
    private messageRepository: Repository<Channel>,
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
    console.log('le channel => '+messages)
    client.emit('channel messages', messages);
  }

  @SubscribeMessage('channel message')
  async handleMessage(@MessageBody() message: { text: string; user: User }): Promise<void> {

    const newChannel = new Channel();
    newChannel.id = 2;
	newChannel.name = "test";
	newChannel.password = "test";


    await this.messageRepository.save(newChannel);

    this.server.emit('Channel message', newChannel);
    console.log('channel => ', newChannel);
  }
}