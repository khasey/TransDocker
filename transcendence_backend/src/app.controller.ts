import { Controller, Get, NotFoundException, Param, Post, UseInterceptors, UploadedFile, Put, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user/user.service';
import { User } from './user/user.entity';

@Controller()
export class AppController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  getHello(): string {
    return 'Hello World!';
  }

  @Get('/user/:id')
  async getUser(@Param('id') userId: string): Promise<User> {
    const parsedUserId = parseInt(userId, 10);
    console.log(parsedUserId);
    const user = await this.userService.findUserById(parsedUserId);
    console.log(user);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Put('/user/:id/image')
  @UseInterceptors(FileInterceptor('image'))
  async updateUserImage(
    @Param('id') userId: string,
    @UploadedFile() images: Express.Multer.File,
    ): Promise<User> {
      console.log('image express =>'+images)
    const parsedUserId = parseInt(userId, 10);
    const imageUrl = `http://localhost:4000/image/${images.filename}`;
    const user = await this.userService.updateUserImage(parsedUserId, imageUrl);
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
}
@Put('/user/:id/username')
async updateUsername(
  @Param('id') userId: string,
  @Body() body,
): Promise<User> {
  const { username } = body;
  const parsedUserId = parseInt(userId, 10);
  const user = await this.userService.updateUsername(parsedUserId, username);
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
}
}
