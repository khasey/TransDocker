import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';

@WebSocketGateway({
  namespace: 'channel',
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  }
})
export class ChannelGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(Channel)
    private messageRepository: Repository<Channel>,
  ) {}
  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id} in Channel.gateway`);
}

  handleDisconnect(client: Socket) {
    // Logique de déconnexion
  console.log(`Client Channel => ${client.id} disconnected in Channel.gateway.`);
  // Autres actions à effectuer lors de la déconnexion

  // Éventuellement, émettre un événement pour informer les autres clients de la déconnexion
  this.server.emit('user CHANNEL => disconnected', client.id);
  }



  banUserFromChannel(bannedUser: number, bannerUser: number, channel: string): void {
    console.log(`Emitting userBanned event. BannedUser: ${bannedUser}, BannerUser: ${bannerUser}, Channel: ${channel}`);
    this.server.emit('userBanned', { bannedUser, bannerUser, channel });
  }
  kickUserFromChannel(kickedUser: number, kickerUser: number, channel: string): void {
    console.log(`Emitting userKicked event. KickedUser: ${kickedUser}, KickerUser: ${kickerUser}, Channel: ${channel}`);
    this.server.emit('userKicked', { kickedUser, kickerUser, channel });
  }

}