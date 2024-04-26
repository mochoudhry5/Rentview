import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {AirbnbRating} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {db, auth} from '../../config/firebase';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {EditReviewProps} from '../../utils/types';
import {Modal} from '../../components/Modal';

const EditReviewScreen: React.FC<EditReviewProps> = ({
  currentPropertyReview,
  setOnEdit,
}) => {
  const [oldHouseQuality, setOldHouseQuality] = useState<number>(0);
  const [oldRecommendation, setOldRecommendation] = useState<boolean>(false);
  const [oldOverallRating, setOldOverallRating] = useState<number>(0);
  const [oldLandlordRating, setOldLandlordRating] = useState<number>(0);
  const [oldComment, setOldComment] = useState<string>('');
  const [newHouseQuality, setNewHouseQuality] = useState<number>(0);
  const [newRecommendation, setNewRecommendation] = useState<boolean>(false);
  const [newOverallRating, setNewOverallRating] = useState<number>(0);
  const [newLandlordRating, setNewLandlordRating] = useState<number>(0);
  const [newComment, setNewComment] = useState<string>('');
  const [thumbsUp, setThumbsUp] = useState<string>('thumbs-up-outline');
  const [thumbsDown, setThumbsDown] = useState<string>('thumbs-down-outline');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const user = auth.currentUser;
  const userId = user?.uid ? user.uid : '';
  const homeId = currentPropertyReview?.homeId;
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['1%', '100%'];

  useEffect(() => {
    if (currentPropertyReview) {
      setOldHouseQuality(currentPropertyReview.houseRating);
      setOldRecommendation(currentPropertyReview.recommendHouseRating);
      setOldOverallRating(currentPropertyReview.overallRating);
      setOldLandlordRating(currentPropertyReview.landlordServiceRating);
      setOldComment(currentPropertyReview.additionalComment);
      currentPropertyReview.recommendHouseRating
        ? handleYesClick()
        : handleNoClick();
      setNewHouseQuality(currentPropertyReview.houseRating);
      setNewRecommendation(currentPropertyReview.recommendHouseRating);
      setNewOverallRating(currentPropertyReview.overallRating);
      setNewLandlordRating(currentPropertyReview.landlordServiceRating);
      setNewComment(currentPropertyReview.additionalComment);
    }
  }, []);

  const handleYesClick = () => {
    if (thumbsUp == 'thumbs-up-outline') {
      setThumbsDown('thumbs-down-outline');
      setThumbsUp('thumbs-up');
      setNewRecommendation(true);
    } else {
      setThumbsUp('thumbs-up-outline');
      setNewRecommendation(false);
    }
  };

  const handleNoClick = () => {
    if (thumbsDown == 'thumbs-down-outline') {
      setThumbsDown('thumbs-down');
      setThumbsUp('thumbs-up-outline');
      setNewRecommendation(false);
    } else {
      setThumbsDown('thumbs-down-outline');
      setNewRecommendation(false);
    }
  };

  const handleSheetChanges = useCallback((index: number) => {
    if (index == 0) {
      if (sheetRef.current) {
        sheetRef.current.close();
      }
      setOnEdit(false);
    }
  }, []);

  const updateReview = async () => {
    const homeInfoRef = doc(db, 'HomeReviews', homeId);
    const userSideReviewRef = doc(db, 'UserReviews', userId, 'Reviews', homeId);
    const homeSideUserReviewRef = doc(
      db,
      'HomeReviews',
      homeId,
      'IndividualRatings',
      userId,
    );
    const homeInfoSnapshot = await getDoc(homeInfoRef);

    if (homeInfoSnapshot.exists()) {
      var totalReviews = homeInfoSnapshot.data().totalReviews;

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

      if (oldRecommendation !== newRecommendation) {
        if (oldRecommendation) {
          recommendation.yes -= 1;
        } else {
          recommendation.no -= 1;
        }

        if (newRecommendation) {
          recommendation.yes += 1;
        } else {
          recommendation.no += 1;
        }
        setOldRecommendation(newRecommendation);
      }

      if (oldOverallRating !== newOverallRating) {
        if (oldOverallRating === 1) {
          rating.oneStar -= 1;
        } else if (oldOverallRating === 2) {
          rating.twoStar -= 1;
        } else if (oldOverallRating === 3) {
          rating.threeStar -= 1;
        } else if (oldOverallRating === 4) {
          rating.fourStar -= 1;
        } else {
          rating.fiveStar -= 1;
        }

        if (newOverallRating === 1) {
          rating.oneStar += 1;
        } else if (newOverallRating === 2) {
          rating.twoStar += 1;
        } else if (newOverallRating === 3) {
          rating.threeStar += 1;
        } else if (newOverallRating === 4) {
          rating.fourStar += 1;
        } else {
          rating.fiveStar += 1;
        }
        setOldOverallRating(newOverallRating);
      }

      if (oldLandlordRating !== newLandlordRating) {
        if (oldLandlordRating === 1) {
          landlordRating.oneStar -= 1;
        } else if (oldLandlordRating === 2) {
          landlordRating.twoStar -= 1;
        } else if (oldLandlordRating === 3) {
          landlordRating.threeStar -= 1;
        } else if (oldLandlordRating === 4) {
          landlordRating.fourStar -= 1;
        } else {
          landlordRating.fiveStar -= 1;
        }

        if (newLandlordRating === 1) {
          landlordRating.oneStar += 1;
        } else if (newLandlordRating === 2) {
          landlordRating.twoStar += 1;
        } else if (newLandlordRating === 3) {
          landlordRating.threeStar += 1;
        } else if (newLandlordRating === 4) {
          landlordRating.fourStar += 1;
        } else {
          landlordRating.fiveStar += 1;
        }
        setOldLandlordRating(newLandlordRating);
      }

      if (oldHouseQuality !== newHouseQuality) {
        if (oldHouseQuality === 1) {
          houseRating.oneStar -= 1;
        } else if (oldHouseQuality === 2) {
          houseRating.twoStar -= 1;
        } else if (oldHouseQuality === 3) {
          houseRating.threeStar -= 1;
        } else if (oldHouseQuality === 4) {
          houseRating.fourStar -= 1;
        } else {
          houseRating.fiveStar -= 1;
        }

        if (newHouseQuality === 1) {
          houseRating.oneStar += 1;
        } else if (newHouseQuality === 2) {
          houseRating.twoStar += 1;
        } else if (newHouseQuality === 3) {
          houseRating.threeStar += 1;
        } else if (newHouseQuality === 4) {
          houseRating.fourStar += 1;
        } else {
          houseRating.fiveStar += 1;
        }
        setOldHouseQuality(newHouseQuality);
      }

      if (oldComment !== newComment) {
        setOldComment(newComment);
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
    }

    await updateDoc(homeSideUserReviewRef, {
      landlordServiceRating: newLandlordRating,
      recommendHouseRating: newRecommendation,
      houseQualityRating: newHouseQuality,
      overallRating: newOverallRating,
      additionalComment: newComment,
    });

    await updateDoc(userSideReviewRef, {
      landlordServiceRating: newLandlordRating,
      overallRating: newOverallRating,
      houseRating: newHouseQuality,
      recommendHouseRating: newRecommendation,
      additionalComment: newComment,
    });

    setOnEdit(false);
  };

  const handleModalClose = () => {};

  return (
    <>
      <BottomSheet
        style={styles.bottomSheetShadow}
        ref={sheetRef}
        snapPoints={snapPoints}
        index={1}
        onChange={handleSheetChanges}>
        <BottomSheetScrollView>
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
              defaultRating={newOverallRating}
              onFinishRating={setNewOverallRating}
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
                paddingTop: '7%',
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
              defaultRating={newLandlordRating}
              onFinishRating={setNewLandlordRating}
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
                paddingTop: '7%',
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
              defaultRating={newHouseQuality}
              onFinishRating={setNewHouseQuality}
              size={20}
              reviewColor="gray"
              reviewSize={13}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: '7%',
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
              paddingTop: '2%',
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
            onChangeText={setNewComment}
            value={newComment}
          />
        </BottomSheetScrollView>
        <SafeAreaView
          style={{
            width: '100%',
            height: '15%',
            justifyContent: 'center',
            borderTopWidth: 0.2,
            borderColor: 'gray',
          }}>
          <TouchableOpacity style={styles.submitButton} onPress={updateReview}>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>
              Update Review
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </BottomSheet>
      <View>
        <Modal
          isVisible={isVisible}
          animationIn={'lightSpeedIn'}
          onBackdropPress={handleModalClose}>
          <Modal.Container>
            <Modal.Header title="Review Updated" />
            <Modal.Body>
              <Text
                style={{
                  marginLeft: '5%',
                  marginTop: '5%',
                  color: 'black',
                  fontSize: 20,
                  textAlign: 'center',
                }}>
                Your review was successfully updated! Changes should be seen
                immediately.
              </Text>
            </Modal.Body>
            <Modal.Footer>
              <TouchableOpacity
                style={styles.closeModal}
                onPress={handleModalClose}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: 'white',
                  }}>
                  Okay
                </Text>
              </TouchableOpacity>
            </Modal.Footer>
          </Modal.Container>
        </Modal>
      </View>
    </>
  );
};

export default EditReviewScreen;

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    input: {
      height: 150,
      borderWidth: 0.8,
      borderRadius: 10,
      textAlignVertical: 'top',
      padding: '2%',
      fontSize: 16,
      marginLeft: '5%',
      marginRight: '5%',
      marginTop: '5%',
      marginBottom: '20%',
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
    submitButton: {
      alignItems: 'center',
      backgroundColor: '#347544',
      borderWidth: 1,
      width: '92%',
      height: '35%',
      alignSelf: 'center',
      justifyContent: 'center',
      borderRadius: 20,
      marginBottom: '10%',
      borderColor: '#347544',
    },
    bottomSheetShadow: {
      backgroundColor: 'white',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.58,
      shadowRadius: 16.0,
      elevation: 24,
    },
    closeModal: {
      alignItems: 'center',
      backgroundColor: '#1f3839',
      borderWidth: 1,
      width: '88%',
      height: 40,
      alignSelf: 'center',
      justifyContent: 'center',
      marginTop: '5%',
      marginBottom: '5%',
    },
  });
