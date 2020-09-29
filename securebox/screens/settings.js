import React, {useState, useEffect} from 'react';
import {TextInput, View, Text} from 'react-native';
import LinearStyle from './LinearStyle';
import styles from '../styles';
import {CustomButton} from './components/buttions';
import {GetItem, SetItem} from '../sessions';

const SettingScreen = ({navigation}) => {
  const [error, setError] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      let lastNumber = await GetItem('MobileNumber');
      if (lastNumber === null || lastNumber === undefined) {
        lastNumber = '';
      }
      setMobileNumber(lastNumber);
      setError('');
    });
    return unsubscribe;
  }, [navigation]);

  const OnCancelClicked = (e) => {
    e.preventDefault();
    setMobileNumber('');
    setError('');
    navigation.navigate('MPin');
  };

  const OnNumberChanged = (e) => {
    setError('');
    setMobileNumber(e);
  };

  const OnSubmitClicked = async (e) => {
    e.preventDefault();
    setError('');

    if (isNaN(mobileNumber) || mobileNumber.length !== 10) {
      setError('Mobile Number should be 10 digits');
      return;
    }

    let lastNumber = await SetItem('MobileNumber', mobileNumber);
    setMobileNumber('');
    setError('');
    navigation.navigate('MPin');
  };

  return (
    <>
      <LinearStyle>
        <View style={styles.settingsHeader}>
          <Text style={styles.settingsHeaderText}>Settings</Text>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionText}>Mobile Number</Text>
        </View>

        <View style={styles.settingsSectionInput}>
          <TextInput
            underlineColorAndroid="lightgrey"
            placeholder="Enter Mobile Number"
            placeholderTextColor="#b2b4b8"
            returnKeyType="next"
            style={styles.inputText}
            blurOnSubmit={false}
            value={mobileNumber}
            keyboardType="numeric"
            maxLength={10}
            onChangeText={(text) => OnNumberChanged(text)}
          />
        </View>
        {error != '' ? <Text style={styles.errortext}>{error} </Text> : null}
        <View style={styles.buttoncontainer}>
          <CustomButton
            title="Cancel"
            onPress={(event) => OnCancelClicked(event)}
          />
          <CustomButton
            title="Save"
            type="fill"
            onPress={(event) => OnSubmitClicked(event)}
          />
        </View>
      </LinearStyle>
    </>
  );
};

export default SettingScreen;
