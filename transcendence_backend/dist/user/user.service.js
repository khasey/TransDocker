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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
let UserService = exports.UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findUserById(userId) {
        const options = {
            where: { id: userId },
        };
        return this.userRepository.findOneOrFail(options);
    }
    async enableTwoFactorAuth(userId) {
        const user = await this.userRepository.findOne(userId);
        if (user) {
            user.twoFactorEnabled = true;
            await this.userRepository.save(user);
        }
        return user;
    }
    async disableTwoFactorAuth(userId) {
        const user = await this.userRepository.findOne(userId);
        if (user) {
            user.twoFactorEnabled = false;
            await this.userRepository.save(user);
        }
        return user;
    }
    async save(user) {
        return await this.userRepository.save(user);
    }
    async updateUserImage(userId, imageUrl) {
        const user = await this.findUserById(userId);
        user.imageUrl = imageUrl;
        console.log(' user service user.img ====>' + user.imageUrl);
        await this.userRepository.save(user);
        return user;
    }
    async updateUsername(userId, username) {
        const user = await this.findUserById(userId);
        console.log(' user service user ====>' + user);
        if (!user) {
            console.log('User not found');
        }
        user.username = username;
        console.log(' user service user.username ====>' + user.username);
        await this.userRepository.save(user);
        return user;
    }
};
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map