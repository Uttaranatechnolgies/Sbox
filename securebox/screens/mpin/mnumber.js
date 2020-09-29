import React, {useState} from 'react';
import {View, Text, TextInput, ScrollView} from 'react-native';
import LinearStyle from '../LinearStyle';
import LogoIcon from '../logo';
import styles from '../../styles';
import {CustomButton} from '../components/buttions';

import Loader from '../loader';
import axios from 'axios';
import {ApiUrl} from '../../config';
import {SetItem} from '../../sessions';

const MNumberScreen = ({navigation}) => {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [loading, setloading] = useState(false);

  const OnTextChanged = (val) => {
    setError('');
    setMobile(val);
  };

  const OnCancelClicked = async (e) => {
    e.preventDefault();
    setError('');
    setMobile('');
    navigation.navigate('MPin');
  };

  const OnSubmitClicked = async (e) => {
    e.preventDefault();
    setError('');

    if (mobile === '' || isNaN(mobile) || mobile.length !== 10) {
      setError('Invalid Mobile Number');
      return;
    }

    let status = await OnSendOTP();
    if (status) {
      navigation.navigate('MOTP', {
        Number: mobile,
      });
    }
  };

  const OnSendOTP = async () => {
    let status = false;
    let tokenR = '';

    setloading(true);

    const url = `${ApiUrl}agentnpin`;
    let data = {
      mobile: mobile,
    };

    await axios
      .post(url, data)
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
                <TextInput
                  underlineColorAndroid="lightgrey"
                  placeholder="Enter Mobile Number"
                  placeholderTextColor="#b2b4b8"
                  returnKeyType="next"
                  keyboardType="numeric"
                  style={styles.inputText}
                  value={mobile}
                  onChangeText={(text) => OnTextChanged(text)}
                  blurOnSubmit={false}
                />
                {error != '' ? (
                  <Text style={styles.errortext}>{error} </Text>
                ) : null}
                <View style={styles.buttoncontainer}>
                  <CustomButton
                    title="Cancel"
                    onPress={(event) => OnCancelClicked(event)}
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

export default MNumberScreen;
