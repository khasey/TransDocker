/// <reference types="multer" />
import { UserService } from './user/user.service';
import { User } from './user/user.entity';
export declare class AppController {
    private readonly userService;
    constructor(userService: UserService);
    getHello(): string;
    getUser(userId: string): Promise<User>;
    updateUserImage(userId: string, images: Express.Multer.File): Promise<User>;
    updateUsername(userId: string, body: any): Promise<User>;
}
