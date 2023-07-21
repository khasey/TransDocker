import React, { useState, useEffect, useRef } from 'react';
import styles from './EnterText.module.css';
import SendIcon from '@mui/icons-material/Send';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import CreateChannelButton from './CreateChannelButton';
import { current } from '@reduxjs/toolkit';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface EnterTextProps {
  socket: Socket;
}

type User = {
  username: string;
  imageUrl: string;
  id: number;
  // ajouter ici d'autres propriétés selon les besoins
};

type Channel = {
  id: number;
  name: string;
  // ajouter ici d'autres propriétés selon les besoins
};

const EnterText: React.FC<EnterTextProps> = ({ socket }) => {
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [latestChannel, setLatestChannel] = useState<Channel | null>(null);

  useEffect(() => {
    const fetchLatestChannel = async () => {
      try {
        const response = await axios.get<Channel, any>('http://localhost:4000/channels/latest', { withCredentials: true });
        console.log('Server response:', response);
        setLatestChannel(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du dernier canal :', error);
      }
    };

    fetchLatestChannel();
  }, []);

  const socketRef = useRef<Socket>();
  console.log('Latest channel:', latestChannel);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<User, any>('http://localhost:4000/user', { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
      }
    };

    fetchUser();
  }, []);


  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      send();
    }
  };

  const handleClick = () => {
    send();
  };

  console.log('latest id =>'+latestChannel?.id)
  console.log('latest name =>'+latestChannel?.name)
  const send = () => {
    if (latestChannel) {
      socket.emit('chat message', { text: message, user: user, channelId: latestChannel.id });
      console.log(`Message sent '${message}' from '${user?.username}' to channel '${latestChannel.name}'`);
      setMessage('');
    } else {
      console.error('No channel available');
    }
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.input}>
        <input
          type="text"
          placeholder="Enter your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </div>
      <CreateChannelButton/>
      <button className={styles.send_text} onClick={handleClick}>
        <SendIcon />
      </button>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          This is a success message!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EnterText;
