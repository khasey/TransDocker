import axios from 'axios';
import React, { useEffect, useState } from 'react';

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

  console.log('user => ' + user?.id);

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

      console.log('bite => ' + userId);
      console.log('private =>'+ isprivate);

      if (response.ok) {
        const channel = await response.json();
        console.log('Channel created:', channel);
        handleClose(); // Fermer les div après la création du channel
      } else {
        console.error('Error creating channel:', response.statusText);
      }
    } catch (error: any) {
      console.error('Error creating channel:', error.message);
    }
  }

  const handleClickCreate = async () => {
    try {
      await handleCreateChannel(name, password, user?.id, isprivate );
    } catch (error: any) {
      console.error('Error creating channel:', error.message);
    }
  };


  return (
    <div className="container"
    style={{
        width:'75%',
        height:'100px',
        backgroundColor:'black',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
        position:'absolute',
        top:'83%',
        right:'10%',
        borderRadius:'15px',
    }}>
        <div className="inputs"
        style={{
            // backgroundColor:'blue',
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
        <button
        style={{
            width:'50%',
            height:'100%',
            borderRadius:'15px',

        }} onClick={handleClickCreate}>
            Create
        </button>

    </div>
  )
}