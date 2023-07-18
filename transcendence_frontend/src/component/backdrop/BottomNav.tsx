import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FolderIcon from '@mui/icons-material/Folder';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChatIcon from '@mui/icons-material/Chat';
import EmailIcon from '@mui/icons-material/Email';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

interface LabelBottomNavigationProps {
    setValue: React.Dispatch<React.SetStateAction<{id: number; label: string; }>>;
}

const LabelBottomNavigation: React.FC<LabelBottomNavigationProps> = ({setValue}) => {

    const handleChange = (event: React.SyntheticEvent, newValue: {id: number, label: string}) => {
        console.log("handleChange called with newValue: ", newValue);
        setValue(newValue);
    };

    return (
        <BottomNavigation value={setValue} onChange={handleChange} sx={{ width: 500 }}>
            <BottomNavigationAction
                label="General"
                value={{id: 1, label: "General"}}
                icon={<ChatIcon />}
            />
            <BottomNavigationAction
                label="Channel"
                value={{id: 2, label: "Channel"}}
                icon={<QuestionAnswerIcon />}
            />
            <BottomNavigationAction
                label="Private"
                value={{id: 3, label: "Private"}}
                icon={<EmailIcon />}
            />
        </BottomNavigation>
    );
}

export default LabelBottomNavigation

