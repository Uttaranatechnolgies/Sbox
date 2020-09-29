import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TextInput, ScrollView} from 'react-native';
import LinearStyle from '../LinearStyle';
import LogoIcon from '../logo';
import styles from '../../styles';
import {CustomButton} from '../components/buttions';
import axios from 'axios';
import {ApiUrl} from '../../config';
import Loader from '../loader';
import {GetItem} from '../../sessions';

const NewOrderScreen = ({navigation}) => {
  let consigneeRef = useRef(null);
  let consigneenumRef = useRef(null);
  let consignorRef = useRef(null);
  let consignornumRef = useRef(null);
  const [error, setError] = useState('');
  const [loading, setloading] = useState(false);
  const [Order, setOrder] = useState({
    ordernum: '',
    consignee: '',
    consigneenum: '',
    consignor: '',
    consignornum: '',
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setOrder({
        ordernum: '',
        consignee: '',
        consigneenum: '',
        consignor: '',
        consignornum: '',
      });
      setloading(false);
      setError('');
    });
    return unsubscribe;
  }, [navigation]);

  const OnTextChanged = (name, value) => {
    setError('');
    setOrder({
      ...Order,
      [name]: value,
    });
  };

  const OnSubmitClicked = async (e) => {
    e.preventDefault();
    setError('');
    if (Order.ordernum === '') {
      setError(`Enter Order Number`);
      return;
    } else if (Order.consignee === '') {
      setError(`Enter Receiver Name`);
      return;
    } else if (Order.consigneenum === '') {
      setError(`Enter Receiver Number`);
      return;
    } else if (Order.consignor === '') {
      setError(`Enter Sender Name`);
      return;
    } else if (Order.consignornum === '') {
      setError(`Enter Sender Number`);
      return;
    }

    setloading(true);
    const url = `${ApiUrl}order`;
    let orderId = 0;
    const token = await GetItem('userToken');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`,
    };

    await axios
      .post(url, Order, {
        headers: headers,
      })
      .then((res) => {
        const data = res.data;
        if (parseInt(data.status) !== 100) {
          setError(data.statusText);
        } else {
          orderId = data.data.orderid;
        }
      })
      .catch((err) => {
        setError('Unable to connect the server');
      });

    setloading(false);
    if (orderId > 0) {
      navigation.navigate('OrderDetails', {
        orderid: orderId,
      });
    }
  };

  return (
    <>
      <LinearStyle>
        <Loader loading={loading} />
        <LogoIcon />
        <Text style={styles.headerTitle}>New Order</Text>
        <ScrollView
          style={{
            flex: 1,
          }}>
          <View style={styles.workspace}>
            <View style={styles.mainspace}>
              <View style={styles.formspace}>
                <TextInput
                  underlineColorAndroid="lightgrey"
                  placeholder="Enter Order Number"
                  placeholderTextColor="#b2b4b8"
                  returnKeyType="next"
                  maxLength={50}
                  keyboardType="default"
                  style={styles.inputText}
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    consigneeRef.focus();
                  }}
                  onChangeText={(text) => OnTextChanged('ordernum', text)}
                />
                <TextInput
                  underlineColorAndroid="lightgrey"
                  placeholder="Receiver Name"
                  placeholderTextColor="#b2b4b8"
                  returnKeyType="next"
                  maxLength={50}
                  keyboardType="default"
                  style={styles.inputText}
                  blurOnSubmit={false}
                  ref={(input) => {
                    consigneeRef = input;
                  }}
                  onSubmitEditing={() => {
                    consigneenumRef.focus();
                  }}
                  onChangeText={(text) => OnTextChanged('consignee', text)}
                />
                <TextInput
                  underlineColorAndroid="lightgrey"
                  placeholder="Receiver Number"
                  placeholderTextColor="#b2b4b8"
                  maxLength={10}
                  returnKeyType="next"
                  keyboardType="numeric"
                  style={styles.inputText}
                  blurOnSubmit={false}
                  ref={(input) => {
                    consigneenumRef = input;
                  }}
                  onSubmitEditing={() => {
                    consignorRef.focus();
                  }}
                  onChangeText={(text) => OnTextChanged('consigneenum', text)}
                />
                <TextInput
                  underlineColorAndroid="lightgrey"
                  placeholder="Sender Name"
                  keyboardType="default"
                  maxLength={50}
                  placeholderTextColor="#b2b4b8"
                  returnKeyType="next"
                  style={styles.inputText}
                  blurOnSubmit={false}
                  ref={(input) => {
                    consignorRef = input;
                  }}
                  onSubmitEditing={() => {
                    consignornumRef.focus();
                  }}
                  onChangeText={(text) => OnTextChanged('consignor', text)}
                />
                <TextInput
                  underlineColorAndroid="lightgrey"
                  placeholder="Sender Number"
                  placeholderTextColor="#b2b4b8"
                  maxLength={10}
                  returnKeyType="done"
                  keyboardType="numeric"
                  style={styles.inputText}
                  ref={(input) => {
                    consignornumRef = input;
                  }}
                  onSubmitEditing={(event) => OnSubmitClicked(event)}
                  blurOnSubmit={false}
                  onChangeText={(text) => OnTextChanged('consignornum', text)}
                />
                {error != '' ? (
                  <Text style={styles.errortext}>{error} </Text>
                ) : null}
                <View style={styles.buttoncontainer}>
                  <CustomButton
                    title="Cancel"
                    onPress={() => navigation.navigate('Order')}
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

export default NewOrderScreen;
