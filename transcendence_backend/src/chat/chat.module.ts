import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './chat.entity';
import { ChatGateway } from './chat.gateway';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    forwardRef(() => UserModule) // Utilisez forwardRef si nécessaire
  ],
  providers: [ChatGateway],
  exports: [TypeOrmModule, ChatGateway],
})
export class ChatModule {}

