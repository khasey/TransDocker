const { Server } = require("socket.io");
const Game = require('./game');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});


function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  const games = {};

  function getGames() {
    const gameInfos = {};
    for (let gameId in games) {
      const game = games[gameId];
      gameInfos[gameId] = {
        gameId: game.gameId,
        mode: game.mode,
        player1ID: game.player1ID,
        player2ID: game.player2ID,
        scores: game.scores,
      };
    }
    return gameInfos;
  }

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('getAllGames', () => {
      socket.emit('gamesData', getGames());
    });


    socket.on('joinRoomSpec', (data) => {
      if(!data || typeof data.gameId === 'undefined' || typeof data.ID42 === 'undefined') {
          console.log('Invalid data received');
          return;
      }
      const { gameId , ID42 } = data;
      console.log('variable ID42 reçue: ', ID42);
      console.log('variable gameId reçue: ', gameId);
      const game = games[gameId];
      if (game) {
        game.assignSpectatorId(socket, io, ID42);
        socket.join(gameId);
        socket.gameId = gameId;
        socket.emit('gameJoined', {
          gameId,
          ballStart: game.ball,
          scoresStart: game.scores
        });
        console.log(`Spectator joined game with ID: ${gameId}`);
      } else {
        console.log('Game not found');
        return;
      }
  });  
        
    socket.on('createGame', ({ userId, ID42, mode }) => {
      console.log('variable mode reçue: ', mode);
      // Cherche une partie existante avec des places libres
      for (let gameId in games) {
        const game = games[gameId];
        if (game.connectedPlayers < game.maxPlayers && game.mode === mode) {
          game.assignPlayerId(socket, io, userId);
          game.player2ID = ID42;
          console.log(`Player 2 ID set: ${game.player2ID}`);
          socket.join(gameId);
          socket.gameId = gameId;
          socket.emit('gameJoined', {
            gameId,
            ballStart: game.ball,
            scoresStart: game.scores
          });
          console.log(`Player joined game with ID: ${gameId}`);
          if (game.connectedPlayers === game.maxPlayers) {
            io.to(gameId).emit('gameReady');
          }
          io.emit('gamesData', getGames());       
          return;
        }
      }
      // Crée une partie si pas d'existante avec des places libres
      const gameId = Math.random().toString(36).substring(2, 7); // Génère un id de jeu unique
      const game = new Game(gameId, mode);
      game.assignPlayerId(socket, io, userId);
      if (game.connectedPlayers < game.maxPlayers) { // Vérifier si le jeu a déjà le nombre maximal de joueurs
        games[gameId] = game;
        game.player1ID = ID42;
        console.log(`Player 1 ID set: ${game.player1ID}`);
        socket.join(gameId);
        socket.gameId = gameId;  // Save the gameId to the socket
        socket.emit('gameCreated', { gameId });
        console.log(`Game created with ID: ${gameId}`);
      } else {
        socket.emit('error', { message: 'Game is broken' });
      }
    });
  
    // // Sera utile quand une demande de jeu est reçue de la part d'un joueur
    // socket.on('joinGame', ({ gameId, userId }) => {
    //   if (games[gameId]) {
    //     const game = games[gameId];
    //     if (game.connectedPlayers < game.maxPlayers) { // Vérifier si le jeu a déjà le nombre maximal de joueurs
    //       socket.join(gameId);
    //       socket.gameId = gameId;  // Save the gameId to the socket
    //       console.log(`Player joined game with ID: ${gameId}`);
    //       game.assignPlayerId(socket, io, userId);
    //       socket.emit('gameJoined', { 
    //         gameId,
    //         ballStart: game.ball,
    //         scoresStart: game.scores
    //       });
    //     } else {
    //       socket.emit('error', { message: 'Game is full' });
    //     }
    //   } else {
    //     socket.emit('error', { message: 'Invalid game ID' });
    //   }
    // });
  
    socket.on('saveGameData', (gameData) => {
      const game = games[gameData.roomId];
      const score = `${game.scores.player1Score} - ${game.scores.player2Score}`;
      prisma.game.create({
        data: {
          user1Id: game.player1ID,
          user2Id: game.player2ID,
          score: score,
          match_date: new Date(),
          mode: game.mode,
        }
      })
      .then(response => {
        console.log('Game data saved successfully:', response);
      })
      .catch(error => {
        console.error('Failed to save game data:', error);
      });      
    });  

    // Les autres gestionnaires d'événements doivent maintenant prendre en compte l'ID du jeu
    socket.on('paddleMove', (data) => {
      const game = games[data.gameId];
      if (game) {
        game.handlePaddleMove(data, socket, io);
      }
    });    

    socket.on('reconnect', ({ userId, gameId }) => {
      const game = games[gameId];
      if (game) {
        game.handleReconnect(socket, io, userId);
      }
    });

    socket.on('timeout', () => {
      if (games[socket.gameId]) {
        games[socket.gameId].handleTimeout(socket, io);
      }
    });
    
    socket.on('disconnect', () => {
      // Pas besoin de boucler sur tous les jeux maintenant
      if (games[socket.gameId]) {
        games[socket.gameId].handleDisconnect(socket, io);
    
        // Supprimer le jeu de l'objet `games` si tous les joueurs sont déconnectés
        if (games[socket.gameId].connectedPlayers === 0) {
          delete games[socket.gameId];
        }
      }
      io.emit('gamesData', getGames());
    });

    socket.on('playerDisconnected', () => {
      socket.emit('message', 'Un joueur s\'est déconnecté. Il ne reste qu\'un joueur en jeu.');
    });
  });
}

module.exports = initSocket;