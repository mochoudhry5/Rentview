import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SearchStackParamList} from '../utils/types';
import RentalDescriptionScreen from '../screens/SearchViews/RentalDescriptionScreen';
import CreateReviewScreen from '../screens/SearchViews/CreateReviewScreen';
import PostRentalScreen from '../screens/SearchViews/PostRentalScreen';
import RentalResults from '../screens/SearchViews/RentalResults';
import SearchRentals from '../screens/SearchViews/SearchRentals';
import ChatRoom from '../screens/ChatViews/ChatRoom';
const Stack = createStackNavigator<SearchStackParamList>();

const SearchStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="SearchRentals"
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
        name="SearchRentals"
        component={SearchRentals}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RentalResults"
        component={RentalResults}
        options={{
          title: 'Search Results',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="RentalDescription"
        component={RentalDescriptionScreen}
        options={{
          headerShown: false,
          title: 'Property Information',
          headerBackTitle: 'Search',
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
        name="CreateReview"
        options={{
          title: 'Post Review',
          headerBackTitleVisible: false,
        }}
        component={CreateReviewScreen}
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

export default SearchStack;
