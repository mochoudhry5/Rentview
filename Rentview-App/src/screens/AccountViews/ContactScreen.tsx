import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AccountStackParamList} from '../../utils/types';
import {StreamChat} from 'stream-chat';
import {useChatContext} from '../../context/ChatContext';
import {auth} from '../../config/firebase';

type ContactProps = NativeStackScreenProps<
  AccountStackParamList,
  'ContactScreen'
>;

const ContactScreen: React.FC<ContactProps> = ({navigation}) => {
  const client = StreamChat.getInstance('pn73rx5c7g26');
  const adminId = '0bXFuQZ3OmRA09Tr311JSBizUjs2';
  const user = auth.currentUser;
  const userId = user?.uid ? user.uid : '';
  const {setCurrentChannel} = useChatContext();
  const [height, setHeight] = useState(0);
  const [messageText, setMessageText] = useState<string>();

  const handleMessageOwner = async () => {
    const channel = client.channel('messaging', {
      members: [adminId, userId],
      name: 'Rentview Admin',
    });

    await channel.create();

    await channel.sendMessage({
      text: messageText,
    });

    setCurrentChannel(channel);

    navigation.removeListener;
    navigation.navigate('ChatRoom');
  };

  return (
    <View>
      <>
        <Text>Message us your concerns or feedback! Thank you</Text>
        <TextInput
          style={styles.input}
          multiline={true}
          onChangeText={setMessageText}
          value={messageText}
          onContentSizeChange={event =>
            setHeight(event.nativeEvent.contentSize.height)
          }
          placeholder="Leave concerns and feedback!"
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleMessageOwner}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
            }}>
            Send
          </Text>
        </TouchableOpacity>
      </>
    </View>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  submitButton: {
    width: '25%',
    backgroundColor: '#1f3839',
    borderRadius: 20,
    padding: 10,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: 'white',
    borderColor: 'gray',
    alignSelf: 'center',
    borderWidth: 0.5,
    borderRadius: 5,
    width: '95%',
    fontSize: 16,
    margin: '10%',
    padding: '1%',
  },
});
