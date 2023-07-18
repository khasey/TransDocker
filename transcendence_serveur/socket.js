const { Server } = require("socket.io");
const { 
  assignPlayerId,
  handlePaddleMove,
  handleDisconnect,
  updateGame,
} = require('./game');

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected');

    assignPlayerId(socket, io);

    socket.on('paddleMove', (data) => handlePaddleMove(data, socket, io));
    
    socket.on('disconnect', () => handleDisconnect(socket, io));

    socket.on('playerDisconnected', () => {
      socket.emit('message', 'Un joueur s\'est déconnecté. Il ne reste qu\'un joueur en jeu.');
    });
  });
}


module.exports = initSocket;
