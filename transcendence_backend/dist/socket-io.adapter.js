"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIoAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
class SocketIoAdapter extends platform_socket_io_1.IoAdapter {
    constructor(app, isCorsEnabled = false) {
        super(app);
        this.isCorsEnabled = isCorsEnabled;
    }
    createIOServer(port, options) {
        if (this.isCorsEnabled) {
            options.cors = {
                origin: 'http://localhost:3000',
                methods: ['GET', 'POST'],
                allowedHeaders: ['my-custom-header'],
                credentials: true,
            };
        }
        const server = super.createIOServer(port, options);
        return server;
    }
}
exports.SocketIoAdapter = SocketIoAdapter;
//# sourceMappingURL=socket-io.adapter.js.map