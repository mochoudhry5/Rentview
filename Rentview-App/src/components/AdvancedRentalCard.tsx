import {View, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {DocumentData} from 'firebase/firestore';
import {Card} from '@rneui/base';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Modal} from './Modal';

type Props = {
  rental: DocumentData;
  handleView: (homeId: string) => void;
  handleUnclaimProperty: (homeId: string) => void;
};

const AdvancedRentalCard: React.FC<Props> = ({
  rental,
  handleView,
  handleUnclaimProperty,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const closeModal = () => {
    setShowModal(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const handleUnclaim = () => {
    handleUnclaimProperty(rental.homeId);
    setShowModal(false);
  };

  return (
    <View>
      <Card>
        {rental.homePictures !== null ? (
          <Card.Image
            style={{borderRadius: 5, marginBottom: 10}}
            source={{uri: rental.homePictures.uri}}
          />
        ) : (
          <Card.Image
            style={{borderRadius: 5, marginBottom: 10}}
            source={require('../images/No_Images_Found.png')}
          />
        )}
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
          }}>
          {rental.fullAddress}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <TouchableOpacity
            style={styles.viewProperty}
            onPress={() => {
              handleView(rental.homeId);
            }}>
            <Text style={{fontWeight: 'bold', color: '#347544'}}>
              Manage Property
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.unclaim} onPress={openModal}>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'white',
                paddingLeft: 10,
                paddingRight: 10,
              }}>
              Unclaim
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
      <View>
        <Modal
          isVisible={showModal}
          animationIn={'zoomInDown'}
          onBackdropPress={closeModal}>
          <Modal.Container>
            <Modal.Header title="Unclaim Property?" />
            <Modal.Body>
              <Text
                style={{
                  marginLeft: '5%',
                  marginTop: '5%',
                  color: 'black',
                  fontSize: 20,
                  textAlign: 'center',
                }}>
                All property information will be deleted and this action can not
                be reverted!
              </Text>
            </Modal.Body>
            <Modal.Footer>
              <TouchableOpacity
                style={styles.submitButton2}
                onPress={closeModal}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: 'white',
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleUnclaim}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: 'white',
                  }}>
                  Yes
                </Text>
              </TouchableOpacity>
            </Modal.Footer>
          </Modal.Container>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rating: {
    fontSize: 20,
    fontWeight: '600',
  },
  viewProperty: {
    borderColor: '#347544',
    borderWidth: 1,
    borderRadius: 20,
    padding: 5,
  },
  unclaim: {
    backgroundColor: '#848484',
    borderColor: '#848484',
    borderWidth: 1,
    borderRadius: 20,
    padding: 5,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#e33d3d',
    borderWidth: 1,
    width: '100%',
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    margin: 30,
    marginLeft: 50,
  },
  submitButton2: {
    alignItems: 'center',
    backgroundColor: '#a39e9e',
    borderWidth: 1,
    width: '100%',
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    margin: 30,
  },
});

export default AdvancedRentalCard;
