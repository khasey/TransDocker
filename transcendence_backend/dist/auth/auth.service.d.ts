/// <reference types="multer" />
import { PrismaClient, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaClient, jwtService: JwtService);
    generateJwt(user: any): Promise<{
        access_token: string;
    }>;
    validateUser(id: string): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        authentification: boolean;
        imageUrl: string;
        twoFactorEnabled: boolean;
        twoFactorAuthSecret: string;
        username: string;
    }, unknown> & {}>;
    enregistrerUtilisateur(data: any): Promise<import("@prisma/client/runtime").GetResult<{
        id: number;
        authentification: boolean;
        imageUrl: string;
        twoFactorEnabled: boolean;
        twoFactorAuthSecret: string;
        username: string;
    }, unknown> & {}>;
    updateUserImage(id: string, image: Express.Multer.File): Promise<User>;
}
