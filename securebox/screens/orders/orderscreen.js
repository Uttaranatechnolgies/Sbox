import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, ScrollView} from 'react-native';
import LinearStyle from '../LinearStyle';
import LogoIcon from '../logo';
import ExitIcon from '../exitimg';
import styles from '../../styles';
import {CustomButton} from '../components/buttions';

import Loader from '../loader';
import axios from 'axios';
import {ApiUrl} from '../../config';
import {GetItem} from '../../sessions';

const OrderScreen = ({navigation}) => {
  const [OrderNum, setOrderNum] = useState('');
  const [ConsigneeNum, setConsigneeNum] = useState('');
  const [filters, setFilters] = useState(false);
  const [error, setError] = useState('');
  const [loading, setloading] = useState(false);
  const [Orders, setOrder] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setOrderNum('');
      setConsigneeNum('');
      setOrder([]);
      setFilters(false);
      setloading(false);
      setError('');
    });
    return unsubscribe;
  }, [navigation]);

  const OnTextChanged = (value) => {
    setError('');
    setOrderNum(value);
  };

  const OnFilterTextChanged = (value) => {
    setError('');
    setConsigneeNum(value);
  };

  const OnOrderFilterClicked = async (e) => {
    e.preventDefault();
    setError('');

    if (filters && ConsigneeNum === '') {
      setError(`Enter Consignee Number`);
      return;
    }

    let result = Orders.filter(function (item) {
      return item['consigneenum'] === ConsigneeNum;
    }).map(function (nitem) {
      return nitem;
    });

    if (result.length === 0) {
      setError(`Consignee does not exist`);
      return;
    }
    if (result[0].orderstatusid === 2) {
      setError(`Order was cancelled`);
      return;
    } else if (result[0].orderstatusid === 3) {
      setError(`Order was delivered`);
      return;
    }

    navigation.navigate('OrderDetails', {
      orderid: result[0].orderid,
    });
  };

  const OnOrderClicked = async (e) => {
    e.preventDefault();
    setError('');
    setOrder([]);

    if (OrderNum === '') {
      setError(`Enter Order Number`);
      return;
    }

    setloading(true);

    const url = `${ApiUrl}ordernum/${OrderNum}`;
    const token = await GetItem('userToken');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`,
    };

    let orderList = [];

    await axios({
      method: 'get',
      url: url,
      timeout: 30000,
      headers: headers,
    })
      .then((res) => {
        const data = res.data;
        if (parseInt(data.status) === 100) {
          if (data['data']) {
            orderList = data.data;
            if (data.data.length > 1) {
              setFilters(true);
            }
          }
        }
      })
      .catch((err) => {
        console.log('Unable to connect the server');
      });

    setloading(false);
    setOrder(orderList);

    if (orderList.length === 0) {
      navigation.navigate('NewOrder');
    } else if (orderList.length === 1) {
      if (orderList[0].orderstatusid === 5) {
        setError(`Order was cancelled`);
      } else if (orderList[0].orderstatusid === 4) {
        setError(`Order was delivered`);
      } else {
        navigation.navigate('OrderDetails', {
          orderid: orderList[0].orderid,
        });
      }
    }
  };

  const OnCancelClicked = () => {
    setFilters(false);
    setOrder([]);
    setError('');
    setOrderNum('');
    setConsigneeNum('');
    navigation.navigate('Order');
  };

  const OnScanClicked = () => {
    setFilters(false);
    setOrder([]);
    setError('');
    setOrderNum('');
    setConsigneeNum('');
    navigation.navigate('Scan', {
      type: 'scan',
      orderid: 0,
    });
  };

  return (
    <>
      <LinearStyle>
        <Loader loading={loading} />
        <LogoIcon />
        <Text style={styles.headerTitle}>Order</Text>
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
                  returnKeyType={filters ? 'next' : 'done'}
                  style={styles.inputText}
                  value={OrderNum}
                  blurOnSubmit={false}
                  onSubmitEditing={(event) =>
                    filters
                      ? OnOrderFilterClicked(event)
                      : OnOrderClicked(event)
                  }
                  onChangeText={(text) => OnTextChanged(text)}
                />
                {filters ? (
                  <TextInput
                    underlineColorAndroid="lightgrey"
                    placeholder="Enter Receiver Number"
                    placeholderTextColor="#b2b4b8"
                    returnKeyType="done"
                    style={styles.inputText}
                    keyboardType="numeric"
                    value={ConsigneeNum}
                    blurOnSubmit={false}
                    onSubmitEditing={(event) => OnOrderFilterClicked(event)}
                    onChangeText={(text) => OnFilterTextChanged(text)}
                  />
                ) : null}

                {error != '' ? (
                  <Text style={styles.errortext}>{error} </Text>
                ) : null}
                <View style={styles.buttoncontainer}>
                  {!filters ? (
                    <CustomButton
                      title="Scan"
                      type="fill"
                      onPress={OnScanClicked}
                    />
                  ) : (
                    <CustomButton title="Cancel" onPress={OnCancelClicked} />
                  )}
                  <CustomButton
                    title="Submit"
                    type="fill"
                    onPress={(event) =>
                      filters
                        ? OnOrderFilterClicked(event)
                        : OnOrderClicked(event)
                    }
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

export default OrderScreen;
