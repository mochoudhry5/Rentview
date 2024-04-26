import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AccountStackParamList} from '../utils/types';
import ProfileScreen from '../screens/AccountViews/ProfileScreen';
import AccountScreen from '../screens/AccountViews/AccountScreen';
import ActivityScreen from '../screens/AccountViews/ActivityScreen';
import RentalDescriptionScreen from '../screens/SearchViews/RentalDescriptionScreen';
import PropertiesScreen from '../screens/AccountViews/PropertiesScreen';
import PostRentalScreen from '../screens/SearchViews/PostRentalScreen';
import ContactScreen from '../screens/AccountViews/ContactScreen';
import ChatRoom from '../screens/ChatViews/ChatRoom';

const Stack = createStackNavigator<AccountStackParamList>();

const AccountStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="AccountScreen"
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
        name="AccountScreen"
        component={AccountScreen}
        options={{
          headerShown: true,
          title: 'Account Settings',
        }}
      />
      <Stack.Screen
        name="ActivityScreen"
        component={ActivityScreen}
        options={{
          title: 'Activity',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="ContactScreen"
        component={ContactScreen}
        options={{
          title: 'Contact Admin',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoom}
        options={{
          title: 'Chat Room',
        }}
      />
      <Stack.Screen
        name="RentalDescription"
        component={RentalDescriptionScreen}
        options={{
          headerShown: false,
          title: 'Property Information',
          headerBackTitle: 'Reviews',
        }}
      />
      <Stack.Screen
        name="PropertiesScreen"
        component={PropertiesScreen}
        options={{
          title: 'My Properties',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="PostRentalScreen"
        options={{
          title: 'Edit Your Rental',
          headerBackTitleVisible: false,
        }}
        component={PostRentalScreen}
      />
    </Stack.Navigator>
  );
};

export default AccountStack;
