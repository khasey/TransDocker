'use client'
import React, { useContext, useEffect, useState } from 'react'
import Layout from 'src/component/Layout'
import { Avatar, Box, Button, ButtonGroup, Switch, TextField, Typography, alpha, styled } from '@mui/material'
import { pink } from '@mui/material/colors';
import styles from './profil.module.css'
import ScoreInfo from 'src/component/scoreboard/ScoreInfoMiddle';
import axios from 'axios';




const PinkSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: 'white',
    '&:hover': {
      backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
    },
    "@media screen and (width < 1000px)":{
      fontSize:'10px',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: 'white',
  },
}));

export interface User {
  id: number;
  username: string;
  imageUrl: string;
}

export interface Game {
  user1: User;
  user2: User;
  score: string;
  mode: string;
  date: string;
}

const Profil: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [games, setGames] = useState<Game[] | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await axios.get<User>('http://localhost:4000/user', { withCredentials: true });
        setUser(userResponse.data);
  
        const fetchGames = async () => {
          try {
            const gamesResponse = await axios.get<Game[]>(`http://localhost:4000/game`, { withCredentials: true });
            setGames(gamesResponse.data);
          } catch (error) {
            console.log("Erreur lors de la récupération des jeux :", error);
          }
        };
  
        fetchGames();
  
      } catch (error) {
        console.log("Erreur lors de la récupération de l'utilisateur :", error);
      }
    };
  
    fetchUser();
  }, []);  
  

  return (
    <Layout>
    <div className={styles.all}>
      <div className={styles.all_score}>
        <div className={styles.all_score_avatar}>

          <Avatar alt="Remy Sharp" src={user?.imageUrl} 
          sx={{
            "@media screen and (width < 1500px)":{
              width:'70px',
              height:'70px',
            },
            "@media screen and (width < 1000px)":{
              width:'60px',
              height:'60px',
            },
            width: '80px',
            height: '80px',
            marginLeft: '5%',
            marginRight:'5%',
          }} />

        
          <div className={styles.blaze}>
            <p>{user?.username}</p>
          </div>

          <Typography variant="h6" gutterBottom sx={{
            "@media screen and (width < 1000px)":{
              fontSize:'12px',
              // margin:'10px',
            },
            "@media screen and (width < 1500px) and (width > 1000px)":{
              fontSize:'16px',
            },
            margin:'0',
            color:'white',
          }}>
             {/* <Title2fa/> */}
          </Typography>
          <PinkSwitch 
		        
  			    sx={{
              // margin:'10px'
            }} />
        </div>
       
            
        <div className={styles.all_score_score} >
          <div className={styles.all_score_score_date}>
           
          </div>
          <div className={styles.all_score_score_stats}>
            {user && <ScoreInfo games={games} userId={user.id} />}
          </div>
        </div>
        <div className={styles.all_score_ladder}>
              <div className={styles.all_score_ladder_logo}>
                <p className={styles.all_score_ladder_logo_lvl}>1</p>              
                <img src='./images/lvl2.png' alt="" className={styles.all_score_ladder_logo_img} />
              </div>
              <div className={styles.all_score_ladder_exp}>
                <p className={styles.all_score_ladder_exp_text}>
                  {/* <TitleXp/> */}
                </p>
                <div className={styles.all_score_ladder_exp_bar}>

                </div>
              </div>
        </div>
      </div>
    </div>
    </Layout>
  )
}

export default Profil