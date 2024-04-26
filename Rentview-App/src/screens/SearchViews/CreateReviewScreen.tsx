import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  TextInput,
  Switch,
  SafeAreaView,
} from 'react-native';
import {doc, getDoc, setDoc, updateDoc} from 'firebase/firestore';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SearchStackParamList} from '../../utils/types';
import {auth, db} from '../../config/firebase';
import {AirbnbRating} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

type CreateReviewProps = NativeStackScreenProps<
  SearchStackParamList,
  'CreateReview'
>;

const CreateReviewScreen: React.FC<CreateReviewProps> = ({
  route,
  navigation,
}) => {
  const [userHouseQuality, setUserHouseQuality] = useState<number>(5);
  const [userRecommend, setUserRecommend] = useState<boolean>(true);
  const [userOverallRating, setUserOverallRating] = useState<number>(5);
  const [userLandlordRating, setUserLandlordRating] = useState<number>(5);
  const [text, onChangeText] = useState<string>('');
  const [thumbsUp, setThumbsUp] = useState<string>('thumbs-up');
  const [thumbsDown, setThumbsDown] = useState<string>('thumbs-down-outline');
  const [ownerId, setOwnerId] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const toggleSwitch = () => setIsAnonymous(previousState => !previousState);
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const user = auth.currentUser ? auth.currentUser : '';
  const userId = auth.currentUser?.uid ? auth.currentUser.uid : '';
  const homeId = route.params.homeId;

  const handleReviewSubmit = async () => {
    const homeInfoRef = doc(db, 'HomeReviews', homeId);
    const homeInfoSnapshot = await getDoc(homeInfoRef);

    const userInfoRef = doc(db, 'UserReviews', userId ? userId : '');
    const userInfoSnapshot = await getDoc(userInfoRef);

    if (homeInfoSnapshot.exists()) {
      setOwnerId(homeInfoSnapshot.data().owner.userId);

      const date = new Date();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var year = date.getFullYear();

      var totalReviews = homeInfoSnapshot.data().totalReviews + 1;

      var rating = {
        oneStar: homeInfoSnapshot.data().overallRating.oneStar,
        twoStar: homeInfoSnapshot.data().overallRating.twoStar,
        threeStar: homeInfoSnapshot.data().overallRating.threeStar,
        fourStar: homeInfoSnapshot.data().overallRating.fourStar,
        fiveStar: homeInfoSnapshot.data().overallRating.fiveStar,
        avgOverallRating: 0,
      };

      var landlordRating = {
        oneStar: homeInfoSnapshot.data().landlordService.oneStar,
        twoStar: homeInfoSnapshot.data().landlordService.twoStar,
        threeStar: homeInfoSnapshot.data().landlordService.threeStar,
        fourStar: homeInfoSnapshot.data().landlordService.fourStar,
        fiveStar: homeInfoSnapshot.data().landlordService.fiveStar,
        avgLandlordService: 0,
      };

      var houseRating = {
        oneStar: homeInfoSnapshot.data().houseQuality.oneStar,
        twoStar: homeInfoSnapshot.data().houseQuality.twoStar,
        threeStar: homeInfoSnapshot.data().houseQuality.threeStar,
        fourStar: homeInfoSnapshot.data().houseQuality.fourStar,
        fiveStar: homeInfoSnapshot.data().houseQuality.fiveStar,
        avgHouseQuality: 0,
      };

      var recommendation = {
        yes: homeInfoSnapshot.data().wouldRecommend.yes,
        no: homeInfoSnapshot.data().wouldRecommend.no,
      };

      if (userRecommend) {
        recommendation.yes += 1;
      } else {
        recommendation.no += 1;
      }

      if (userOverallRating === 1) {
        rating.oneStar += +1;
      } else if (userOverallRating === 2) {
        rating.twoStar += 1;
      } else if (userOverallRating === 3) {
        rating.threeStar += 1;
      } else if (userOverallRating === 4) {
        rating.fourStar += 1;
      } else {
        rating.fiveStar += 1;
      }

      if (userLandlordRating === 1) {
        landlordRating.oneStar += +1;
      } else if (userLandlordRating === 2) {
        landlordRating.twoStar += 1;
      } else if (userLandlordRating === 3) {
        landlordRating.threeStar += 1;
      } else if (userLandlordRating === 4) {
        landlordRating.fourStar += 1;
      } else {
        landlordRating.fiveStar += 1;
      }

      if (userHouseQuality === 1) {
        houseRating.oneStar += +1;
      } else if (userHouseQuality === 2) {
        houseRating.twoStar += 1;
      } else if (userHouseQuality === 3) {
        houseRating.threeStar += 1;
      } else if (userHouseQuality === 4) {
        houseRating.fourStar += 1;
      } else {
        houseRating.fiveStar += 1;
      }

      rating.avgOverallRating =
        (1 * rating.oneStar +
          2 * rating.twoStar +
          3 * rating.threeStar +
          4 * rating.fourStar +
          5 * rating.fiveStar) /
        totalReviews;

      landlordRating.avgLandlordService =
        (1 * landlordRating.oneStar +
          2 * landlordRating.twoStar +
          3 * landlordRating.threeStar +
          4 * landlordRating.fourStar +
          5 * landlordRating.fiveStar) /
        totalReviews;

      houseRating.avgHouseQuality =
        (1 * houseRating.oneStar +
          2 * houseRating.twoStar +
          3 * houseRating.threeStar +
          4 * houseRating.fourStar +
          5 * houseRating.fiveStar) /
        totalReviews;

      await updateDoc(homeInfoRef, {
        landlordService: landlordRating,
        houseQuality: houseRating,
        wouldRecommend: recommendation,
        totalReviews: totalReviews,
        overallRating: rating,
      });

      if (user && userInfoSnapshot.exists()) {
        const userName = isAnonymous
          ? 'Spooky Reviewer'
          : userInfoSnapshot.data().username;

        const userEmail = isAnonymous ? 'Spooky Reviewer' : user.email;

        await setDoc(
          doc(db, 'HomeReviews', homeId, 'IndividualRatings', userId),
          {
            landlordServiceRating: userLandlordRating,
            recommendHouseRating: userRecommend,
            houseQualityRating: userHouseQuality,
            overallRating: userOverallRating,
            additionalComment: text,
            dateOfReview: month + '/' + day + '/' + year,
            reviewerEmail: userEmail,
            reviewerUsername: userName,
          },
        );

        await setDoc(doc(db, 'UserReviews', userId, 'Reviews', homeId), {
          homeId: homeId,
          address: homeInfoSnapshot.data().address,
          landlordServiceRating: userLandlordRating,
          overallRating: userOverallRating,
          houseRating: userHouseQuality,
          recommendHouseRating: userRecommend,
          additionalComment: text,
          dateOfReview: month + '/' + day + '/' + year,
          isAnonymous: isAnonymous,
        });
      }
    }
    navigation.removeListener;
    navigation.navigate('RentalDescription', {
      homeId: homeId,
      ownerId: ownerId,
    });
  };

  const handleYesClick = () => {
    if (thumbsUp == 'thumbs-up-outline') {
      setThumbsDown('thumbs-down-outline');
      setThumbsUp('thumbs-up');
      setUserRecommend(true);
    } 
  };

  const handleNoClick = () => {
    if (thumbsDown == 'thumbs-down-outline') {
      setThumbsDown('thumbs-down');
      setThumbsUp('thumbs-up-outline');
      setUserRecommend(false);
    } 
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView>
        <View style={{marginBottom: '20%'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              marginTop: '5%',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                fontFamily: 'Iowan Old Style',
              }}>
              Post as Anonymous
            </Text>
            <Switch
              trackColor={{false: 'grey', true: '#347544'}}
              thumbColor={'#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isAnonymous}
              style={{transform: [{scaleX: 1}, {scaleY: 0.9}]}}
            />
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: '3%',
              }}>
              <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
              <View>
                <Text
                  style={{
                    fontFamily: 'Iowan Old Style',
                    fontWeight: 'bold',
                    fontSize: 20,
                    textAlign: 'center',
                    paddingLeft: '2%',
                    paddingRight: '2%',
                  }}>
                  Overall Rating
                </Text>
              </View>
              <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
            </View>
            <AirbnbRating
              showRating={true}
              selectedColor="black"
              defaultRating={userOverallRating}
              onFinishRating={setUserOverallRating}
              size={20}
              reviewColor="gray"
              reviewSize={13}
            />
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: '5%',
              }}>
              <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
              <View>
                <Text
                  style={{
                    fontFamily: 'Iowan Old Style',
                    fontWeight: 'bold',
                    fontSize: 20,
                    textAlign: 'center',
                    paddingLeft: '2%',
                    paddingRight: '2%',
                  }}>
                  Landlord Rating
                </Text>
              </View>
              <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
            </View>
            <AirbnbRating
              showRating={true}
              selectedColor="black"
              defaultRating={userLandlordRating}
              onFinishRating={setUserLandlordRating}
              size={20}
              reviewColor="gray"
              reviewSize={13}
            />
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: '5%',
              }}>
              <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
              <View>
                <Text
                  style={{
                    fontFamily: 'Iowan Old Style',
                    fontWeight: 'bold',
                    fontSize: 20,
                    textAlign: 'center',
                    paddingLeft: '2%',
                    paddingRight: '2%',
                  }}>
                  House Quality
                </Text>
              </View>
              <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
            </View>
            <AirbnbRating
              showRating={true}
              selectedColor="black"
              defaultRating={userHouseQuality}
              onFinishRating={setUserHouseQuality}
              size={20}
              reviewColor="gray"
              reviewSize={13}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: '5%',
            }}>
            <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
            <View>
              <Text
                style={{
                  fontFamily: 'Iowan Old Style',
                  fontWeight: 'bold',
                  fontSize: 20,
                  textAlign: 'center',
                  paddingLeft: '2%',
                  paddingRight: '2%',
                }}>
                Rent Again
              </Text>
            </View>
            <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              paddingTop: '3%',
            }}>
            <TouchableOpacity style={styles.yesButton} onPress={handleYesClick}>
              <Icon name={thumbsUp} size={30} style={{color: '#538c50'}} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.noButton} onPress={handleNoClick}>
              <Icon name={thumbsDown} size={30} style={{color: '#FF5147'}} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: '5%',
            }}>
            <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
            <View>
              <Text
                style={{
                  fontFamily: 'Iowan Old Style',
                  fontWeight: 'bold',
                  fontSize: 20,
                  textAlign: 'center',
                  paddingLeft: '2%',
                  paddingRight: '2%',
                }}>
                Write a Comment
              </Text>
            </View>
            <View style={{flex: 1, height: 1, backgroundColor: '#DEDEDE'}} />
          </View>
          <TextInput
            style={styles.input}
            multiline={true}
            onChangeText={onChangeText}
            value={text}
            placeholder="How was your experience?"
          />
        </View>
      </ScrollView>
      <SafeAreaView
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          height: '15%',
          borderTopWidth: 0.2,
          borderColor: 'gray',
        }}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleReviewSubmit}
          disabled={!userRecommend}>
          <Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>
            Publish Review
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    input: {
      height: 180,
      margin: 20,
      borderWidth: 0.8,
      borderRadius: 10,
      textAlignVertical: 'top',
      padding: '2%',
      fontSize: 16,
      marginTop: '5%',
      marginBottom: '20%',
    },
    submitButton: {
      alignItems: 'center',
      backgroundColor: '#347544',
      borderWidth: 1.5,
      width: '92%',
      height: '50%',
      alignSelf: 'center',
      justifyContent: 'center',
      borderRadius: 20,
      borderColor:'#347544',
    },
    yesButton: {
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '7%',
    },
    noButton: {
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: '7%',
    },
  });

export default CreateReviewScreen;
