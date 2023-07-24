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
	ownerId: string[];
	adminId: string[];  // new field to keep track of admins
	bannedUsers: string[];
	kickedUser: string;  // new field to keep track of banned users
	mutedUsers: string[];  // new field to keep track of muted users
	muteEndTime: {[userId: string]: number} // a mapping of user ids to end time of their mute
	// add more properties if needed
  };

interface User {
  id: number;
  username: string;
  imageUrl: string;
  // Ajoutez d'autres champs nécessaires ici
}

export default function Backdrop() {
  const [state, setState] = useState<{ right: boolean }>({ right: false });
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const [latestChannel, setLatestChannel] = useState<Channel | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedchannel, setSearchedChannel] = useState<Channel | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [ownerId, setOwnerId] = useState<Channel| null>(null);
  const [userOwnerId, setUserOwnerId] = useState<User | null>(null);


  // ====================================== User actuel recuperation =======================================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<User>('http://localhost:4000/user', { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
      }
    };

    fetchUser();
  }, []);

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

	// ====================================== Autocomplete for @ =======================================

const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;

  let usersData: { id: number; username: string }[] = [];

  if (value.startsWith('@')) {
    try {
      const response = await axios.get('http://localhost:4000/username/id');
      usersData = response.data;
	  console.log('userdata ===>>>.'+usersData)

      const filteredUsernames = usersData.map(user => user.username)
        .filter(username => username.toLowerCase().startsWith(value.substring(1).toLowerCase()));

      setAutocompleteOptions(filteredUsernames);
    } catch (error) {
      console.error('Erreur lors de la récupération des usernames', error);
    }
  } else {
    setAutocompleteOptions([]);
  }

  setInputValue(value);

  	// =============================== ADMIN =================================\\

	const usernameToSetAdmin = value.substring(1, value.indexOf('/setadmin')).trim();
	const userIdToSetAdmin = usersData.find(user => user.username === usernameToSetAdmin)?.id;

	if (userIdToSetAdmin) {
	  const responseGet = await axios.get(`http://localhost:4000/channels/${selectedChannel?.name}`);
	  const currentAdmins = responseGet.data.admins; // Assurez-vous que c'est le bon chemin pour accéder à la liste des administrateurs
	  const currentOwner = responseGet.data.owner;
	  const currentMenber = responseGet.data.members;
		// Vérifie si l'utilisateur que l on veut promot admin est membre du channel
	  if (!currentMenber.includes(userIdToSetAdmin)) {
		console.error("Erreur : L'utilisateur doit etre membre du channel pour devenir admin");
		return;
	  }
	  // Vérifie si l'utilisateur actuel est un administrateur
	  if (currentAdmins.includes(userIdToSetAdmin)) {
		console.error("Erreur : L'utilisateur est deja admin");
		return;
	  }
	  // Vérifie si l'utilisateur actuel est owner
	  if(!currentOwner.includes(user?.id)){
		console.error("Erreur : vous n avais pas le droit de promote un user to admin")
		return;
	}
	  // Ajouter le nouvel administrateur à la liste
	  const updatedAdmins = [...currentAdmins, userIdToSetAdmin];
	  try {
		const response = await axios.put(`http://localhost:4000/channels/${selectedChannel?.name}/admins`, {
		  admins: updatedAdmins, /// <===== Salope
		});

		if (response.status === 200) {
		  console.log(response.data.message);
		} else {
		  console.error('Erreur lors de l\'attribution du rôle d\'admin');
		}
	  } catch (error) {
		console.error('Erreur lors de l\'attribution du rôle d\'admin', error);
	  }
	}
	// =============================== BAN =================================\\
	const usernameToBan = value.substring(1, value.indexOf('/ban')).trim();
	const userIdToBan = usersData.find(user => user.username === usernameToBan)?.id;

	if (userIdToBan && value.includes('/ban')) {
	  const responseGet = await axios.get(`http://localhost:4000/channels/${selectedChannel?.name}`);
	  const currentAdmins = responseGet.data.admins; // Assurez-vous que c'est le bon chemin pour accéder à la liste des administrateurs
	  const currentOwner = responseGet.data.owner;
	  const currentMenber = responseGet.data.members;
	  const currentBanned = responseGet.data.banned;
		// Vérifie si l'utilisateur que l on veut bannir est membre du channel
	//   if (!currentMenber.includes(userIdToBan)) {
	// 	console.error("Erreur : L'utilisateur doit etre membre du channel pour le bannir");
	// 	return;
	//   }
	//   // Vérifie si l'utilisateur actuel est un administrateur
	//   if (!currentAdmins.includes(user?.id)) {
	// 	console.error("Erreur : vous devez être un administrateur pour bannir un utilisateur");
	// 	return;
	//   }
	//   // Vérifie si l'utilisateur à bannir est le propriétaire du channel
	//   if (currentOwner.includes(userIdToBan)) {
	// 	console.error("Erreur : Vous ne pouvez pas bannir le propriétaire du channel");
	// 	return;
	//   }
	//   const updatedbanned = [...bannedUsers, userIdToBan];
	  // Bannir l'utilisateur
	  try {
		const response = await axios.put(`http://localhost:4000/channels/${selectedChannel?.name}/ban`, {
		  banned: userIdToBan,
		  banneur: user?.id
		});

		if (response.status === 200) {
		  console.log(response.data.message);
		} else {
		  console.error('Erreur lors du bannissement de l\'utilisateur');
		}
	  } catch (error) {
		console.error('Erreur lors du bannissement de l\'utilisateur', error);
	  }
	}
	// =============================== KICK =================================\\
	const usernameToKick = value.substring(1, value.indexOf('/kick')).trim();
	const userIdToKick = usersData.find(user => user.username === usernameToKick)?.id;

	if (userIdToKick) {
  	const responseGet = await axios.get(`http://localhost:4000/channels/${selectedChannel?.name}`);
  	const currentAdmins = responseGet.data.admins; // Assurez-vous que c'est le bon chemin pour accéder à la liste des administrateurs
  	const currentOwner = responseGet.data.owner;
  	const currentMembers = responseGet.data.members;

	console.log('user to kick ===>>>' + userIdToKick)
  	// Vérifie si l'utilisateur que l'on veut kicker est membre du channel
  	if (!currentMembers.includes(userIdToKick)) {
    	console.error("Erreur : L'utilisateur doit etre membre du channel pour être kické");
    	return;
  	}
  	// Vérifie si l'utilisateur actuel est un administrateur
  	if (!currentAdmins.includes(user?.id)) {
    	console.error("Erreur : vous devez être un administrateur pour kicker un utilisateur");
    	return;
  	}
  // Vérifie si l'utilisateur à kicker est le propriétaire du channel
  	if (currentOwner.includes(userIdToKick)) {
    	console.error("Erreur : Vous ne pouvez pas kicker le propriétaire du channel");
    	return;
  	}
  	// Kicker l'utilisateur
  	try {

    	const response = await axios.put(`http://localhost:4000/channels/${selectedChannel?.name}/kick`, {
			idToKick: userIdToKick,
    	});

    if (response.status === 200) {
      console.log(response.data.message);
    } else {
      console.error('Erreur lors du kick de l\'utilisateur');
    }
  } catch (error) {
    console.error('Erreur lors du kick de l\'utilisateur', error);
  }
}

	// =============================== MUTE =================================\\
	const usernameToMute = value.substring(1, value.indexOf('/mute')).trim();
	const userIdToMute = usersData.find(user => user.username === usernameToMute)?.id;

	if (userIdToMute) {
  	const responseGet = await axios.get(`http://localhost:4000/channels/${selectedChannel?.name}`);
  	const currentAdmins = responseGet.data.admins; // Assurez-vous que c'est le bon chemin pour accéder à la liste des administrateurs
  	const currentOwner = responseGet.data.owner;
  	const currentMembers = responseGet.data.members;

	console.log('user to mute ===>>>' + userIdToMute)
  	// Vérifie si l'utilisateur que l'on veut muter est membre du channel
  	if (!currentMembers.includes(userIdToMute)) {
    	console.error("Erreur : L'utilisateur doit etre membre du channel pour être muté");
    	return;
  	}
  	// Vérifie si l'utilisateur actuel est un administrateur
  	if (!currentAdmins.includes(user?.id)) {
    	console.error("Erreur : vous devez être un administrateur pour muter un utilisateur");
    	return;
  	}
  // Vérifie si l'utilisateur à Muter est le propriétaire du channel
  	if (currentOwner.includes(userIdToMute)) {
    	console.error("Erreur : Vous ne pouvez pas muter le propriétaire du channel");
    	return;
  	}
  	// Muter l'utilisateur
  	try {

    	const response = await axios.put(`http://localhost:4000/channels/${selectedChannel?.name}/mute`, {
			muted: userIdToMute,
			muteur: user?.id
    	});

    if (response.status === 200) {
      console.log(response.data.message);
    } else {
      console.error('Erreur lors du mute de l\'utilisateur');
    }
  } catch (error) {
    console.error('Erreur lors du mute de l\'utilisateur', error);
  }
}



}

  const handleAutocompleteClick = (username : string) => {
		// Met à jour la valeur du champ de saisie avec le nom sélectionné (en ajoutant "@" au début)
		setInputValue(`@${username}`);
		setAutocompleteOptions([]); // Réinitialise la liste des suggestions
	  };

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
					  <div className={styles.enter_text}>
					  {autocompleteOptions.map((option) => (
								<div key={option}
									onClick={() => handleAutocompleteClick(option)}
									>
									{option}
								  </div>
								  ))}
								<input
								type="text"
								value={inputValue}
								onChange={handleInputChange}
									/>
								{/* Suggestions */}

							  </div>
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