import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {
  doc,
  getDoc,
  query,
  onSnapshot,
  collection,
  DocumentData,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {db} from '../../config/firebase';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {AirbnbRating} from 'react-native-elements';
import {auth} from '../../config/firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ListItem} from '@rneui/themed';
import BigImageViewer from '../../components/BigImageViewer';
import {Modal} from '../../components/Modal';
import {ImageType, SearchStackParamList} from '../../utils/types';
import {StreamChat} from 'stream-chat';
import {useChatContext} from '../../context/ChatContext';

const imageData = [
  {
    uri: 'https://t4.ftcdn.net/jpg/04/00/24/31/240_F_400243185_BOxON3h9avMUX10RsDkt3pJ8iQx72kS3.jpg',
  },
];

const {width} = Dimensions.get('screen');
const height = width * 0.9;

type RentalDescriptionProps = NativeStackScreenProps<
  SearchStackParamList,
  'RentalDescription'
>;

let detailObj = {
  totalBathrooms: '',
  totalBedrooms: '',
  totalSquareFeet: '',
  statusOfRental: '',
  propertyDescription: '',
  rentalArea: '',
  monthlyRent: '',
  furnished: false,
  washerDryer: false,
  parking: false,
  internet: false,
  pool: false,
  airConditioning: false,
  dishwasher: false,
  privateBathroom: false,
  yard: false,
  homePictures: '',
};

const RentalDescription: React.FC<RentalDescriptionProps> = ({
  route,
  navigation,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [yesRecommendation, setYesRecommendation] = useState<number>(0);
  const [overallRating, setOverallRating] = useState<number>(0);
  const [landlordRating, setLandlordRating] = useState<number>(0);
  const [houseQuality, setHouseQuality] = useState<number>(0);
  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [allReviews, setAllReviews] = useState<DocumentData[]>([]);
  const [ownerUserId, setOwnerUserId] = useState<string>(route.params.ownerId);
  const [totalSquareFeet, setTotalSquareFeet] = useState<string>('');
  const [totalBathrooms, setTotalBathrooms] = useState<string>('');
  const [totalBedrooms, setTotalBedrooms] = useState<string>('');
  const [rentalArea, setRentalArea] = useState<string>('');
  const [propertyDescription, setPropertyDescription] = useState<string>('');
  const [statusOfRental, setStatusOfRental] = useState<string>('');
  const [monthlyRent, setMonthlyRent] = useState<string>('');
  const [furnished, setFurnished] = useState<string>('');
  const [washerDryer, setWasherDryer] = useState<string>('');
  const [internet, setInternet] = useState<string>('');
  const [privateBathroom, setPrivateBathroom] = useState<string>('');
  const [yard, setYard] = useState<string>('');
  const [pool, setPool] = useState<string>('');
  const [airConditioning, setAirConditioning] = useState<string>('');
  const [dishwasher, setDishwasher] = useState<string>('');
  const [parking, setParking] = useState<string>('');
  const [ownerFullName, setOwnerFullName] = useState<string>('');
  const [expandedPropInfo, setExpandedPropInfo] = useState<boolean>(false);
  const [expandedOwnerInfo, setExpandedOwnerInfo] = useState<boolean>(false);
  const [currUserReviewed, setCurrUserReviewed] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [homeImages, setHomeImages] = useState<ImageType[]>(imageData);
  const [showCreateReviewBtn, setShowCreateReviewBtn] = useState<boolean>(true);
  const [messageText, setMessageText] = useState<string>(
    'Hi, I am interested!',
  );
  const user = auth.currentUser;
  const userId = user?.uid ? user.uid : '';
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['3%', '14%', '90%'];
  const homeInfoRef = doc(db, 'HomeReviews', route.params.homeId);
  const homeReviewsQuery = query(
    collection(db, 'HomeReviews', route.params.homeId, 'IndividualRatings'),
  );
  const {setCurrentChannel} = useChatContext();

  useEffect(() => {
    const subscribe = onSnapshot(homeInfoRef, docSnapshot => {
      if (docSnapshot.exists()) {
        setTotalReviews(docSnapshot.data().totalReviews);
        setStreet(docSnapshot.data().address.street);
        setCity(docSnapshot.data().address.city);
        setState(docSnapshot.data().address.state);
        setPostalCode(docSnapshot.data().address.postalCode);
        setOverallRating(docSnapshot.data().overallRating.avgOverallRating);
        setYesRecommendation(docSnapshot.data().wouldRecommend.yes);
        setLandlordRating(
          docSnapshot.data().landlordService.avgLandlordService,
        );
        setHouseQuality(docSnapshot.data().houseQuality.avgHouseQuality);
        setOwnerUserId(docSnapshot.data().owner.userId);
        setTotalBathrooms(docSnapshot.data().totalBathrooms);
        setTotalBedrooms(docSnapshot.data().totalBedrooms);
        setTotalSquareFeet(docSnapshot.data().totalSquareFeet);
        setPropertyDescription(docSnapshot.data().propertyDescription);
        setStatusOfRental(docSnapshot.data().statusOfRental);
        setRentalArea(docSnapshot.data().rentalArea);
        setMonthlyRent(docSnapshot.data().monthlyRent);
        setFurnished(docSnapshot.data().furnished);
        setWasherDryer(docSnapshot.data().washerDryer);
        setInternet(docSnapshot.data().internet);
        setPrivateBathroom(docSnapshot.data().privateBathroom);
        setYard(docSnapshot.data().yard);
        setPool(docSnapshot.data().pool);
        setAirConditioning(docSnapshot.data().airConditioning);
        setDishwasher(docSnapshot.data().dishwasher);
        setParking(docSnapshot.data().parking);
        if (docSnapshot.data().homePictures)
          setHomeImages(docSnapshot.data().homePictures);

        if (docSnapshot.data().owner.userId === userId) {
          setShowCreateReviewBtn(false);
        }
      }
      setIsLoading(false);
    });
    return () => subscribe();
  }, []);

  useEffect(() => {
    const subscribe = onSnapshot(homeReviewsQuery, docSnapshot => {
      if (docSnapshot.size >= 1) {
        setAllReviews([]);
        docSnapshot.forEach(doc => {
          if (doc.data().reviewerEmail === user?.email) {
            setCurrUserReviewed(true);
          }
          setAllReviews(prevArr => [...prevArr, doc.data()]);
        });
      }
    });
    return () => subscribe();
  }, []);

  const handleClaimHome = async () => {
    const date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    const homeInfoRef = doc(db, 'HomeReviews', route.params.homeId);
    const homeInfoSnapshot = await getDoc(homeInfoRef);

    if (homeInfoSnapshot.exists()) {
      await updateDoc(homeInfoRef, {
        owner: {
          userId: userId,
        },
      });
      setOwnerUserId(userId);
      setShowCreateReviewBtn(false);
      setIsModalVisible(false);
      await setDoc(
        doc(db, 'UserReviews', userId, 'MyProperties', route.params.homeId),
        {
          homeId: route.params.homeId,
          fullAddress: homeInfoSnapshot.data().address.fullAddress,
          dateAdded: month + '/' + day + '/' + year,
          homePictures: null,
        },
      );
    }
  };

  const handleEdit = async () => {
    const homeInfoRef = doc(db, 'HomeReviews', route.params.homeId);
    const homeInfoSnapshot = await getDoc(homeInfoRef);
    if (homeInfoSnapshot.exists()) {
      const refData = homeInfoSnapshot.data();
      detailObj.totalBathrooms = refData.totalBathrooms;
      detailObj.totalBedrooms = refData.totalBedrooms;
      detailObj.totalSquareFeet = refData.totalSquareFeet;
      detailObj.statusOfRental = refData.statusOfRental;
      detailObj.propertyDescription = refData.propertyDescription;
      detailObj.monthlyRent = refData.monthlyRent;
      detailObj.rentalArea = refData.rentalArea;
      detailObj.furnished = refData.furnished;
      detailObj.washerDryer = refData.washerDryer;
      detailObj.dishwasher = refData.dishwasher;
      detailObj.privateBathroom = refData.privateBathroom;
      detailObj.yard = refData.yard;
      detailObj.pool = refData.pool;
      detailObj.internet = refData.internet;
      detailObj.airConditioning = refData.airConditioning;
      detailObj.parking = refData.parking;
      detailObj.homePictures = refData.homePictures;
    }
    navigation.removeListener;
    navigation.navigate('PostRentalScreen', {
      homeId: route.params.homeId,
      homeDetails: detailObj,
    });
  };

  const handleCreateReview = () => {
    navigation.removeListener;
    navigation.navigate('CreateReview', {homeId: route.params.homeId});
  };

  const handleMessageOwner = async () => {
    if (ownerUserId !== '') {
      const client = StreamChat.getInstance('pn73rx5c7g26');

      const channel = client.channel('messaging', {
        members: [userId, ownerUserId],
        name: street,
        image: homeImages[0].uri,
      });

      await channel.create();

      await channel.sendMessage({
        text: messageText,
        customField: '123',
      });

      setCurrentChannel(channel);

      navigation.removeListener;
      navigation.navigate('ChatRoom');
    }
  };

  return (
    <GestureHandlerRootView style={styles.rootView}>
      {isLoading ? (
        <ActivityIndicator
          style={{
            height: '100%',
            alignContent: 'center',
            justifyContent: 'center',
          }}
          size="large"
          color="#1f3839"
        />
      ) : (
        <>
          <ScrollView>
            <Modal isVisible={isModalVisible}>
              <Modal.Container>
                <Modal.Header title="Claim this home?" />
                <Modal.Body>
                  <Text></Text>
                  <Text>
                    Are you sure you want to claim this home? By clicking
                    Confirm you accept all terms and agreements.
                  </Text>
                  <Text></Text>
                </Modal.Body>
                <Modal.Footer>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}>
                    <TouchableOpacity
                      style={styles.modalConfirmButton}
                      onPress={handleClaimHome}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: '#347544',
                        }}>
                        Confirm
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalCancelButton}
                      onPress={() => {
                        setIsModalVisible(!isModalVisible);
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: 'white',
                        }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Modal.Footer>
              </Modal.Container>
            </Modal>
            <View>
              {homeImages.length > 0 ? (
                <BigImageViewer homeImages={homeImages} />
              ) : (
                <BigImageViewer homeImages={imageData} />
              )}
              {userId === ownerUserId ? (
                <View style={styles.editButton}>
                  <TouchableOpacity
                    style={styles.roundButton1}
                    onPress={handleEdit}>
                    <Text style={{paddingLeft: '5%', paddingRight: '5%'}}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : ownerUserId === '' ? (
                <View style={styles.claimButton}>
                  <TouchableOpacity
                    style={styles.roundButton1}
                    onPress={() => {
                      setIsModalVisible(true);
                    }}>
                    <Text style={{paddingLeft: '2%', paddingRight: '2%'}}>
                      Claim Home
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.alreadyClaimedButton}>
                  <TouchableOpacity style={styles.roundButton1} disabled={true}>
                    <Text style={{paddingLeft: '1%', paddingRight: '1%'}}>
                      Already Claimed
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              <View style={styles.backButton}>
                <TouchableOpacity
                  style={styles.roundButton1}
                  onPress={() => navigation.goBack()}>
                  <Icon name={'chevron-back-outline'} color="black" size={25} />
                </TouchableOpacity>
              </View>
            </View>
            {ownerUserId !== '' ? (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingRight: '3%',
                    paddingLeft: '3%',
                    marginTop: '1%',
                  }}>
                  {monthlyRent !== '' ? (
                    <Text
                      style={{
                        fontSize: 25,
                        fontWeight: 'bold',
                        paddingRight: '3%',
                      }}>
                      ${monthlyRent}/month
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 23,
                        fontWeight: 'bold',
                        paddingRight: '3%',
                      }}>
                      Monthly Rent: N/A
                    </Text>
                  )}
                  <View
                    style={{
                      backgroundColor: '#347544',
                      borderRadius: 5,
                      alignSelf: 'center',
                    }}>
                    {rentalArea !== '' ? (
                      <Text
                        style={{
                          padding: '1%',
                          color: 'white',
                          fontWeight: 'bold',
                        }}>
                        {rentalArea}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          padding: '1%',
                          color: 'white',
                          fontWeight: 'bold',
                        }}>
                        Type: N/A
                      </Text>
                    )}
                  </View>
                </View>
                <Text style={styles.addressLine2}>
                  <MaterialIcon name="map-marker" color={'gray'} size={15} />
                  {street}, {city}, {state} {postalCode}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    marginTop: '2%',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#F7F7F7',
                      borderRadius: 7,
                    }}>
                    <Icon
                      name="home-outline"
                      size={25}
                      style={{paddingLeft: '3%'}}
                    />
                    {totalSquareFeet !== '' ? (
                      <Text
                        style={{
                          fontSize: 15,
                          paddingLeft: '2%',
                          paddingRight: '3%',
                        }}>
                        {totalSquareFeet} sqft.
                      </Text>
                    ) : (
                      <Text
                        style={{
                          fontSize: 15,
                          paddingLeft: '2%',
                          paddingRight: '3%',
                        }}>
                        N/A
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#F7F7F7',
                      borderRadius: 7,
                    }}>
                    <MaterialIcon
                      name="bathtub-outline"
                      size={30}
                      style={{paddingLeft: '3%'}}
                    />
                    {totalBathrooms !== '' ? (
                      <Text
                        style={{
                          fontSize: 15,
                          paddingLeft: '2%',
                          paddingRight: '3%',
                        }}>
                        {totalBathrooms} Bath
                      </Text>
                    ) : (
                      <Text
                        style={{
                          fontSize: 15,
                          paddingLeft: '2%',
                          paddingRight: '3%',
                        }}>
                        N/A
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#F7F7F7',
                      borderRadius: 7,
                    }}>
                    <Icon
                      name="bed-outline"
                      size={30}
                      style={{paddingLeft: '3%'}}
                    />
                    {totalBedrooms !== '' ? (
                      <Text
                        style={{
                          fontSize: 15,
                          paddingLeft: '2%',
                          paddingRight: '3%',
                        }}>
                        {totalBedrooms} Beds
                      </Text>
                    ) : (
                      <Text
                        style={{
                          fontSize: 15,
                          paddingLeft: '2%',
                          paddingRight: '3%',
                        }}>
                        N/A
                      </Text>
                    )}
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: '4%',
                    paddingLeft: '4%',
                  }}>
                  <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                    Rental Status:
                  </Text>
                  <View style={styles.status}>
                    {statusOfRental === 'Available' ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          paddingLeft: '2%',
                        }}>
                        <View style={styles.AvailableStatus} />
                        <Text
                          style={{
                            fontSize: 14,
                            textAlign: 'center',
                            padding: '1%',
                          }}>
                          {statusOfRental}
                        </Text>
                      </View>
                    ) : statusOfRental === 'Not Renting' ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          paddingLeft: '2%',
                        }}>
                        <View style={styles.notRentingStatus} />
                        <Text
                          style={{
                            fontSize: 14,
                            textAlign: 'center',
                            padding: '1%',
                          }}>
                          {statusOfRental}
                        </Text>
                      </View>
                    ) : statusOfRental === 'Occupied' ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          paddingLeft: '2%',
                        }}>
                        <View style={styles.occupiedStatus} />
                        <Text
                          style={{
                            fontSize: 14,
                            textAlign: 'center',
                            padding: '1%',
                          }}>
                          {statusOfRental}
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          paddingLeft: '2%',
                        }}>
                        <View style={styles.unknownStatus} />
                        <Text
                          style={{
                            fontSize: 14,
                            textAlign: 'center',
                            padding: '1%',
                          }}>
                          Unknown
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <ListItem.Accordion
                  content={
                    <ListItem.Content>
                      <ListItem.Title
                        style={{
                          fontSize: 17,
                          color: 'black',
                          fontWeight: 'bold',
                          marginTop: '3%',
                        }}>
                        Property Information
                      </ListItem.Title>
                    </ListItem.Content>
                  }
                  isExpanded={expandedPropInfo}
                  onPress={() => {
                    setExpandedPropInfo(!expandedPropInfo);
                  }}>
                  <ListItem containerStyle={{paddingTop: 0, paddingBottom: 0}}>
                    <ListItem.Content>
                      <View style={styles.rentalInfo}>
                        {washerDryer && (
                          <View style={{width: '50%'}}>
                            <Text>
                              <Text
                                style={{
                                  fontWeight: 'bold',
                                  textAlign: 'center',
                                }}>
                                Washer/Dryer:
                              </Text>
                              <Text>Yes</Text>
                            </Text>
                          </View>
                        )}
                        {furnished && (
                          <View style={{width: '50%'}}>
                            <Text>
                              <Text
                                style={{
                                  fontWeight: 'bold',
                                  textAlign: 'center',
                                }}>
                                Furnished:
                              </Text>
                              <Text>Yes</Text>
                            </Text>
                          </View>
                        )}
                        {internet && (
                          <View style={{width: '50%'}}>
                            <Text>
                              <Text
                                style={{
                                  fontWeight: 'bold',
                                  textAlign: 'center',
                                }}>
                                Internet:
                              </Text>
                              <Text>Yes</Text>
                            </Text>
                          </View>
                        )}
                        {privateBathroom && (
                          <View style={{width: '50%'}}>
                            <Text>
                              <Text
                                style={{
                                  fontWeight: 'bold',
                                  textAlign: 'center',
                                }}>
                                Private Bathroom:
                              </Text>
                              <Text>Yes</Text>
                            </Text>
                          </View>
                        )}
                        {parking && (
                          <View style={{width: '50%'}}>
                            <Text>
                              <Text
                                style={{
                                  fontWeight: 'bold',
                                  textAlign: 'center',
                                }}>
                                Free Parking:
                              </Text>
                              <Text>Yes</Text>
                            </Text>
                          </View>
                        )}
                        {dishwasher && (
                          <View style={{width: '50%'}}>
                            <Text>
                              <Text
                                style={{
                                  fontWeight: 'bold',
                                  textAlign: 'center',
                                }}>
                                Dishwasher:
                              </Text>
                              <Text>Yes</Text>
                            </Text>
                          </View>
                        )}
                        {pool && (
                          <View style={{width: '50%'}}>
                            <Text>
                              <Text
                                style={{
                                  fontWeight: 'bold',
                                  textAlign: 'center',
                                }}>
                                Pool:
                              </Text>
                              <Text>Yes</Text>
                            </Text>
                          </View>
                        )}
                        {yard && (
                          <View style={{width: '50%'}}>
                            <Text>
                              <Text
                                style={{
                                  fontWeight: 'bold',
                                  textAlign: 'center',
                                }}>
                                Yard:
                              </Text>
                              <Text>Yes</Text>
                            </Text>
                          </View>
                        )}
                        {airConditioning && (
                          <View style={{width: '50%'}}>
                            <Text>
                              <Text
                                style={{
                                  fontWeight: 'bold',
                                  textAlign: 'center',
                                }}>
                                Air Conditioning:
                              </Text>
                              <Text>Yes</Text>
                            </Text>
                          </View>
                        )}
                      </View>
                    </ListItem.Content>
                  </ListItem>
                </ListItem.Accordion>
                {showCreateReviewBtn ? (
                  <ListItem.Accordion
                    content={
                      <ListItem.Content>
                        <ListItem.Title
                          style={{
                            fontSize: 17,
                            color: 'black',
                            fontWeight: 'bold',
                          }}>
                          Contact Owner?
                        </ListItem.Title>
                      </ListItem.Content>
                    }
                    isExpanded={expandedOwnerInfo}
                    onPress={() => {
                      setExpandedOwnerInfo(!expandedOwnerInfo);
                    }}>
                    <ListItem
                      containerStyle={{
                        paddingTop: 0,
                        paddingBottom: 0,
                      }}>
                      <ListItem.Content>
                        <TextInput
                          style={styles.input}
                          multiline={true}
                          onChangeText={setMessageText}
                          value={messageText}
                        />
                        <TouchableOpacity
                          disabled={!showCreateReviewBtn}
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
                      </ListItem.Content>
                    </ListItem>
                  </ListItem.Accordion>
                ) : null}
              </View>
            ) : (
              <View>
                <Text style={styles.addressLine1}>{street}</Text>
                <Text
                  style={[
                    styles.addressLine2,
                    {color: 'gray', textAlign: 'center'},
                  ]}>
                  {city},{state}, {postalCode}
                </Text>

                <View style={{justifyContent: 'center', marginTop: '5%'}}>
                  <View
                    style={{
                      backgroundColor: '#ededed',
                      marginLeft: '4%',
                      marginRight: '4%',
                      borderRadius: 20,
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        paddingTop: '2%',
                      }}>
                      Home Not Claimed
                    </Text>
                    <Text
                      style={{
                        marginLeft: '4%',
                        marginRight: '4%',
                        marginTop: '2%',
                        paddingBottom: '3%',
                      }}>
                      <Text style={{fontWeight: '300'}}>Owner: </Text>If this is
                      your property, click{' '}
                      <Text style={{fontWeight: 'bold'}}>Claim Home</Text> and
                      enter all necessary details.
                    </Text>
                    <Text
                      style={{
                        marginLeft: '4%',
                        marginRight: '4%',
                        paddingBottom: '5%',
                      }}>
                      <Text style={{fontWeight: '300'}}>Tenant: </Text>If you
                      have stayed at this property, feel free to leave a review
                      to help others.
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
          <BottomSheet
            style={styles.bottomSheetShadow}
            ref={sheetRef}
            snapPoints={snapPoints}
            index={1}>
            <BottomSheetScrollView>
              <View style={styles.inlineContainer}>
                {totalReviews > 0 && overallRating > 0 ? (
                  <>
                    <Text style={styles.rating}>
                      {overallRating.toFixed(1)}
                    </Text>
                    <Icon name="star" color="black" size={28} />
                  </>
                ) : (
                  <Text style={[styles.rating, {fontSize: 20}]}>
                    No Ratings Yet
                  </Text>
                )}
                <View style={styles.inlineContainer}>
                  <View style={styles.totalRentersContainer}>
                    {totalReviews > 0 ? (
                      <>
                        <Text style={styles.renters}>
                          {'('}
                          {totalReviews} Reviews{')'}
                        </Text>
                        {currUserReviewed ? (
                          <TouchableOpacity
                            disabled
                            style={styles.alreadyReviewButton}>
                            <Text style={{color: 'green', fontSize: 12}}>
                              Already Reviewed ✔
                            </Text>
                          </TouchableOpacity>
                        ) : showCreateReviewBtn ? (
                          <TouchableOpacity
                            style={styles.button}
                            onPress={handleCreateReview}>
                            <Text style={{color: 'blue'}}>Add Review</Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity style={styles.button} disabled>
                            <Text
                              style={{
                                position: 'absolute',
                                right: '2%',
                                top: -10,
                                color: 'grey',
                              }}>
                              Claimed Property
                            </Text>
                          </TouchableOpacity>
                        )}
                      </>
                    ) : showCreateReviewBtn ? (
                      <TouchableOpacity
                        style={styles.button}
                        onPress={handleCreateReview}>
                        <Text
                          style={{
                            position: 'absolute',
                            right: '2%',
                            top: -10,
                            color: 'blue',
                          }}>
                          Add Review
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={styles.button} disabled>
                        <Text
                          style={{
                            position: 'absolute',
                            right: '2%',
                            top: -10,
                            color: 'grey',
                          }}>
                          Claimed Property
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
              <View style={styles.miscRating}>
                <View style={styles.inlineContainer}>
                  <View style={styles.rating1}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 14,
                        color: '#347544',
                        fontStyle: 'italic',
                        fontWeight: 'bold',
                        width: '60%',
                      }}>
                      Rent Again
                    </Text>
                    {totalReviews > 0 ? (
                      <Text style={{fontWeight: 'bold', fontSize: 12}}>
                        {((yesRecommendation / totalReviews) * 100).toFixed(0)}%
                      </Text>
                    ) : (
                      <Text
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: 12,
                        }}>
                        N/A
                      </Text>
                    )}
                  </View>
                  <View style={styles.rating1}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 14,
                        color: '#347544',
                        fontStyle: 'italic',
                        fontWeight: 'bold',
                        width: '80%',
                      }}>
                      Landlord Rating
                    </Text>
                    {totalReviews > 0 && landlordRating > 0 ? (
                      <Text
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: 12,
                        }}>
                        {landlordRating.toFixed(1)}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: 12,
                        }}>
                        N/A
                      </Text>
                    )}
                  </View>
                </View>
                <View
                  style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                  <View style={styles.rating1}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 14,
                        color: '#347544',
                        fontStyle: 'italic',
                        fontWeight: 'bold',
                        width: '70%',
                      }}>
                      House Quality
                    </Text>
                    {totalReviews > 0 && houseQuality > 0 ? (
                      <Text
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: 12,
                        }}>
                        {houseQuality.toFixed(1)}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: 12,
                        }}>
                        N/A
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              {allReviews.map(review => (
                <View
                  key={review.reviewerEmail}
                  style={{
                    paddingTop: '5%',
                    paddingLeft: '2%',
                    paddingRight: '2%',
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 50,
                        marginTop: '1%',
                      }}
                      source={{
                        uri: 'https://source.unsplash.com/1024x768/?user',
                      }}
                    />
                    <Text
                      style={{
                        paddingLeft: '1%',
                        fontWeight: 'bold',
                        fontSize: 14,
                      }}>
                      {review.reviewerUsername}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <AirbnbRating
                      showRating={false}
                      selectedColor="black"
                      defaultRating={review.overallRating}
                      size={10}
                      isDisabled={true}
                    />
                    <Text
                      style={{color: 'gray', fontSize: 11, paddingLeft: '2%'}}>
                      {review.dateOfReview}
                    </Text>
                  </View>
                  <Text style={{paddingLeft: '1%', paddingRight: '1%'}}>
                    {review.additionalComment}
                  </Text>
                  <View
                    style={{
                      borderBottomColor: 'gray',
                      borderBottomWidth: 0.5,
                      paddingTop: '5%',
                    }}
                  />
                </View>
              ))}
            </BottomSheetScrollView>
          </BottomSheet>
        </>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: 'white',
  },
  rentalInfo: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
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
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
  },
  rating: {
    fontSize: 30,
    paddingLeft: '5%',
    fontWeight: '600',
  },
  totalRentersContainer: {
    flex: 1,
  },
  renters: {
    fontSize: 20,
    marginLeft: '2%',
  },
  addressLines: {
    width: '100%',
    marginBottom: '2%',
  },
  addressLine1: {
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 22,
  },
  addressLine2: {
    paddingLeft: '3%',
    fontSize: 14,
    marginBottom: '1%',
  },
  rating1: {
    width: '40%',
    marginLeft: '6%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    position: 'absolute',
    top: 5,
    left: 200,
    color: 'blue',
  },
  alreadyReviewButton: {
    position: 'absolute',
    top: 5,
    left: 170,
    color: 'blue',
  },
  submitButton: {
    width: '25%',
    backgroundColor: '#1f3839',
    borderRadius: 20,
    padding: 10,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  modalConfirmButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#347544',
    borderRadius: 50,
    width: '45%',
    paddingTop: '2%',
    paddingBottom: '2%',
  },
  modalCancelButton: {
    alignItems: 'center',
    backgroundColor: '#848484',
    borderColor: '#848484',
    borderWidth: 1,
    borderRadius: 50,
    width: '45%',
    paddingTop: '2%',
    paddingBottom: '2%',
  },
  miscRating: {
    marginTop: '5%',
  },
  backButton: {
    position: 'absolute',
    top: '15%',
    left: '5%',
    flexDirection: 'row',
    width: 200,
  },
  claimButton: {
    position: 'absolute',
    top: '15%',
    left: '73%',
    flexDirection: 'row',
    width: 250,
  },
  occupiedStatus: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: 'red',
    alignSelf: 'center',
  },
  AvailableStatus: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: 'green',
    alignSelf: 'center',
  },
  notRentingStatus: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: 'black',
    alignSelf: 'center',
  },
  unknownStatus: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: 'gray',
    alignSelf: 'center',
  },
  editButton: {
    position: 'absolute',
    top: '15%',
    left: '78%',
    flexDirection: 'row',
    width: 250,
  },
  status: {
    marginRight: '2%',
  },
  alreadyClaimedButton: {
    position: 'absolute',
    top: '15%',
    left: '67%',
    flexDirection: 'row',
    width: 250,
  },
  image: {
    width: width,
    height: height,
    borderColor: 'black',
    borderWidth: 1,
  },
  roundButton1: {
    borderRadius: 50,
    padding: '2%',
    backgroundColor: '#D3D3D3',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundButton2: {
    borderRadius: 50,
    padding: '1%',
    backgroundColor: '#F7F7F7',
    opacity: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 35,
    borderWidth: 0.8,
    borderRadius: 10,
    textAlignVertical: 'top',
    width: '100%',
    fontSize: 16,
    marginBottom: '5%',
    paddingLeft: '2%',
  },
});

export default RentalDescription;
