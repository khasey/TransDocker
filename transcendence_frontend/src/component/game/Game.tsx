import React, {useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import styles from './game.module.css';

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let paddleWidth = 0;  // These are in percentage now
  let paddleHeight = 0; // These are in percentage now
  let paddleGap = 0; // These are in percentage now

  let paddle1Y = 50; // These are in percentage now
  let paddle2Y = 50; // These are in percentage now
  let scores = { player1Score: 0, player2Score: 0 };
  let ball = { x: 0, y: 0, speedX: 0, speedY: 0 };
  let trail: { x: number; y: number }[] = [];
  let upArrowPressed = false;
  let downArrowPressed = false;
  let gameStatus: string | ((arg0: string) => void) | null = null;// Added gameStatus

  

  let playerId: null = null; // Added playerId

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const parentDiv = canvas?.parentElement;

    if (!canvas || !context || !parentDiv) {
      return () => {};
    }

    canvas.width = parentDiv.clientWidth;
    canvas.height = parentDiv.clientHeight;

    const drawPaddle = (x: number, y: number, width: number, height: number, color: string) => {
      context.fillStyle = color;
      context.fillRect(x * canvas.width / 100, y * canvas.height / 100, width * canvas.width / 100, height * canvas.height / 100);
    };
       

    const drawCircle = (x: number, y: number, radius: number, color: string, alpha: number = 1) => {
      context.fillStyle = `rgba(${color}, ${alpha})`;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2, false);
      context.closePath();
      context.fill();
    };

    const drawGame = (ball: { x: number; y: number; speedX: number; speedY: number }, scores: { player1Score: number; player2Score: number }) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawPaddle(paddleGap, paddle1Y, paddleWidth, paddleHeight, 'white');
      drawPaddle(100 - paddleWidth - paddleGap, paddle2Y, paddleWidth, paddleHeight, 'white'); // adjusted for percentage
    
      // Drawing the ball
      context.fillStyle = "white";
      context.beginPath();
      context.arc(ball.x / 100 * canvas.width, ball.y / 100 * canvas.height, 10, 0, Math.PI*2, false); // arbitrary radius of 10
      context.closePath();
      context.fill();
    
      // Drawing the trail
      trail.push({ x: ball.x / 100 * canvas.width, y: ball.y / 100 * canvas.height });
      const trailLength = 15;
      const trailOpacityStep = 1 / trailLength;
    
      for (let i = trail.length - 1; i >= 0; i--) {
        const { x, y } = trail[i];
        const alpha = 0.8 - (trail.length - i) * trailOpacityStep;
    
        drawCircle(x, y, 10, '255, 255, 255', alpha);
    
        if (trail.length - i >= trailLength) {
          break;
        }
      }
    
      if (trail.length > trailLength) {
        trail.splice(0, trail.length - trailLength);
      }
    
      // Drawing the net
      context.fillStyle = 'rgba(255, 255, 255, 0.1)';
      for (let i = 0; i < canvas.height; i += 40) {
        context.fillRect(canvas.width / 2 - 1, i, 2, 20);
      }


      if (gameStatus !== 'Waiting For Player' && gameStatus !== 'Game is full') {
        // Displaying scores
        const fontSize = canvas.width * 0.15;  // 10% of the width of the canvas
        context.font = `600 ${fontSize}px Roboto`;
        
        const scoreText1 = ` ${scores.player1Score}`;
        const scoreText2 = ` ${scores.player2Score}`;
      
        const scoreText1Width = context.measureText(scoreText1).width;
        const scoreText2Width = context.measureText(scoreText2).width;
        context.fillStyle = 'rgba(255, 255, 255, 0.08)';
        context.fillText(scoreText1, (canvas.width - scoreText1Width) / 3.5, canvas.height / 1.70);
        context.fillText(scoreText2, (canvas.width - scoreText2Width) / 1.5, canvas.height / 1.70);
      }
    };

    const socket: Socket = io('http://192.168.1.31:3001/');


    socket.on('waitingForPlayer', () => {
      console.log('Waiting for player to connect...');
      gameStatus = 'Waiting For Player';
      const statusFontSize = canvas.width * 0.10;  // 10% of the width of the canvas
      context.font = `600 ${statusFontSize}px Roboto`;
      const statusText = 'Waiting For Player';
      const statusTextWidth = context.measureText(statusText).width;
      context.fillStyle = 'rgba(255, 255, 255, 0.8)';
      context.fillText(statusText, (canvas.width - statusTextWidth) / 2, canvas.height / 2);
    });
    
    socket.on('startGame', () => {
      console.log('Game started');
      gameStatus = 'Game Started';
    });
    
    socket.on('gameFull', () => {
      console.log('Game is full');
      gameStatus = 'Game is full';
      const statusFontSize = canvas.width * 0.10;  // 10% of the width of the canvas
      context.font = `600 ${statusFontSize}px Roboto`;
      const statusText = 'Game is full';
      const statusTextWidth = context.measureText(statusText).width;
      context.fillStyle = 'rgba(255, 255, 255, 0.8)';
      context.fillText(statusText, (canvas.width - statusTextWidth) / 2, canvas.height / 2);
    });

    socket.on('assignPlayerId', (id: null) => {
      playerId = id;
    });

    socket.on('paddleDimensions', (data: { width: number; height: number; gap: number; }) => {
      paddleWidth = data.width;
      paddleHeight = data.height;
      paddleGap = data.gap;
    });

    socket.on('paddleMove', (data: { player: number; y: number; }) => {
      if (data.player === 1) {
        paddle1Y = data.y;
      } else if (data.player === 2) {
        paddle2Y = data.y;
      }
    });

    socket.on('ballUpdate', (updatedBall: { x: number; y: number; speedX: number; speedY: number; }) => {
      ball = updatedBall;
      drawGame(ball, scores);
    });

    socket.on('scoresUpdate', (updatedScores: { player1Score: number; player2Score: number; }) => {
      scores = updatedScores;
      drawGame(ball, scores);
    });

    socket.on('message', (message: any) => {
      console.log(message); // Vous pouvez afficher le message dans la console ou l'afficher dans votre interface utilisateur
      const statusFontSize = canvas.width * 0.05;  // 5% of the width of the canvas
      context.font = `600 ${statusFontSize}px Roboto`;
      const statusText = message;
      const statusTextWidth = context.measureText(statusText).width;
      context.fillStyle = 'rgba(255, 255, 255, 0.8)';
      context.fillText(statusText, (canvas.width - statusTextWidth) / 2, canvas.height / 2);
    });
    

    const handleKeyDown = (event: KeyboardEvent) => {
      let paddleY = 0;
      if (event.key === 'ArrowUp') {
        upArrowPressed = true;
        if (playerId === 1) {
          paddle1Y -= 1;
          paddleY = paddle1Y;
        } else if (playerId === 2) {
          paddle2Y -= 1;
          paddleY = paddle2Y;
        }
        paddleY = Math.max(Math.min(paddleY, 100 - paddleHeight), 0);
        socket.emit('paddleMove', { y: paddleY, player: playerId });
      } else if (event.key === 'ArrowDown') {
        downArrowPressed = true;
        if (playerId === 1) {
          paddle1Y += 1;
          paddleY = paddle1Y;
        } else if (playerId === 2) {
          paddle2Y += 1;
          paddleY = paddle2Y;
        }
        paddleY = Math.max(Math.min(paddleY, 100 - paddleHeight), 0);
        socket.emit('paddleMove', { y: paddleY, player: playerId });
      }
    };
      
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        upArrowPressed = false;
      } else if (event.key === 'ArrowDown') {
        downArrowPressed = false;
      }
      
      // Only emit paddle move if arrow up or down is released
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        let paddleY = playerId === 1 ? paddle1Y : paddle2Y;
        socket.emit('paddleMove', { y: paddleY, player: playerId });
      }
    };
    
    

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    const handleUnload = () => {
      socket.emit('disconnect'); // Informe le serveur que le joueur se déconnecte
    };

    window.addEventListener('unload', handleUnload);

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    window.removeEventListener('unload', handleUnload);
    socket.disconnect(); // Déconnecte le socket du serveur
  };

}, []);

  return (
    <div className={styles.all}>
      <div className={styles.game}>
        <canvas ref={canvasRef} id="pong" />
      </div>
    </div>
  );
};

export default Game;
