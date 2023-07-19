import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';

type User = {
  username: string;
  imageUrl: string;
  id: number;
  // ajouter ici d'autres propriétés selon les besoins
};

export interface Message {
  channelId: string;
  sender: number;
  message: ReactNode;
  id: string;
  text: string;
  user: Message;
  username: string;
  imageUrl: string;
}

interface ChatContextProps {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  user: User | null;
}

export const ChatContext = createContext<ChatContextProps | null>(null);

// Composant fournisseur du contexte
export const ChatContextProvider: React.FC<{ children: ReactNode; user : User|null }> = ({ children, user }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  // Fonction pour mettre à jour les messages avec les données du backend
  const updateMessages = (newMessages: Message[] | ((prevState: Message[]) => Message[])) => {
    setMessages(newMessages);
  };

  // Autres valeurs du contexte à fournir// Mettez à jour cette valeur avec les données de l'utilisateur

  const contextValue: ChatContextProps = {
    messages,
    setMessages: updateMessages,
    user,
  };
  console.log('user dans chatcontext'+user)
  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};
