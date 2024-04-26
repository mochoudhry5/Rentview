import {GoogleSignin} from '@react-native-google-signin/google-signin';

export const configureGoogle = () => {
  GoogleSignin.configure({
    webClientId:
      '795551030882-3mrb1u5bp15jvsmi97rp2kq42frc20gb.apps.googleusercontent.com',
    offlineAccess: true,
  });
};

export const signInGoogle = GoogleSignin;
