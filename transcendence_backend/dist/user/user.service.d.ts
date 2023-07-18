import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findUserById(userId: number): Promise<User>;
    enableTwoFactorAuth(userId: any): Promise<User | null>;
    disableTwoFactorAuth(userId: any): Promise<User | null>;
    save(user: User): Promise<User>;
    updateUserImage(userId: number, imageUrl: string): Promise<User>;
    updateUsername(userId: number, username: string): Promise<User>;
}
