'use client'
import React, { useContext, useEffect, useState } from 'react'
import Layout from 'src/component/Layout'
import { Avatar, Box, Button, ButtonGroup, Switch, TextField, Typography, alpha, styled } from '@mui/material'
import { pink } from '@mui/material/colors';
import styles from './profil.module.css'
import ScoreInfo from 'src/component/scoreboard/ScoreInfoMiddle';
import axios from 'axios';
import { User } from '../../../../transcendence_backend/src/user/user.entity';
import TitleXp from 'src/component/scoreboard/TitleXp';
import Title2fa from 'src/component/scoreboard/Title2fa';


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

const API_URL = 'http://localhost:4000/user/104440';

const enable2FA = async (userId:any) => {
  try {
    const response = await axios.post(`${API_URL}/enable/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const disable2FA = async (userId:any) => {
  try {
    const response = await axios.post(`${API_URL}/disable/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const Profil: React.FC = () => {

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<User>('http://localhost:4000/user', { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
      }
    };

    fetchUser();
  }, []);
  
  // Appeler disableTwoFactorAuth lorsque l'utilisateur désactive la 2FA
  
  const [isTwoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleSwitchChange = async (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
    setTwoFactorEnabled(event.target.checked);
    
    const userId = '104440'; // Replace this with the actual user ID
    
    if (event.target.checked) {
      const result = await enable2FA(userId);
      console.log(result);
    } else {
      const result = await disable2FA(userId);
      console.log(result);
    }
  };
  
  

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

        <TextField
          sx={{
            "@media screen and (width < 1000px)":{
              marginRight:'15vw',
            },
            "@media screen and (width < 1500px) and (width > 1000px)":{
              marginRight:'35vw',
            },
            marginRight:'45vw',
          }}
          InputLabelProps={{
            style: { color: "white" },
          }}
          inputProps={{
            style: { color: "white" },
          }}
          InputProps={{
            sx: {
              "@media screen and (width < 1000px)":{
                width:'110px',
                height:'40px',
              },
              ".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
                border: "1px solid white",
              },
              "&:hover": {
                ".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
                  border: "2px solid white",
                },
              },
            },
          }}
          id="outlined-controlled"
          label={user?.username}
          value={name}
          size='medium'
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          // setName(event.target.value);
        }}
      />

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
             <Title2fa/>
          </Typography>
          <PinkSwitch defaultChecked={isTwoFactorEnabled}
		        onChange={handleSwitchChange}
  			    sx={{
              // margin:'10px'
            }} />
        </div>
       
            
        <div className={styles.all_score_score} >
          <div className={styles.all_score_score_date}>
           
          </div>
          <div className={styles.all_score_score_stats}>
              <ScoreInfo />
          </div>
        </div>
        <div className={styles.all_score_ladder}>
              <div className={styles.all_score_ladder_logo}>
                <p className={styles.all_score_ladder_logo_lvl}>1</p>              
                <img src="./images/lvl2.png" alt="" className={styles.all_score_ladder_logo_img} />
              </div>
              <Box className={styles.all_score_ladder_exp}>
                <p className={styles.all_score_ladder_exp_text}>
                  <TitleXp/>
                </p>
                <div className={styles.all_score_ladder_exp_bar}>

                </div>
              </Box>
        </div>
      </div>
    </div>
    </Layout>
  )
}

export default Profil