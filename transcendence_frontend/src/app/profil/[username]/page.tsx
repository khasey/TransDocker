'use client'
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import Layout from 'src/component/Layout'
import { Avatar, Box, Button, ButtonGroup, Switch, TextField, Typography, alpha, styled } from '@mui/material'
import { pink } from '@mui/material/colors';
import styles from '../profil.module.css'
import ScoreInfo from 'src/component/scoreboard/ScoreInfoMiddle';
import axios, { Axios } from 'axios';
import { useRouter } from 'next/router'

interface User {
    username: string,
    imageUrl: string,
    // other properties...
  }
interface pageProps{
  params:{username:string}
}  

 const ProfilUsername: React.FC<pageProps> = ({params}) => {
    const [user, setUser] = useState<User | null>(null)
  
    // useEffect(async () => {
    //   try{
    //   if (params.username) {
    //     const response = await axios.get(`http://localhost:3000/users/username/${params.username}`)
    //     setUser(response.data)
          
    //   }
    // }, [params.username])

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await axios.get<User>(`http://localhost:4000/user/username/${params.username}`, { withCredentials: true });
          setUser(response.data);
        } catch (error) {
          console.error("Erreur lors de la récupération de l'utilisateur dans params :", error);
        }
      };
  
      fetchUser();
    }, [params.username]);
  return (
    <Layout>
    <div className={styles.all}>
      <div className={styles.all_score}>
        <div className={styles.all_score_avatar}>
        <img src='../images/lvl2.png' alt="" className={styles.all_score_ladder_logo_img} />
          <Avatar
		  alt="Remy Sharp"
		  src={user?.imageUrl}
          sx={{
            "@media screen and (width < 1500px)":{
              width:'70px',
              height:'70px',
              marginLeft:'0',
            },
            "@media screen and (width < 1000px)":{
              width:'40px',
              height:'40px',
              marginLeft:'0',
              marginRight:'0',
            },
            width: '80px',
            height: '80px',
            marginLeft: '0',
            marginRight:'0',
			      cursor:'pointer',
          }} />


          <div className={styles.blaze}>

		  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
        <div className="username">
          {user?.username}
        </div>
          </div>

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
        </div>


        <div className={styles.all_score_score} >
          <div className={styles.all_score_score_date}>

          </div>
          <div className={styles.all_score_score_stats}>
              <ScoreInfo />
          </div>
        </div>
      </div>
    </div>
    </Layout>
  )
}

export default ProfilUsername