import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {getDoc, doc} from 'firebase/firestore';
import {auth} from '../../config/firebase';
import {signOut} from 'firebase/auth';
import {db} from '../../config/firebase';
import {AccountStackParamList} from '../../utils/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useChatContext} from '../../context/ChatContext';
import {StreamChat} from 'stream-chat';

type AccountProps = NativeStackScreenProps<
  AccountStackParamList,
  'AccountScreen'
>;

const AccountScreen: React.FC<AccountProps> = ({navigation}) => {
  const userId = auth.currentUser ? auth.currentUser.uid : '';
  const {chatClient} = useChatContext();
  const {setCurrentChannel} = useChatContext();

  const handleLogoutAttempt = () => {
    Alert.alert('Log out?', 'Unsaved changes will be lost', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Logout', onPress: handleLogout, style: 'destructive'},
    ]);
  };

  const handleLogout = () => {
    chatClient?.disconnectUser();

    signOut(auth)
      .then(() => {
        console.log('User logged out successfully:');
      })
      .catch(error => {
        console.log('Error logging out: ', error);
      });
  };

  const handleActivity = async () => {
    navigation.removeListener;
    navigation.navigate('ActivityScreen');
  };

  const handleContact = async () => {
    const client = StreamChat.getInstance('pn73rx5c7g26');
    const adminId = '0bXFuQZ3OmRA09Tr311JSBizUjs2';
    const filter = {type: 'messaging', members: {$eq: [adminId, userId]}};
    const channels = await client.queryChannels(filter);

    if (channels.length > 0) {
      const channel = client.channel('messaging', {
        members: [adminId, userId],
        name: 'Rentview Admin',
      });

      await channel.create();

      setCurrentChannel(channel);

      navigation.removeListener;
      navigation.navigate('ChatRoom');
    } else {
      navigation.removeListener;
      navigation.navigate('ContactScreen');
    }
  };

  const handleProfile = async () => {
    const userInfoRef = doc(db, 'UserReviews', userId);
    const userInfoSnapshot = await getDoc(userInfoRef);

    if (userInfoSnapshot.exists()) {
      navigation.removeListener;
      navigation.navigate('ProfileScreen', {userId: userInfoSnapshot.id});
    }
  };

  const handleMyProperties = () => {
    navigation.removeListener;
    navigation.navigate('PropertiesScreen');
  };

  const settingsOptions = [
    {
      title: 'My Profile',
      subTitle: 'Manage my RentView profile',
      onPress: handleProfile,
    },
    {
      title: 'My Activity',
      subTitle: 'Manage my reviews',
      onPress: handleActivity,
    },
    {
      title: 'My Properties',
      subTitle: 'Manage my properties',
      onPress: handleMyProperties,
    },
    {
      title: 'Contact Us',
      subTitle: 'Contact us for assistance',
      onPress: handleContact,
    },
    {
      title: 'Logout',
      subTitle: 'Get out of RentView',
      onPress: handleLogoutAttempt,
    },
  ];

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.container}>
        {settingsOptions.map(({title, subTitle, onPress}, index) => (
          <TouchableOpacity
            key={title}
            onPress={onPress}
            style={{width: '100%'}}>
            <View
              style={{
                paddingHorizontal: '5%',
                paddingBottom: '5%',
                paddingTop: '5%',
              }}>
              <Text style={{fontSize: 17}}>{title}</Text>
              {subTitle && (
                <Text style={{fontSize: 14, opacity: 0.5, paddingTop: '2%'}}>
                  {subTitle}
                </Text>
              )}
            </View>
            <View style={{height: 0.5, backgroundColor: 'gray'}} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    width: '88%',
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: '5%',
    marginBottom: '5%',
    borderRadius: 10,
  },
  input: {
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: '2%',
    borderWidth: 0.3,
    height: 40,
    fontSize: 16,
    textAlignVertical: 'bottom',
    paddingLeft: '2%',
  },
});

export default AccountScreen;
