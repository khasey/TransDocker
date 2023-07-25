import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './chat.entity';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [ChatGateway],
  exports: [TypeOrmModule, ChatGateway], // Exportez ChatGateway si nécessaire
})
export class ChatModule {}
