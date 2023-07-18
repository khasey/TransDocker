import React from 'react';

const SelectedTabContext = React.createContext<{ selectedTab: {id: number, label: string}, setSelectedTab: React.Dispatch<React.SetStateAction<{id: number, label: string}>> }>({ selectedTab: {id: 1, label: 'General'}, setSelectedTab: () => { throw new Error("Used SelectedTabContext before SelectedTabProvider was rendered"); } });

export default SelectedTabContext;


