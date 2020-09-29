import React, {useState} from 'react';
import {View, Text, TextInput, ScrollView} from 'react-native';
import LinearStyle from '../LinearStyle';
import LogoIcon from '../logo';
import styles from '../../styles';
import {CustomButton} from '../components/buttions';
import EyeIcon from '../eye';
import Loader from '../loader';
import axios from 'axios';
import {ApiUrl} from '../../config';
import {GetItem} from '../../sessions';

const UnlockOTPScreen = ({navigation, route}) => {
  const [loading, setloading] = useState(false);
  const [error, setError] = useState('');
  const [OTPNumber, setOTPNumber] = useState('');
  const [eyeStatus, setEye] = useState(true);

  const OrderId = route.params.orderid;
  const OrderNum = route.params.ordernum;
  const type = route.params.type;

  const OnCancelClicked = async (e) => {
    e.preventDefault();
    navigation.navigate('Unlock', {
      orderid: OrderId,
      ordernum: OrderNum,
    });
  };

  const OnTextChanged = (val) => {
    setError('');
    setOTPNumber(val);
  };

  const OnSubmitClicked = async (e) => {
    e.preventDefault();
    if (OTPNumber === '' || parseInt(OTPNumber) <= 0) {
      setloading(false);
      setError('Invalid OTP Number');
      return;
    }

    setloading(true);
    let data = {
      type: type,
      orderid: OrderId,
      otpcode: OTPNumber,
    };

    let status = await OnOtpConfirm(data);
    setloading(false);
    if (status) {
      navigation.navigate('Unlock', {
        orderid: OrderId,
        ordernum: OrderNum,
      });
    }
  };

  const OnOtpConfirm = async (req) => {
    const url = `${ApiUrl}unlock`;
    let status = false;
    const token = await GetItem('userToken');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`,
    };

    await axios
      .post(url, req, {
        headers: headers,
      })
      .then((res) => {
        const data = res.data;
        if (parseInt(data.status) !== 100) {
          setError(data.statusText);
        } else {
          status = true;
        }
      })
      .catch((err) => {
        setError('Unable to connect the server');
      });

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
        <Text style={styles.headerTitle}>OTP Unlock</Text>
        <ScrollView
          style={{
            flex: 1,
          }}>
          <View style={styles.workspace}>
            <View style={styles.mainspace}>
              <View style={styles.formspace}>
                <View style={[styles.labelcontainer, styles.bottom10]}>
                  <Text style={styles.labeltext}>Order Number:</Text>
                  <Text style={styles.labelvalue}>{OrderNum}</Text>
                </View>
                <TextInput
                  underlineColorAndroid="lightgrey"
                  placeholder="Enter OTP Number"
                  placeholderTextColor="#b2b4b8"
                  returnKeyType="next"
                  keyboardType="numeric"
                  value={OTPNumber}
                  onChangeText={(text) => OnTextChanged(text)}
                  style={styles.inputText}
                  secureTextEntry={eyeStatus}
                  blurOnSubmit={false}
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

export default UnlockOTPScreen;
