// user.module.ts
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

// Module (user.module.ts) : Il s'agit d'une façon d'organiser 
// votre code en sections distinctes. Chaque module est responsable 
// d'une fonctionnalité distincte de votre application. Dans votre cas, 
// le module User s'occuperait de tout ce qui concerne les utilisateurs. 
// Le module importera et regroupera le contrôleur, le service et l'entité.

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService] // si vous voulez utiliser ce service dans d'autres modules
})
export class UserModule {}
