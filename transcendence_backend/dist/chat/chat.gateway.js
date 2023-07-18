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
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chat_entity_1 = require("./chat.entity");
let ChatGateway = exports.ChatGateway = class ChatGateway {
    constructor(messageRepository) {
        this.messageRepository = messageRepository;
    }
    handleDisconnect(client) {
        console.log(`Client ${client.id} disconnected.`);
        this.server.emit('user disconnected', client.id);
    }
    async handleConnection(client, ...args) {
        const messages = await this.messageRepository.find();
        console.log('les mess => ' + messages);
        client.emit('chat messages', messages);
    }
    async handleMessage(message) {
        const newMessage = new chat_entity_1.Message();
        newMessage.sender = message.user.id;
        newMessage.message = message.text;
        newMessage.date = new Date();
        newMessage.channelId = 1;
        newMessage.user = message.user;
        newMessage.username = message.user.username;
        newMessage.imageUrl = message.user.imageUrl;
        console.log("nm userrrrrrrrrrrrrrrr => " + newMessage.user.username);
        await this.messageRepository.save(newMessage);
        this.server.emit('chat message', newMessage);
        console.log('user => ', newMessage);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: 'chat' }),
    __param(0, (0, typeorm_1.InjectRepository)(chat_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map