import axios, { AxiosError } from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from './ChatContext';

interface MenuCCProps {
  handleClose: () => void;
}

interface User {
	id: number;
	username: string;
	imageUrl: string;
	// Ajoutez d'autres champs nécessaires ici
}

export const MenuCC: React.FC<MenuCCProps> = ({ handleClose }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isprivate, setIsPrivate] = useState(false);
  const [searchedchannel, setSearchedchannel] = useState('');

  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('setRefreshKey is undefined, please check your context provider');
  }
  const { setRefreshKey } = context;

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


  async function handleCreateChannel(name: string, password?: string, userId?: number, isprivate?: boolean) {
    try {
      const response = await fetch('http://localhost:4000/channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          password,
          userId,
          isprivate,
        }),
      });

      console.log('user ID => ' + userId);
      console.log('private =>'+ isprivate);
      console.log('channel =>'+ searchedchannel);

      if (response.ok) {
        const channel = await response.json();
        console.log('Channel created:', channel);
        handleClose(); // Fermer les div après la création du channel
        setRefreshKey(Date.now());
      } else {
        console.error('Error creating channel:', response.statusText);
      }
    } catch (error: any) {
      console.error('Error creating channel:', error.message);
    }
  }

  async function checkChannelExists(searchedChannel: string) {
    try {
      const response = await axios.get(`http://localhost:4000/channels/${searchedChannel}`);
      // Si la réponse contient des données, cela signifie que le canal existe.
      console.log("true");
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 404) {
        console.log("false");
      } else {
        console.error('Erreur lors de la vérification de l\'existence du canal :', error);
      }
    }
  }
  
  

  const handleClickCreate = async () => {
    try {
      await checkChannelExists(searchedchannel);
      await handleCreateChannel(name, password, user?.id, isprivate);
    } catch (error: any) {
      console.error('Error creating channel:', error.message);
    }
  };

  const handleClickSearch = async () => {
    try {
      await checkChannelExists(searchedchannel);
    } catch (error: any) {
      console.error('Error creating channel:', error.message);
    }
  };


  return (
    <div className="container"
    style={{
        width:'75%',
        height:'150px',
        backgroundColor:'black',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
        position:'absolute',
        top:'77%',
        right:'10%',
        borderRadius:'15px',
    }}>
        <div className="inputs"
        style={{
            width:'100%',
            height:'100%',
            display:'flex',
            flexDirection:'column',
            alignItems:'flex-start',
            justifyContent:'center',
            gap:'10px',
            borderRadius:'20px',
            marginLeft:'10px',
        }}>
          <div className="input_channel" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                <p style={{color:'white', fontSize:'10px'}}>Search a channel:</p>
                <input type="text" 
                value={searchedchannel} 
                onChange={(e) => setSearchedchannel(e.target.value)} 
                style={{width:'130px', marginLeft:'10px'}}
                />
            </div>
            <p style={{color:'white'}}>======================</p>
            <div className="input_name" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                <p style={{color:'white', fontSize:'10px'}}>Channel name:</p>
                <input type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                style={{width:'130px', marginLeft:'10px'}}
                />
            </div>
            <div className="private" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                <p style={{color:'white', fontSize:'10px'}}>Private:</p>
                <input 
                type="checkbox" 
                style={{marginLeft:'10px'}}
                onChange={(e) => setIsPrivate(e.target.checked)}
                />
            </div>
            <div className="input_password" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
            <p style={{color:'white', fontSize:'10px'}}>Password:</p>
            <input type="text" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{width:'130px', marginLeft:'10px'}}
            />
            </div>

        </div>
        <div className="button"
        style={{
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          flexDirection:'column',
          width:'50%',
          height:'100%',
        }}
        >
        <button
        style={{
            width:'100%',
            height:'100%',
            borderRadius:'15px',

        }} onClick={handleClickSearch}>
            search
        </button>
        <button
        style={{
            width:'100%',
            height:'100%',
            borderRadius:'15px',

        }} onClick={handleClickCreate}>
            Create
        </button>

        </div>
    </div>
  )
}
