import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './chat.entity';
import { Channel } from 'diagnostics_channel';
import { UserService } from '../user/user.service';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'],
    credentials: true,
  }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets: { [userId: string]: string } = {};
  private userToSocketMap = new Map<number, Socket>();

  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private userService: UserService,
     // Structure pour stocker la correspondance
  ) {}

  @SubscribeMessage('authenticate')
  authenticate(client: Socket, userId: string): void {
    this.userSockets[userId] = client.id;
    console.log(`User ${userId} connected with socket ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected from ChatGateway.`);
  
    const userId = [...this.userToSocketMap.entries()]
                  .find(([_, socket]) => socket.id === client.id)?.[0];
    
    if (typeof userId === 'number') {
      this.userToSocketMap.delete(userId);
      console.log(`User ID ${userId} disconnected.`);
    } else {
      console.log('Could not find user ID for disconnected client.');
    }
  
    // Éventuellement, émettre un événement pour informer les autres clients de la déconnexion
    this.server.emit('user disconnected', client.id);
  }
  

  async handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client ${client.id} connected ChatGateway. from ${client}`);
    const userIdString = client.handshake.query.userId;
  
    let userId: number;
  
    if (Array.isArray(userIdString)) {
      // Si userIdString est un tableau, prendre la première valeur
      userId = parseInt(userIdString[0], 10);
    } else {
      // Sinon, c'est une chaîne de caractères, alors la convertir directement
      userId = parseInt(userIdString, 10);
    }
  
    this.userToSocketMap.set(userId, client);
  
    const messages = await this.messageRepository.find();
    client.emit('chat complet', messages);
  }
  

  @SubscribeMessage('chat message')
  async handleMessage(@MessageBody() message: { text: string; user: User; channelId: number; }): Promise<void> {
    //recupere tous les user present en db
    const userList = await this.userService.getAllUsers();
    //grace a la liste de user recupere, recuperere la liste des personnes bloque pour chaque userid de la liste

    const newMessage = new Message();
    newMessage.sender = message.user.id;
    newMessage.message = message.text;
    newMessage.date = new Date();
    newMessage.channelId = message.channelId;
    newMessage.user = message.user;
    newMessage.username = message.user.username;
    newMessage.imageUrl = message.user.imageUrl;
  

    console.log(`message from user ${message.user.username} => ${message.text}`);

    await this.messageRepository.save(newMessage);

    userList.forEach(async (user) => {
      const blockedUsers = await this.userService.getBlockedUsers(user.id); // Liste des utilisateurs bloqués pour cet utilisateur
  
      // Trouvez la connexion client pour cet utilisateur (vous devrez peut-être le gérer séparément)
      const client = this.getClientByUserId(user.id);
  
      // Si l'utilisateur n'a pas bloqué l'expéditeur, envoyez le message
      if (client && !blockedUsers.includes(message.user.id)) {
        client.emit('chat message', newMessage);
      }
    });
  }
  private getClientByUserId(userId: number): Socket | undefined {
    return this.userToSocketMap.get(userId);
  }
}