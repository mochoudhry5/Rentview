import React, {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {ActivityIndicator} from 'react-native';
import {StreamChat, Channel} from 'stream-chat';
import {OverlayProvider, Chat} from 'stream-chat-react-native';
import {db, auth} from '../config/firebase';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import axios from 'axios';
const baseUrl = 'http://localhost:8000';

type ChatContextType = {
  chatClient?: StreamChat;
  currentChannel?: Channel;
  setCurrentChannel: Dispatch<Channel>;
};

export const ChatContext = createContext<ChatContextType>({
  chatClient: undefined,
  currentChannel: undefined,
  setCurrentChannel: useState<Channel>,
});

const ChatContextProvider = ({children}: {children: React.ReactNode}) => {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [currentChannel, setCurrentChannel] = useState<Channel>();
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  const userInfoRef = doc(db, 'UserReviews', userId ? userId : '');

  useEffect(() => {
    const initChat = async () => {
      if (!userId || chatClient) {
        return;
      }

      const userDoc = await getDoc(userInfoRef);

      if (userDoc.exists()) {
        const client = StreamChat.getInstance('pn73rx5c7g26');
        let token;

        if (userDoc.data().token) {
          token = userDoc.data().token;
        } else {
          const response = await axios.post(`${baseUrl}/api/data`, {
            userId,
          });
          token = response.data;
          await updateDoc(userInfoRef, {
            token: token,
          });
        }

        await client.connectUser(
          {
            id: userId,
            name: userDoc.data().username,
          },
          token,
        );

        setChatClient(client);
      }
    };

    initChat();
  }, []);

  if (!chatClient) {
    return <ActivityIndicator />;
  }

  const value = {
    chatClient,
    currentChannel,
    setCurrentChannel,
  };
  return (
    <OverlayProvider>
      <Chat client={chatClient}>
        <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
      </Chat>
    </OverlayProvider>
  );
};

export const useChatContext = () => useContext(ChatContext);

export default ChatContextProvider;
