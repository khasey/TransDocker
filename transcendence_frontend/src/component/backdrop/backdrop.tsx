"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import styles from './backdrop.module.css';
import FullChannel from './FullChannel';
import EnterText from './EnterText';
import TextSend from './TextSend';
import { useEffect, useState, useRef, useContext } from 'react';
import { ChatContext, Message } from './ChatContext';
import { FriendsOnline } from './FriendsOnline';
import io, { Socket } from 'socket.io-client';
import { current } from '@reduxjs/toolkit';
import { BottomNavigation } from '@mui/material';
import { log } from 'console';
import { MenuCC } from './MenuCC';
import axios from 'axios';

type Anchor = 'right';

type Channel = {
  id: number;
  name: string;
  // ajouter ici d'autres propriétés selon les besoins
};

export default function Backdrop() {
  const [state, setState] = useState<{ right: boolean }>({ right: false });
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const [latestChannel, setLatestChannel] = useState<Channel | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedchannel, setSearchedChannel] = useState<Channel | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

// ====================================== Latest Channel =======================================
  // useEffect(() => {
  //   const fetchLatestChannel = async () => {
  //     try {
  //       const response = await axios.get<Channel, any>('http://localhost:4000/channels/latest', { withCredentials: true });
  //       console.log('Server response:', response);
  //       setLatestChannel(response.data);
  //       console.log('latestchannel =>>>>'+latestChannel?.id);
  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error('Erreur lors de la récupération du dernier canal :', error);
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchLatestChannel();
  // }, [refreshKey]);

// ====================================== Channel recherche par l utilisateur =======================================  
useEffect(() => {
  const fetchSearchedChannel = async () => {
    if (searchedchannel) {  // Assurez-vous que searchedchannel n'est pas null
      try {
        const response = await axios.get<Channel, any>(`http://localhost:4000/channels/${searchedchannel.name}`, { withCredentials: true });
        console.log('Server response:', response);
        setSearchedChannel(response.data);
        console.log('backdrop => searchedchannel =>>>>'+ searchedchannel.id);
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération du canal recherché :', error);
        setIsLoading(false);
      }
    }
  };

  fetchSearchedChannel();
}, [searchedchannel]);  // Les effets se déclencheront chaque fois que searchedchannel changera


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

    // console.log("setrefresh =>"+setRefreshKey)
    // console.log("refresh =>"+refreshKey)
    console.log('selectedchannel =>>>>>'+ selectedChannel?.id);
    

  return (
    <ChatContext.Provider value={{ messages, setMessages ,user:null ,refreshKey, setRefreshKey, searchedchannel:null, setSearchedChannel, selectedChannel, setSelectedChannel }}>
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
              sx={{ height:'100vh'}}
            >
              <div className={styles.inside_chat}>
                <FriendsOnline />
                <div className={styles.channel_tchat}>
                  <div className={styles.title}>
                    <FullChannel />
                  </div>
                  <div className={styles.tchat}>
                    <div className={styles.textsendermodule}>
                    {messages.filter(message => Number(message.channelId) === selectedChannel?.id).map((message) => (
                    <TextSend
                      message={message}
                      // user={message.user}
                      // id={message.id}
                        />
                      ))}
                    </div>
                  </div>
                  <div className={styles.enter_text}></div>
                  {socketRef.current ? (
                    <EnterText socket={socketRef.current}/>
                  ) : null}
                </div>
              </div>
            </SwipeableDrawer>
          </React.Fragment>
        ))}
      </div>
    </ChatContext.Provider>
  );
}
