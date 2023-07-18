import { User } from '../user/user.entity';
export declare class Message {
    id: number;
    sender: number;
    message: string;
    date: Date;
    channelId: number;
    username: string;
    imageUrl: string;
    user: User;
}
