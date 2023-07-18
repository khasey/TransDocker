import { Height } from '@mui/icons-material'
import React, { SyntheticEvent } from 'react'

interface MenuCCProps {
    handleClose: (event: SyntheticEvent | Event, reason?: string) => void;
  }

export const MenuCC: React.FC<MenuCCProps> = ({handleClose}) => {
  return (
    <div className="container" 
    style={{
        width:'75%',
        height:'70px',
        backgroundColor:'black',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
        position:'absolute',
        top:'75%',
        right:'10%',
    }}>
        <div className="inputs" 
        style={{
            backgroundColor:'blue',
            width:'100%',
            height:'100%',
            display:'flex',
            flexDirection:'column',
            alignItems:'flex-start',
            justifyContent:'center',
            gap:'10px',
            

        }}>
            <div className="input_name" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                <p style={{color:'white', fontSize:'10px'}}>Channel name:</p>
                <input type="text" />
            </div>
            <div className="input_password" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
            <p style={{color:'white', fontSize:'10px'}}>Password:</p>
            <input type="text" />
            </div>

        </div>
        <button 
        style={{
            width:'50%',
            height:'100%',

        }} onClick={handleClose}>
            Create
        </button>

    </div>
  )
}
