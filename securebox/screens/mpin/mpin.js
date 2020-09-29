import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TextInput, ScrollView, StyleSheet} from 'react-native';
import LinearStyle from '../LinearStyle';
import Loader from '../loader';
import LogoIcon from '../logo';
import EyeIcon from '../eye';
import styles from '../../styles';
import {CustomButton} from '../components/buttions';
import axios from 'axios';
import {ApiUrl} from '../../config';
import {AuthContext} from '../../auth';
import {GetItem} from '../../sessions';

const MPinScreen = ({navigation}) => {
  const {signIn} = React.useContext(AuthContext);
  const [Login, setLogin] = useState({
    Number: '',
    MPin: '',
  });
  const [error, setError] = useState('');
  const [loading, setloading] = useState(false);
  const [eyeStatus, setEye] = useState(true);
  let pinRef = useRef(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      let lastNumber = await GetItem('MobileNumber');
      if (lastNumber === null || lastNumber === undefined) {
        lastNumber = '';
      }
      setLogin({
        Number: lastNumber,
        MPin: '',
      });
      setloading(false);
      setError('');
    });
    return unsubscribe;
  }, [navigation]);

  const OnTextChanged = (name, value) => {
    setError('');
    setLogin({
      ...Login,
      [name]: value,
    });

    if (value.length === 6) {
      setTimeout(function () {
        console.log(Login.MPin);
        OnLoginClicked();
      }, 1000);
    }
  };

  const handleChange = async (event) => {
    let value = event.nativeEvent.text;
    let name = 'MPin';
    setLogin({
      ...Login,
      [name]: value,
    });
    if (value.length === 6) OnLoginClicked(value);
  };

  const OnLoginClicked = async (mpin) => {
    setError('');
    if (
      Login.Number === '' ||
      Login.Number.length !== 10 ||
      isNaN(Login.Number)
    ) {
      setError(`Configure Mobile Number`);
      return;
    } else if (mpin === '' || mpin.length !== 6 || isNaN(mpin)) {
      setError(`Enter 6 digit MPIN`);
      return;
    }

    setloading(true);
    const url = `${ApiUrl}agentpin`;
    let access_token = '';
    await axios({
      method: 'post',
      url: url,
      data: {
        mobile: Login.Number,
        mpin: mpin,
      },
      timeout: 30000,
    })
      .then((res) => {
        const data = res.data;
        if (parseInt(data.status) !== 100) {
          setError(data.statusText);
        } else {
          access_token = data.data.token;
        }
      })
      .catch((err) => {
        setError('Unable to connect the server');
      });

    setloading(false);

    if (access_token && access_token !== '') {
      setError('');
      setLogin({
        Number: '',
        MPin: '',
      });
      signIn({user: 'NoName', token: access_token});
    }
  };

  const OnEyeClicked = (val) => {
    setEye(val);
  };

  return (
    <>
      <LinearStyle>
        <Loader loading={loading} />
        <LogoIcon noexit={true} />
        <Text style={styles.headerTitle}>Login</Text>
        <ScrollView
          style={{
            flex: 1,
          }}>
          <View style={styles.workspace}>
            <View style={styles.mainspace}>
              <View style={styles.formspace}>
                {/* <TextInput
                  underlineColorAndroid="lightgrey"
                  placeholder="Enter Mobile Number"
                  placeholderTextColor="#b2b4b8"
                  returnKeyType="next"
                  style={styles.inputText}
                  blurOnSubmit={false}
                  value={Login.Number}
                  keyboardType="numeric"
                  onSubmitEditing={() => {
                    pinRef.focus();
                  }}
                  onChangeText={(text) => OnTextChanged('Number', text)}
                /> */}
                <View style={styles2.searchSection}>
                  <EyeIcon onPress={OnEyeClicked} style={{top: 10}} />
                  <TextInput
                    underlineColorAndroid="lightgrey"
                    placeholder="Enter 6 digit MPIN"
                    placeholderTextColor="#b2b4b8"
                    returnKeyType="done"
                    style={styles.inputText}
                    blurOnSubmit={false}
                    value={Login.MPin}
                    keyboardType="numeric"
                    ref={(input) => {
                      pinRef = input;
                    }}
                    secureTextEntry={eyeStatus}
                    onChange={handleChange}
                    /* onChangeText={(text) => OnTextChanged('MPin', text)}
                    onSubmitEditing={OnLoginClicked} */
                  />
                </View>
                <Text
                  style={styles.linkStyle}
                  onPress={() => navigation.navigate('MNumber')}>
                  Generate or reset MPIN?
                </Text>
                {error != '' ? (
                  <Text style={styles.errortext}>{error} </Text>
                ) : null}
                {/*  <View style={styles.buttoncontainerright}>
                  <CustomButton
                    title="Login"
                    type="fill"
                    onPress={OnLoginClicked}
                  />
                </View> */}
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearStyle>
    </>
  );
};

const styles2 = StyleSheet.create({
  searchSection: {
    flexDirection: 'row',
  },
});

export default MPinScreen;
