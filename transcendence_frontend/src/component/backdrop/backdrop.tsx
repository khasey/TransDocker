import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import styles from './backdrop.module.css';
import FullChannel from './FullChannel';
import EnterText from './EnterText';
import TextSend from './TextSend';
import { useEffect, useState, useRef } from 'react';
import { ChatContext, Message } from './ChatContext';
import { FriendsOnline } from './FriendsOnline';
import io, { Socket } from 'socket.io-client';
import { User } from '../../../../transcendence_backend/src/user/user.entity';
import { current } from '@reduxjs/toolkit';

type Anchor = 'right';

export default function Backdrop() {
  const [state, setState] = useState<{ right: boolean }>({ right: false });
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:4000/chat');

    socketRef.current = socket;
    socket.on('chat message', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('chat messages', (messages: Message[]) => {
      setMessages(messages);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  console.log('messages in Backdrop:', messages);

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  return (
    <ChatContext.Provider value={{ messages, setMessages ,user:null}}>
      <div>
        {(['right'] as const).map((anchor) => (
          <React.Fragment key={anchor}>
            <Button
              onClick={toggleDrawer(anchor, true)}
              sx={{
                marginLeft: '-20%',
                fontSize: '12px',
                fontWeight: '600',
                color: '#ffffff6b',
                '@media screen and (width < 1000px)': {
                  fontSize: '8px',
                  marginLeft: '-35%',
                  marginTop: '5%',
                },
                '&:hover': {
                  color: '#f0f8ff',
                },
              }}
            >
              CHAT
            </Button>
            <SwipeableDrawer
              anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
              onOpen={toggleDrawer(anchor, true)}
            >
              <Box
                className="inside_chat"
                sx={{
                  width: '500px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: 'black',
                  '@media screen and (width < 1500px)': {
                    width: '350px',
                  },
                }}
              >
                <FriendsOnline />
                <div className={styles.channel_tchat}>
                  <div className={styles.title}>
                    <FullChannel />
                  </div>
                  <div className={styles.tchat}>
                    <div className={styles.textsendermodule}>
                      {messages.map((message) => (
                        <TextSend
                        message={message}
                        user={message.user}
                        id={message.id}
                        />
                      ))}
                    </div>
                  </div>
                  <div className={styles.enter_text}></div>
                  {socketRef.current ? (
                    <EnterText socket={socketRef.current} />
                  ) : null}
                </div>
              </Box>
            </SwipeableDrawer>
          </React.Fragment>
        ))}
      </div>
    </ChatContext.Provider>
  );
}
