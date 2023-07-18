let ball = {
    x: 50,
    y: 50,
    speedX: 0.33,
    speedY: 0.33,
    radius : 5,
  };
  
  let scores = {
    player1Score: 0,
    player2Score: 0,
  };
  
  let paddleWidth = 1; // largeur de la raquette en pourcentage
  let paddleHeight = 10; // hauteur de la raquette en pourcentage
  let paddleGap = 4; // écart entre la raquette et le bord du terrain en pourcentage
  let paddle1Y = 50;
  let paddle2Y = 50;
  let player1SocketId = null;
  let player2SocketId = null;
  let gameInterval = null;
  let connectedPlayers = 0;
  
  function updateScores(newScores) {
    scores = newScores;
    
    console.log('Received scores from the client:');
    console.log('Player 1 Score:', scores.player1Score);
    console.log('Player 2 Score:', scores.player2Score);
  
    return scores;
  }
  
  let waitingQueue = [];

  function assignPlayerId(socket, io) {
    socket.emit('paddleDimensions', {width: paddleWidth, height: paddleHeight, gap: paddleGap});
  
    if (!player1SocketId) {
      player1SocketId = socket.id;
      socket.emit('assignPlayerId', 1);
      connectedPlayers++;
    } else if (!player2SocketId) {
      player2SocketId = socket.id;
      socket.emit('assignPlayerId', 2);
      connectedPlayers++;
    } else {
      // Si déjà 2 joueurs sont connectés, mettre le nouveau joueur dans la file d'attente
      socket.emit('GameFull');
      waitingQueue.push(socket.id);
    }
  
    if (connectedPlayers === 1) {
      socket.emit('waitingForPlayer');
    } else if (connectedPlayers === 2) {
      io.emit('startGame');
      if (gameInterval) clearTimeout(gameInterval);
      gameInterval = setInterval(() => updateGame(io), 20);; // Updates game every 20ms
    } 
  }
  
  
  function handlePaddleMove(data, socket, io) {
    if (socket.id === player1SocketId) {
      paddle1Y = data.y;
      io.emit('paddleMove', { y: paddle1Y, player: 1 });
    } else if (socket.id === player2SocketId) {
      paddle2Y = data.y;
      io.emit('paddleMove', { y: paddle2Y, player: 2 });
    }
  }
  
  function handleDisconnect(socket, io) {
    console.log('Client disconnected');
    connectedPlayers--;
    
    if (socket.id === player1SocketId) {
      player1SocketId = null;
    } else if (socket.id === player2SocketId) {
      player2SocketId = null;
    }
  
    // Si un joueur se déconnecte et qu'il y a des joueurs en attente
    if (waitingQueue.length > 0 && (player1SocketId === null || player2SocketId === null)) {
      let nextPlayerId = waitingQueue.shift();
      
      if (player1SocketId === null) {
        player1SocketId = nextPlayerId;
        io.to(nextPlayerId).emit('assignPlayerId', 1);
      } else if (player2SocketId === null) {
        player2SocketId = nextPlayerId;
        io.to(nextPlayerId).emit('assignPlayerId', 2);
      }
  
      connectedPlayers++;
      
      if (connectedPlayers === 2) {
        io.emit('startGame');
        if (gameInterval) clearTimeout(gameInterval);
        gameInterval = setInterval(() => updateGame(io), 20);
      }
    } else {
      socket.broadcast.emit('playerDisconnected');
    }
    
    if (connectedPlayers < 2 && gameInterval) {
      clearInterval(gameInterval);
      gameInterval = null;
    }
  }
  
  function updateGame(io) {
    // Update ball position
    ball.x += ball.speedX;
    ball.y += ball.speedY;
  
    // Checking for collisions with paddles and updating ball direction
    if (
      ball.x < paddleGap + paddleWidth &&
      ball.y > paddle1Y &&
      ball.y < paddle1Y + paddleHeight &&
      ball.speedX < 0 // Added this condition to prevent continuous collisions
    ) {
      ball.speedX = -ball.speedX;
      ball.x = paddleGap + paddleWidth + 0.5; // Adjusting the ball's x position
    } else if (
      ball.x > 100 - paddleGap - paddleWidth && 
      ball.y > paddle2Y &&
      ball.y < paddle2Y + paddleHeight &&
      ball.speedX > 0 // Added this condition to prevent continuous collisions
    ) {
      ball.speedX = -ball.speedX;
      ball.x = 100 - paddleGap - paddleWidth - 0.5; // Adjusting the ball's x position
    }
  
    // Checking for scores
    if (ball.x < 0) {
      scores.player2Score++;
      resetBall();
    } else if (ball.x > 100) { 
      scores.player1Score++;
      resetBall();
    }
  
    
    // Check for top and bottom wall collisions
    if (ball.y > 100 || ball.y < 0) {
      ball.speedY = -ball.speedY;
    }
  
    io.emit('ballUpdate', ball);
    io.emit('scoresUpdate', scores);
  }
  
  
  function resetBall() {
    ball.x = 50;
    ball.y = 25 + Math.random() * 50;
  
    const randomDirectionX = Math.random() < 0.5 ? -1 : 1;
    const randomDirectionY = Math.random() < 0.5 ? -1 : 1;
  
    ball.speedX = ball.speedX * randomDirectionX;
    ball.speedY = ball.speedX * randomDirectionY;
  }
  
  module.exports = {
    updateScores,
    assignPlayerId,
    handlePaddleMove,
    handleDisconnect,
    updateGame,
  };
  