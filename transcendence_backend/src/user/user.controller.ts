import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';


@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  // ===== Récupérer la liste des utilisateurs =====
@Get('users')
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }


// ===== Récupérer la liste des usernames =====
@Get('username')
async getAllUsernames(): Promise<string[]> {
  return this.userService.getAllUsernames();
}

 // ===== Récupérer la liste des usernames pour l'autocomplétion =====
  @Get('autocomplete/:query') // <=== Un doute sur l'utilité de ce get
  async getAutocompleteUsernames(@Param('query') query: string) {
    return this.userService.getAutocompleteUsernames(query);
  }

  @Get('users/username/id')
async getAllUsernamesId(): Promise<{ id: number; username: string }[]> {
  return this.userService.getAllUsernamesId();
}

// UserController

@Put('users/:userId/friends') 
  async addFriend(@Param('userId') userId: number, @Body() body): Promise<User> {
      const { friendId } = body;
      return this.userService.addFriend(userId, friendId);
  }

 


}