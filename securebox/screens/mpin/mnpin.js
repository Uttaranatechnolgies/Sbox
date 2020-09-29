import React, {useState} from 'react';
import {View, Text, TextInput, ScrollView} from 'react-native';
import LogoIcon from '../logo';
import EyeIcon from '../eye';
import styles from '../../styles';
import {CustomButton} from '../components/buttions';
import {AuthContext} from '../../auth';
import LinearStyle from '../LinearStyle';
import Loader from '../loader';
import axios from 'axios';
import {ApiUrl} from '../../config';
import {GetItem} from '../../sessions';

const MNPinScreen = ({navigation, route}) => {
  const {signIn} = React.useContext(AuthContext);
  const mobile = route.params.Number;
  const [error, setError] = useState('');
  const [loading, setloading] = useState(false);
  const [eyeStatus, setEye] = useState(true);
  const [pins, setPins] = useState({
    pin: '',
    cpin: '',
  });

  const OnNumberChanged = (name, val) => {
    setError('');
    setPins({
      ...pins,
      [name]: val,
    });
  };

  const OnSubmitClicked = async (e) => {
    e.preventDefault();
    let status = false;
    setError('');
    if (isNaN(pins.pin)) {
      setError(`${pins.pin} is not a number`);
    } else if (isNaN(pins.cpin)) {
      setError(`${pins.cpin} is not a number`);
    } else if (pins.pin.length != 6) {
      setError(`MPIN length should be 6`);
    } else if (pins.cpin.length != 6) {
      setError(`Enter Confirm MPIN`);
    } else if (pins.pin != pins.cpin) {
      setError(`MPIN does not match`);
    } else {
      setloading(true);
      const url = `${ApiUrl}agentnpin`;
      let tokenR = '';
      const token = await GetItem('accessToken');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`,
      };

      let data = {
        mobile: mobile,
        mpin: pins.pin,
        create: '1',
      };

      await axios
        .post(url, data, {
          headers: headers,
        })
        .then((res) => {
          const data = res.data;
          if (parseInt(data.status) !== 100) {
            setError(data.statusText);
          } else {
            tokenR = data.data.token;
          }
        })
        .catch((err) => {
          setError('Unable to connect the server');
        });

      if (tokenR && tokenR !== '') {
        status = true;
      }
      setloading(false);
      if (status) {
        setError('');
        setPins({
          pin: '',
          cpin: '',
        });
        signIn({user: 'NoName', token: tokenR});
      }
    }
  };

  const OnEyeClicked = (val) => {
    setEye(val);
  };

  return (
    <>
      <LinearStyle>
        <Loader loading={loading} />
        <LogoIcon />
        <Text style={styles.headerTitle}>New MPIN</Text>
        <ScrollView
          style={{
            flex: 1,
          }}>
          <View style={styles.workspace}>
            <View style={styles.mainspace}>
              <View style={styles.formspace}>
                <View style={[styles.labelcontainer, styles.bottom10]}>
                  <Text style={styles.labeltext}>Mobile Number:</Text>
                  <Text style={styles.labelvalue}>{mobile}</Text>
                </View>
                <TextInput
                  underlineColorAndroid="lightgrey"
                  placeholder="Enter 6 digit MPIN"
                  placeholderTextColor="#b2b4b8"
                  returnKeyType="next"
                  style={styles.inputText}
                  blurOnSubmit={false}
                  keyboardType="numeric"
                  value={pins.pin}
                  secureTextEntry={eyeStatus}
                  onChangeText={(text) => OnNumberChanged('pin', text)}
                />
                <EyeIcon style={{top: 60}} onPress={OnEyeClicked} />
                <TextInput
                  underlineColorAndroid="lightgrey"
                  placeholder="Confirm 6 digit MPIN"
                  placeholderTextColor="#b2b4b8"
                  returnKeyType="next"
                  style={styles.inputText}
                  blurOnSubmit={false}
                  keyboardType="numeric"
                  value={pins.cpin}
                  onChangeText={(text) => OnNumberChanged('cpin', text)}
                />
                {error != '' ? (
                  <Text style={styles.errortext}>{error} </Text>
                ) : null}
                <View style={styles.buttoncontainer}>
                  <CustomButton
                    title="Cancel"
                    onPress={() => navigation.navigate('MPin')}
                  />
                  <CustomButton
                    title="Submit"
                    type="fill"
                    onPress={(event) => OnSubmitClicked(event)}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearStyle>
    </>
  );
};

export default MNPinScreen;
