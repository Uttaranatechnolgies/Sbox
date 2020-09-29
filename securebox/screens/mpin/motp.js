import React, {useState} from 'react';
import {View, Text, TextInput, ScrollView} from 'react-native';
import LogoIcon from '../logo';
import EyeIcon from '../eye';
import styles from '../../styles';
import {CustomButton} from '../components/buttions';
import LinearStyle from '../LinearStyle';
import Loader from '../loader';
import axios from 'axios';
import {ApiUrl} from '../../config';
import {GetItem, SetItem} from '../../sessions';

const MOtpScreen = ({navigation, route}) => {
  const mobile = route.params.Number;
  const [error, setError] = useState('');
  const [loading, setloading] = useState(false);
  const [otpNumber, setOtpNumber] = useState('');
  const [eyeStatus, setEye] = useState(true);

  const OnNumberChanged = (eVal) => {
    setError('');
    setOtpNumber(eVal);
  };

  const OnCancelClicked = async (e) => {
    e.preventDefault();
    setError('');
    setOtpNumber('');
    navigation.navigate('MNumber');
  };

  const OnSubmitClicked = async (e) => {
    e.preventDefault();
    setError('');
    if (isNaN(otpNumber) || otpNumber.length !== 6) {
      setError(`Invalid OTP number`);
      return;
    }

    let status = await ValidateOTPNumber();
    if (status) {
      setError('');
      setOtpNumber('');
      navigation.navigate('MNewPIN', {
        Number: mobile,
      });
    }
  };

  const ValidateOTPNumber = async () => {
    let status = false;
    setError('');

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
      otp: otpNumber,
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

    setloading(false);

    if (tokenR && tokenR !== '') {
      await SetItem('accessToken', tokenR);
      status = true;
    }

    return status;
  };

  const OnEyeClicked = (val) => {
    setEye(val);
  };

  return (
    <>
      <LinearStyle>
        <Loader loading={loading} />
        <LogoIcon />
        <Text style={styles.headerTitle}>Generate or reset MPIN</Text>
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
                  placeholder="Enter OTP Number"
                  placeholderTextColor="#b2b4b8"
                  returnKeyType="next"
                  keyboardType="numeric"
                  style={styles.inputText}
                  blurOnSubmit={false}
                  value={otpNumber}
                  secureTextEntry={eyeStatus}
                  onChangeText={(text) => OnNumberChanged(text)}
                />
                <EyeIcon style={{top: 60}} onPress={OnEyeClicked} />
                {error != '' ? (
                  <Text style={styles.errortext}>{error} </Text>
                ) : null}
                <View style={styles.buttoncontainer}>
                  <CustomButton
                    title="Cancel"
                    onPress={(event) => OnCancelClicked(event)}
                  />
                  <CustomButton
                    title="Validate"
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

export default MOtpScreen;
