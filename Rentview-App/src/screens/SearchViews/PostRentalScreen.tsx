import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import {doc, getDoc, setDoc, updateDoc} from 'firebase/firestore';
import React, {useState} from 'react';
import TinyImageViewer from '../../components/TinyImageViewer';
import {Dropdown} from 'react-native-element-dropdown';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {db, auth} from '../../config/firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import {ImageType, SearchStackParamList} from '../../utils/types';

type PostPropertyScreen = NativeStackScreenProps<
  SearchStackParamList,
  'PostRentalScreen'
>;

const rentalStatus = [
  {label: 'Available', value: 'Available'},
  {label: 'Occupied', value: 'Occupied'},
  {label: 'Not Renting', value: 'Not Renting'},
];

const rentalAreaSelections = [
  {label: 'Private Room', value: 'Private Room'},
  {label: 'Entire House', value: 'Entire House'},
];

const PostRentalScreen: React.FC<PostPropertyScreen> = ({
  route,
  navigation,
}) => {
  const homeDetails = route.params.homeDetails;
  const [images, setImages] = useState<ImageType[]>([]);
  const [totalBedrooms, setTotalBedrooms] = useState<string>(
    homeDetails.totalBedrooms,
  );
  const [totalBathrooms, setTotalBathrooms] = useState<string>(
    homeDetails.totalBathrooms,
  );
  const [totalSquareFeet, setTotalSquareFeet] = useState<string>(
    homeDetails.totalSquareFeet,
  );
  const [statusOfRental, setStatusOfRental] = useState<string>(
    homeDetails.statusOfRental,
  );
  const [rentalArea, setRentalArea] = useState<string>(homeDetails.rentalArea);
  const [propertyDescription, setPropertyDescription] = useState<string>(
    homeDetails.propertyDescription,
  );
  const [monthlyRent, setMonthlyRent] = useState<string>(
    homeDetails.monthlyRent,
  );
  const [isFurnished, setIsFurnished] = useState<boolean>(
    homeDetails.furnished,
  );
  const [isWasherDryer, setIsWasherDryer] = useState<boolean>(
    homeDetails.washerDryer,
  );
  const [isFreeParking, setIsFreeParking] = useState<boolean>(
    homeDetails.parking,
  );
  const [isInternet, setIsInternet] = useState<boolean>(homeDetails.internet);
  const [isAirConditioning, setIsAirConditioning] = useState<boolean>(
    homeDetails.airConditioning,
  );
  const [isPrivateBathroom, setIsPrivateBathroom] = useState<boolean>(
    homeDetails.privateBathroom,
  );
  const [isDishwasher, setIsDishwasher] = useState<boolean>(
    homeDetails.dishwasher,
  );
  const [isYard, setIsYard] = useState<boolean>(homeDetails.yard);
  const [isPool, setIsPool] = useState<boolean>(homeDetails.pool);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const pictureUris: ImageType[] = [];
  const user = auth.currentUser;
  const userId = user?.uid ? user.uid : '';
  const [validEntry, setValidEntry] = useState<boolean>(true);

  const handlePostSubmit = async () => {
    setIsModalVisible(true);
    const homeInfoRef = doc(db, 'HomeReviews', route.params.homeId);
    const homeInfoSnapshot = await getDoc(homeInfoRef);
    const userInfoRef = doc(
      db,
      'UserReviews',
      userId,
      'MyProperties',
      route.params.homeId,
    );

    if (
      monthlyRent === '' ||
      totalBathrooms === '' ||
      totalBedrooms === '' ||
      statusOfRental === 'Unknown' ||
      totalSquareFeet === '' ||
      rentalArea === '' ||
      images.length < 3
    ) {
      setValidEntry(false);
    } else {
      if (homeInfoSnapshot.exists()) {
        await uploadImages();

        await updateDoc(homeInfoRef, {
          totalSquareFeet: totalSquareFeet,
          totalBedrooms: totalBedrooms,
          totalBathrooms: totalBathrooms,
          statusOfRental: statusOfRental,
          propertyDescription: propertyDescription,
          rentalArea: rentalArea,
          monthlyRent: monthlyRent,
          furnished: isFurnished,
          washerDryer: isWasherDryer,
          parking: isFreeParking,
          airConditioning: isAirConditioning,
          privateBathroom: isPrivateBathroom,
          dishwasher: isDishwasher,
          yard: isYard,
          pool: isPool,
          internet: isInternet,
          homePictures: pictureUris,
        });

        await updateDoc(userInfoRef, {
          homePictures: pictureUris,
        });

        await updateDoc(
          doc(db, 'UserReviews', userId, 'MyProperties', route.params.homeId),
          {
            homePictures: pictureUris[0],
          },
        );
      }

      navigation.removeListener;
      navigation.navigate('RentalDescription', {
        homeId: route.params.homeId,
        ownerId: userId,
      });
    }
    setIsModalVisible(false);
  };

  async function uploadImages() {
    const homeImagePath = `homeImages/${route.params.homeId}`;
    const storage = getStorage();

    for (const image of images) {
      if (image.uri) {
        const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1);
        const uploadUri = image.uri.replace('file://', '');
        let storageRef = ref(storage, `${homeImagePath}/${filename}`);
        let response = await fetch(uploadUri);
        let blob = await response.blob();

        const snapshotRef = await uploadBytesResumable(storageRef, blob);
        const uri = await getDownloadURL(snapshotRef.ref);
        const uriFormat: ImageType = {uri: uri};
        pictureUris.push(uriFormat);
      }
    }
  }

  const closeModal = () => {
    setValidEntry(true);
  };

  return (
    <View style={{flex: 1, paddingTop: '2%', backgroundColor: 'white'}}>
      <ScrollView>
        <View style={styles.centeredView}>
          <Modal
            animationType="fade"
            visible={isModalVisible}
            transparent={true}
            onRequestClose={() => {
              setIsModalVisible(!isModalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <ActivityIndicator
                  style={{
                    alignContent: 'center',
                    justifyContent: 'center',
                  }}
                  color="#1f3839"
                />
                <Text style={styles.modalText}>Uploading your Rental</Text>
              </View>
            </View>
          </Modal>
        </View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            marginTop: '2%',
            marginLeft: '4%',
          }}>
          Upload Images{' '}
          <Text style={{color: 'gray', fontSize: 12}}>(Min. 3 images)</Text>
        </Text>
        <TinyImageViewer images={images} setImages={setImages} />
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            marginTop: '2%',
            marginLeft: '4%',
          }}>
          Renting Out{' '}
          <Text style={{color: 'gray', fontSize: 12}}>(required)</Text>
        </Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle}
          data={rentalAreaSelections}
          maxHeight={300}
          labelField="label"
          valueField="value"
          value={rentalArea}
          onChange={item => {
            setRentalArea(item.label);
          }}
        />
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            marginLeft: '4%',
            marginBottom: '2%',
            marginTop: '2%',
          }}>
          Monthly Rent{' '}
          <Text style={{color: 'gray', fontSize: 12}}>(required)</Text>
        </Text>
        <TextInput
          style={[styles.dropdown, {fontSize: 18}]}
          onChangeText={setMonthlyRent}
          value={monthlyRent}
          maxLength={20}
          placeholder="Monthly Rent"
          keyboardType="numeric"
        />
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginLeft: '4%',
              marginTop: '2%',
            }}>
            Status of Rental{' '}
            <Text style={{color: 'gray', fontSize: 12}}>(required)</Text>
          </Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={rentalStatus}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={statusOfRental}
            onChange={item => {
              setStatusOfRental(item.label);
            }}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginLeft: '4%',
              marginBottom: '2%',
              marginTop: '2%',
            }}>
            Square Feet{' '}
            <Text style={{color: 'gray', fontSize: 12}}>(required)</Text>
          </Text>
          <TextInput
            style={[styles.dropdown, {fontSize: 18}]}
            onChangeText={setTotalSquareFeet}
            value={totalSquareFeet}
            maxLength={20}
            placeholder="Total Square Footage"
            keyboardType="numeric"
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginLeft: '4%',
              marginBottom: '2%',
              marginTop: '2%',
            }}>
            Bedrooms{' '}
            <Text style={{color: 'gray', fontSize: 12}}>(required)</Text>
          </Text>
          <TextInput
            style={[styles.dropdown, {fontSize: 18}]}
            onChangeText={setTotalBedrooms}
            value={totalBedrooms}
            maxLength={3}
            placeholder="Total Bedrooms"
            keyboardType="numeric"
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginLeft: '4%',
              marginBottom: '2%',
              marginTop: '2%',
            }}>
            Bathrooms{' '}
            <Text style={{color: 'gray', fontSize: 12}}>(required)</Text>
          </Text>
          <TextInput
            style={[styles.dropdown, {fontSize: 18}]}
            onChangeText={setTotalBathrooms}
            value={totalBathrooms}
            maxLength={3}
            placeholder="Total Bathrooms"
            keyboardType="numeric"
          />
          <View
            style={{
              flexDirection: 'row',
              marginLeft: '4%',
              marginRight: '4%',
              marginTop: '3%',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}>
            <TouchableOpacity
              style={isFurnished ? styles.optionsActive : styles.options}
              onPress={() => setIsFurnished(!isFurnished)}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    paddingTop: '1%',
                    paddingBottom: '1%',
                    paddingLeft: '2%',
                    paddingRight: '1%',
                    color: 'white',
                    fontWeight: 'bold',
                    alignContent: 'center',
                    textAlign: 'center',
                  }}>
                  Furnished
                </Text>
                <Icon
                  name="add-outline"
                  style={{color: 'white', paddingRight: '1%'}}
                  size={20}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={isWasherDryer ? styles.optionsActive : styles.options}
              onPress={() => setIsWasherDryer(!isWasherDryer)}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    paddingTop: '1%',
                    paddingBottom: '1%',
                    paddingLeft: '2%',
                    paddingRight: '1%',
                    color: 'white',
                    fontWeight: 'bold',
                    alignContent: 'center',
                    textAlign: 'center',
                  }}>
                  Washer/Dryer
                </Text>
                <Icon
                  name="add-outline"
                  style={{color: 'white', paddingRight: '1%'}}
                  size={20}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={isFreeParking ? styles.optionsActive : styles.options}
              onPress={() => setIsFreeParking(!isFreeParking)}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    paddingTop: '1%',
                    paddingBottom: '1%',
                    paddingLeft: '2%',
                    paddingRight: '1%',
                    color: 'white',
                    fontWeight: 'bold',
                    alignContent: 'center',
                    textAlign: 'center',
                  }}>
                  Free Parking
                </Text>
                <Icon
                  name="add-outline"
                  style={{color: 'white', paddingRight: '1%'}}
                  size={20}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={isPool ? styles.optionsActive : styles.options}
              onPress={() => setIsPool(!isPool)}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    paddingTop: '1%',
                    paddingBottom: '1%',
                    paddingLeft: '2%',
                    paddingRight: '1%',
                    color: 'white',
                    fontWeight: 'bold',
                    alignContent: 'center',
                    textAlign: 'center',
                  }}>
                  Pool/Spa
                </Text>
                <Icon
                  name="add-outline"
                  style={{color: 'white', paddingRight: '1%'}}
                  size={20}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={isPrivateBathroom ? styles.optionsActive : styles.options}
              onPress={() => setIsPrivateBathroom(!isPrivateBathroom)}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    paddingTop: '1%',
                    paddingBottom: '1%',
                    paddingLeft: '2%',
                    paddingRight: '1%',
                    color: 'white',
                    fontWeight: 'bold',
                    alignContent: 'center',
                    textAlign: 'center',
                  }}>
                  Private Bathroom
                </Text>
                <Icon
                  name="add-outline"
                  style={{color: 'white', paddingRight: '1%'}}
                  size={20}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={isInternet ? styles.optionsActive : styles.options}
              onPress={() => setIsInternet(!isInternet)}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    paddingTop: '1%',
                    paddingBottom: '1%',
                    paddingLeft: '2%',
                    paddingRight: '1%',
                    color: 'white',
                    fontWeight: 'bold',
                    alignContent: 'center',
                    textAlign: 'center',
                  }}>
                  Internet
                </Text>
                <Icon
                  name="add-outline"
                  style={{color: 'white', paddingRight: '1%'}}
                  size={20}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={isDishwasher ? styles.optionsActive : styles.options}
              onPress={() => setIsDishwasher(!isDishwasher)}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    paddingTop: '1%',
                    paddingBottom: '1%',
                    paddingLeft: '2%',
                    paddingRight: '1%',
                    color: 'white',
                    fontWeight: 'bold',
                    alignContent: 'center',
                    textAlign: 'center',
                  }}>
                  Dishwasher
                </Text>
                <Icon
                  name="add-outline"
                  style={{color: 'white', paddingRight: '1%'}}
                  size={20}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={isAirConditioning ? styles.optionsActive : styles.options}
              onPress={() => setIsAirConditioning(!isAirConditioning)}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    paddingTop: '1%',
                    paddingBottom: '1%',
                    paddingLeft: '2%',
                    paddingRight: '1%',
                    color: 'white',
                    fontWeight: 'bold',
                    alignContent: 'center',
                    textAlign: 'center',
                  }}>
                  Air Conditioning
                </Text>
                <Icon
                  name="add-outline"
                  style={{color: 'white', paddingRight: '1%'}}
                  size={20}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={isYard ? styles.optionsActive : styles.options}
              onPress={() => setIsYard(!isYard)}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    paddingTop: '1%',
                    paddingBottom: '1%',
                    paddingLeft: '2%',
                    paddingRight: '1%',
                    color: 'white',
                    fontWeight: 'bold',
                    alignContent: 'center',
                    textAlign: 'center',
                  }}>
                  Yard
                </Text>
                <Icon
                  name="add-outline"
                  style={{color: 'white', paddingRight: '1%'}}
                  size={20}
                />
              </View>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginTop: '5%',
              marginLeft: '4%',
            }}>
            Property Description{' '}
            <Text style={{color: 'gray', fontSize: 12}}>(required)</Text>
          </Text>
          <TextInput
            style={styles.propertyDescription}
            multiline={true}
            onChangeText={setPropertyDescription}
            value={propertyDescription}
            placeholder="What makes your home unique?"
          />
        </View>
        <View style={{marginBottom: '20%'}} />
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
          style={
            !rentalArea ||
            !monthlyRent ||
            !statusOfRental ||
            !totalSquareFeet ||
            !totalBedrooms ||
            !totalBathrooms ||
            !propertyDescription ||
            images.length < 3
              ? styles.disabledSave
              : styles.saveButton
          }
          onPress={handlePostSubmit}
          disabled={
            !rentalArea ||
            !monthlyRent ||
            !statusOfRental ||
            !totalSquareFeet ||
            !totalBedrooms ||
            !totalBathrooms ||
            !propertyDescription ||
            images.length < 3
          }>
          <Text
            style={
              !rentalArea ||
              !monthlyRent ||
              !statusOfRental ||
              !totalSquareFeet ||
              !totalBedrooms ||
              !totalBathrooms ||
              !propertyDescription ||
              images.length < 3
                ? styles.disabledText
                : styles.saveText
            }>
            Save
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  options: {
    backgroundColor: '#1f3839',
    opacity: 0.6,
    borderRadius: 30,
    marginTop: '2%',
  },
  optionsActive: {
    backgroundColor: '#1f3839',
    borderRadius: 30,
    marginTop: '2%',
  },
  propertyDescription: {
    height: 180,
    margin: 15,
    borderWidth: 0.8,
    borderRadius: 10,
    textAlignVertical: 'top',
    padding: '2%',
    fontSize: 16,
    marginTop: '5%',
    marginBottom: '20%',
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: '#347544',
    borderColor: '#347544',
    borderWidth: 1.5,
    width: '92%',
    height: '40%',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  disabledSave: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#347544',
    borderWidth: 1.5,
    width: '92%',
    height: '40%',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  dropdown: {
    marginLeft: '4%',
    marginRight: '4%',
    marginBottom: '4%',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  submitButton: {
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
  saveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#347544',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: '5%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginLeft: '2%',
    textAlign: 'center',
  },
});

export default PostRentalScreen;
