import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ChatStackParamList} from '../utils/types';
import ChatsScreen from '../screens/ChatViews/ChatsScreen';
import ChatRoom from '../screens/ChatViews/ChatRoom';

const Stack = createStackNavigator<ChatStackParamList>();

const ChatStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ChatsScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#347544',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="ChatsScreen"
        component={ChatsScreen}
        options={{
          title: 'Messages',
        }}
      />

      <Stack.Screen
        name="ChatRoom"
        component={ChatRoom}
        options={{
          title: 'Chat Room',
        }}
      />
    </Stack.Navigator>
  );
};

export default ChatStack;
