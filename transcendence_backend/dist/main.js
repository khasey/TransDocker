"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const socket_io_adapter_1 = require("./socket-io.adapter");
const fs_1 = require("fs");
const path = require('path');
async function bootstrap() {
    dotenv.config();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cookieParser());
    app.enableCors({
        origin: 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.use('/image/:imageName', (req, res) => {
        const imageName = req.params.imageName;
        const imagePath = path.join(__dirname, '..', 'images', imageName);
        if ((0, fs_1.existsSync)(imagePath)) {
            const image = (0, fs_1.readFileSync)(imagePath);
            res.end(image);
        }
        else {
            res.status(404).json({ message: 'image not found' });
        }
    });
    app.useWebSocketAdapter(new socket_io_adapter_1.SocketIoAdapter(app, true));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    await app.listen(4000);
}
bootstrap();
//# sourceMappingURL=main.js.map