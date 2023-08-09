import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ChatModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService] // exportez seulement UserService
})
export class UserModule {}
