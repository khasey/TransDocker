import { Avatar, AvatarGroup, Badge, styled } from '@mui/material'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import styles from './FO.module.css'
import axios from 'axios';

type User = {
  username: string;
  imageUrl: string;
  id: number;
  // ajouter ici d'autres propriétés selon les besoins
};

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }));
  type Friend = {
    id: number;
    username:string;
    friends: number[];// ajouter ici d'autres propriétés si nécessaire
  };
  

export const FriendsOnline = () => {

  const [user, setUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<User[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<User>('http://localhost:4000/user', { withCredentials: true });
        const currentUser = response.data;
        setUser(currentUser);
  
        // Après avoir obtenu l'utilisateur, obtenir ses amis
        const friendsResponse = await axios.get<Friend[]>(`http://localhost:4000/users/${currentUser.id}/friends`, { withCredentials: true });
        console.log('friendsResponse.data:', friendsResponse.data);
        const friendIds = friendsResponse.data.map((friend) => friend.id);
        
        
        // Pour chaque id d'ami, obtenir les détails de l'utilisateur
        const friendPromises = friendIds.map(id => axios.get<User>(`http://localhost:4000/user/${id}`));
        const friendsDetailsResponses = await Promise.all(friendPromises);
        
        // Définir les amis dans l'état
        const friendsDetails = friendsDetailsResponses.map(response => response.data);
        setFriends(friendsDetails);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur et des amis :", error);
      }
    };
  
    fetchUser();
  }, []);
  

  const [state, setState] = React.useState({
    right: false,
  });
  
  return (
    <div className={styles.channel}>
                <div className={styles.channel_photo}>
                <AvatarGroup max={4}>
                  {friends.map(friend =>(
                  <Avatar key={friend.id} alt={friend.username} src={friend.imageUrl} style={{cursor:'pointer'}}/>
                  ))}
                </AvatarGroup>
                </div>
                <div className={styles.channel_text}>
                    <h3>Friends Online</h3>
                </div>
                <div className={styles.channel_profil}>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  variant="dot"
                  >
                  <Link href="/profil">
                  <Avatar alt="Remy Sharp" src={user?.imageUrl} style={{cursor:'pointer'}}/>
                  </Link>
                </StyledBadge>
                </div>  
            </div>
  )
}
