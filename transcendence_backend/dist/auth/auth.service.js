"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const jwt_1 = require("@nestjs/jwt");
const fs = require("fs");
let AuthService = exports.AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async generateJwt(user) {
        const { id, username } = user;
        const payload = { id, username };
        return {
            access_token: this.jwtService.sign(payload)
        };
    }
    async validateUser(id) {
        const user = await this.prisma.user.findUnique({ where: { id: parseInt(id) } });
        return user;
    }
    async enregistrerUtilisateur(data) {
        try {
            const { id, username, imageUrl } = data;
            const utilisateur = await this.prisma.user.upsert({
                where: { id: parseInt(id) },
                update: {
                    username,
                    imageUrl,
                    authentification: true,
                    twoFactorEnabled: false,
                },
                create: {
                    id: parseInt(id),
                    username,
                    imageUrl,
                    authentification: true,
                    twoFactorEnabled: false,
                },
            });
            return utilisateur;
        }
        catch (error) {
            throw new Error(`Erreur lors de l'enregistrement de l'utilisateur : ${error.message}`);
        }
    }
    async updateUserImage(id, image) {
        const user = await this.prisma.user.findUnique({ where: { id: parseInt(id) } });
        if (!user) {
            throw new Error('User not found');
        }
        const imageUrl = `image/${image.originalname}`;
        fs.writeFileSync(imageUrl, image.buffer);
        user.imageUrl = imageUrl;
        await this.prisma.user.update({
            where: { id: parseInt(id) },
            data: user,
        });
        return user;
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_1.PrismaClient,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map