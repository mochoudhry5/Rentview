import React, {useEffect, useState} from 'react';
import {
  Channel,
  MessageList,
  MessageInput,
  Thread,
  MessageType,
} from 'stream-chat-react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ChatStackParamList} from '../../utils/types';
import {useChatContext} from '../../context/ChatContext';
import {Button} from 'react-native-elements';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';

type ChatRoomProps = NativeStackScreenProps<ChatStackParamList, 'ChatRoom'>;

const ChatRoom: React.FC<ChatRoomProps> = ({navigation}) => {
  const {currentChannel} = useChatContext();
  const [thread, setThread] = useState<MessageType | null>();

  useEffect(() => {
    navigation.setOptions({
      title: currentChannel?.data?.name || 'Channel',
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon name="chevron-back-outline" color={'white'} size={25} />
        </TouchableOpacity>
      ),
    });
  }, []);

  return currentChannel ? (
    <View style={{marginBottom: '6%'}}>
      <Channel channel={currentChannel}>
        {thread ? (
          <Thread />
        ) : (
          <>
            <MessageList onThreadSelect={setThread} />
            <MessageInput />
          </>
        )}
      </Channel>
    </View>
  ) : null;
};

export default ChatRoom;
