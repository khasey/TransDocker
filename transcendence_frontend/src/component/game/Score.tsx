import React from 'react'
import styles from './Score.module.css'
import { Avatar } from '@mui/material'

const Score:React.FC = () => {
  return (
    <div className={styles.all}>
      <div className={styles.left}>
      <Avatar
        alt="Remy Sharp"
        src=""
        sx={{ width: 100, height: 100 , marginLeft: 20,
          "@media screen and (min-width: 1000px) and (max-width: 1500px)":{
            width: 80, height: 80 , marginLeft: 5,
          },
          "@media screen and (max-width: 1000px)":{
            width: 60, height: 60 , marginLeft: 2,
          },
        }}
      />
      <div className={styles.username}>
        USERNAME
      </div>
      <div className={styles.score}>
        SCORE
      </div>


      </div>
      
      <div className={styles.center}></div>

      <div className={styles.right}>
      
      <div className={styles.score}>
        SCORE
      </div>
      
      <div className={styles.username}>
        USERNAME
      </div>
      <Avatar
        alt="Remy Sharp"
        src=""
        sx={{ width: 100, height: 100 , marginRight: 20,
          "@media screen and (min-width: 1000px) and (max-width: 1500px)":{
            width: 80, height: 80 , marginRight: 5,
          },
          "@media screen and (max-width: 1000px)":{
            width: 60, height: 60 , marginRight: 2,
          },
          }}
      />
      </div>
    </div>
  )
}

export default Score