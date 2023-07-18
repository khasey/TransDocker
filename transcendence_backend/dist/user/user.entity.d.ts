export declare class User {
    id: number;
    username: string;
    authentification: boolean;
    imageUrl: string;
    twoFactorAuthSecret?: string;
    twoFactorEnabled: boolean;
    chatMessages: any;
    messages: any;
}
