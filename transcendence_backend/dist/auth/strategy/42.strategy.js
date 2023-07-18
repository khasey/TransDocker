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
exports.FortyTwoStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const passport_42_1 = require("passport-42");
let FortyTwoStrategy = exports.FortyTwoStrategy = class FortyTwoStrategy extends (0, passport_1.PassportStrategy)(passport_42_1.Strategy, '42') {
    constructor() {
        super({
            clientID: 'u-s4t2ud-e7daa1cd3988c5b32348c2167317904d6f19afe7e320406b93f59ba17da0785a',
            clientSecret: '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',
            callbackURL: 'http://localhost:4000/login/callback',
            scope: 'public',
        });
    }
    async validate(accessToken, refreshToken, profile, done) {
        var _a;
        const { id, username, emails } = profile;
        const rawResponse = JSON.parse(profile._raw);
        const imageUrl = ((_a = rawResponse.image) === null || _a === void 0 ? void 0 : _a.link) || null;
        const user = {
            imageUrl,
            accessToken,
            refreshToken,
            id,
            username,
            emails,
        };
        console.log('user =', user);
        done(null, user);
    }
};
exports.FortyTwoStrategy = FortyTwoStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FortyTwoStrategy);
//# sourceMappingURL=42.strategy.js.map