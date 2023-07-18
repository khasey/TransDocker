import * as React from 'react';
import Button from '@mui/material/Button';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import { MenuCC } from './MenuCC';

export default function CreateChannelButton() {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleClick}><MarkUnreadChatAltIcon/></Button>
      {open && <MenuCC handleClose={handleClose}/>}
    </div>
  );
}
