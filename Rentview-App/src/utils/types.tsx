import {DocumentData} from 'firebase/firestore';

///////////////////////////////////
///// Parameters for screens //////
///////////////////////////////////

export type AccountStackParamList = {
  ActivityScreen: undefined;
  AccountScreen: undefined;
  ProfileScreen: {userId: string};
  RentalDescription: {homeId: string; ownerId: string};
  PropertiesScreen: undefined;
  PostRentalScreen: {homeId: string; homeDetails: DocumentData};
  ContactScreen: undefined;
  ChatRoom: undefined;
};

export type SearchStackParamList = {
  SearchRentals: undefined;
  RentalResults: {rentals: RentalType[]};
  RentalDescription: {homeId: string; ownerId: string};
  CreateReview: {homeId: string};
  PostRentalScreen: {homeId: string; homeDetails: DocumentData};
  ChatRoom: undefined;
};

export type ChatStackParamList = {
  ChatsScreen: undefined;
  ChatRoom: undefined;
};

export type RootStackParamList = {
  Search: SearchStackParamList;
  Account: AccountStackParamList;
  Chat: ChatStackParamList;
};

export type OtherStackParamList = {
  LoggedIn: RootStackParamList;
  Login: undefined;
  Signup: undefined;
};

////////////////////////////////
/// Types used for variables ///
////////////////////////////////

export type ImageType = {
  uri: string;
};

export type RentalType = {
  data: DocumentData;
  homeId: string;
};

export type RecentSearchType = {
  homeId: string;
  ownerId: string;
  homePicture: string;
  homeAddress: string;
};

export type EditReviewProps = {
  currentPropertyReview: DocumentData | undefined;
  setOnEdit: (edit: boolean) => void;
};
