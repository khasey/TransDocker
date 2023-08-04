'use client'
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import Layout from 'src/component/Layout'
import { Avatar, Box, Button, ButtonGroup, Switch, TextField, Typography, alpha, styled } from '@mui/material'
import { pink } from '@mui/material/colors';
import styles from './profil.module.css'
import ScoreInfo from 'src/component/scoreboard/ScoreInfoMiddle';
import axios, { Axios } from 'axios';
import { Center } from '@react-three/drei';
import { AuthGuard } from 'src/api/HOC';




const PinkSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: 'white',
    '&:hover': {
      backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: 'white',
  },
}));

interface User {
  username: string;
  imageUrl: string;
  id: number;
}


 const Profil: React.FC = () => {

    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState<string>('');
	  const [selectedImage, setSelectedImage] = useState<File | null>(null);
	  const fileInputRef = useRef<HTMLInputElement>(null);
	  const [isUsernameValid, setIsUsernameValid] = useState(true); // Nouvelle variable d'état
	  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false); // Nouvelle variable d'état

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

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedImage(file);
    }
  };

  const updateProfilePicture = async () => {
    if (!selectedImage) return;

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await axios.put<User>(
        `http://localhost:4000/user/${user?.id}/image`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setUser(response.data);
      console.log('resp data =>' + response.data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la photo de profil :', error);
    }
  };
  console.log('imgaurl en front => ' + user?.imageUrl);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const checkUsername = async (username: string) => {
	if (username.trim() === '') {
	  console.error('L\'username ne peut pas être vide');
	  setIsUsernameValid(false);
	  return;
	}

	try {
	  const checkResponse = await axios.get(`http://localhost:4000/user/exists/${username}`, { withCredentials: true });
	  if (checkResponse.data.exists) {
		console.error('Le nom d\'utilisateur est déjà pris');
		setIsUsernameValid(false);
	  } else {
		setIsUsernameValid(true);
	  }
	} catch (error) {
	  console.error('Erreur lors de la vérification du pseudo :', error);
	  setIsUsernameValid(false);
	}
  };

  const updateUsername = async () => {
	if (!isUsernameValid) {
	  console.error('Le nom d\'utilisateur n\'est pas valide');
	  return;
	}

	if (!username || username.trim() === '') {
	  console.error('Le nom d\'utilisateur ne peut pas être vide');
	  return;
	}

	setIsUpdatingUsername(true);
	try {
	  const updateResponse = await axios.put(
		`http://localhost:4000/user/${user?.id}/username`,
		{ username },
		{ withCredentials: true }
	  );

	  if (user) {
		setUser((prevUser) => ({
		  ...prevUser,
		  id: prevUser ? prevUser.id : 0,
		  imageUrl: prevUser ? prevUser.imageUrl : '',
		  username: updateResponse.data.username
		}));
	  }
	} catch (error) {
	  console.error('Erreur lors de la mise à jour du pseudo :', error);
	} finally {
	  setIsUpdatingUsername(false);
	}
  };

  return (
    <AuthGuard>
    <Layout>
    <div className={styles.all}>
      <div className={styles.all_score}>
        <div className={styles.all_score_avatar}>
        <img src='./images/lvl2.png' alt="" className={styles.all_score_ladder_logo_img} />
          <Avatar
		  alt="Remy Sharp"
		  src={user?.imageUrl}
		  onClick={() => {
			handleAvatarClick();
			updateProfilePicture();
		  }}
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
        <div className="username" style={{marginLeft:'10px'}}>
          {user?.username}
        </div>
            <TextField
              label=''
              type="text"
              margin="none"
              onChange={async (e) => {
                setUsername(e.target.value);
                await checkUsername(e.target.value);
              }}
              InputLabelProps={{
                style: { color: 'white' },
              }}
              inputProps={{
                style: { color: 'white' },
              }}
              sx={{
                '@media screen and (width < 1500px)': {
                  width: 150,
                },
                '@media screen and (width < 1000px)': {
                  width: 100,
                  marginLeft:'10px',
                },
                '.css-x2l1vy-MuiInputBase-root-MuiOutlinedInput-root': {
                  color: 'white',
                },
                marginLeft:'20px',
                width:'200px'
              }}
              InputProps={{
                sx: {
                  '@media screen and (width < 1500px)': {
                    fontSize: '65%',
                  },
                  '.css-1d3z3hw-MuiOutlinedInput-notchedOutline': {
                    border: '2px solid white',
                  },
                  '&:hover': {
                    '.css-1d3z3hw-MuiOutlinedInput-notchedOutline': {
                      border: '2px solid white',
                    },
                  },
                },
              }}
              size="small"
              variant="outlined"
              fullWidth
            />
			<button className={styles.handleChangeUsername} onClick={isUsernameValid ? updateUsername : undefined} style={{cursor: 'pointer',}}>
				<h3> Update </h3>
			</button>
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
	<input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageChange}
        ref={fileInputRef}
      />
    </Layout>
    </AuthGuard>
  )
}

export default Profil