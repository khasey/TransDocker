import React from 'react'
import styles from './ScoreInfoMiddle.module.css'
import { Avatar, Box, Button, ButtonGroup, Typography } from '@mui/material'

const buttons = [
  <Button key="one">Last Matchs</Button>,
  <Button key="two">Last Week</Button>,
  <Button key="three">Last Month</Button>,
]; 

const ScoreInfo : React.FC = () => {
  return (
    <div>
       <div
              style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop:'-80px',
              }}
              >
                <Typography variant="h5" gutterBottom sx={{
                  margin:'0',
                  color:'white',
                }}>
                  {/* SCOREBOARD */}
                  {/* <TitleScore/> */}
                </Typography>
              <ButtonGroup color='info'size="large" aria-label="large button group" sx={{
                margin:'0',
                color:'#0099ff'
              }}>
                {buttons}
              </ButtonGroup>
              <div className={styles.container}>
                <div className={styles.container_text}>
                  <div className={styles.pseudo}>
                  <Avatar
                    alt="Remy Sharp"
                    src=""
                    sx={{ width: 40, height: 40 }}
                    />
                    <p className={styles.comp}>KTHIERRY</p>
                    <p className={styles.comp} >2</p>
                  </div>
                  <p style={{fontWeight:'700', color:'white'}}>VS</p>
                  <div className={styles.pseudo2}>  
                  <p className={styles.comp}>2</p>
                  <p className={styles.comp}>KTHIERRY</p>
                  <Avatar
                    alt="Remy Sharp"
                    src=""
                    sx={{ width: 40, height: 40 }}
                    />
                  </div>
                </div>
            </div>
            </div>
       
    </div>
  )
}

export default ScoreInfo