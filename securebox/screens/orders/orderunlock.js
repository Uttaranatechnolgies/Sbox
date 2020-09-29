import React, {useState} from 'react';
import {View, Text, ScrollView} from 'react-native';
import LinearStyle from '../LinearStyle';
import LogoIcon from '../logo';
import styles from '../../styles';
import {CustomButton} from '../components/buttions';

import Loader from '../loader';
import axios from 'axios';
import {ApiUrl} from '../../config';
import {GetItem} from '../../sessions';

const UnlockScreen = ({navigation, route}) => {
  const [loading, setloading] = useState(false);
  const OnUnlockClicked = async (e, type) => {
    e.preventDefault();
    const OrderId = route.params.orderid;
    const OrderNum = route.params.ordernum;
    setloading(true);
    let data = {};
    let navigateTo = 'UnlockOTP';
    if (type === 'consignee') {
      data = {
        type: 'consignee',
        orderid: OrderId,
        ordernum: OrderNum,
      };
    } else if (type === 'consignor') {
      data = {
        type: 'consignor',
        orderid: OrderId,
        ordernum: OrderNum,
      };
    } else if (type === 'cancel') {
      data = {
        orderid: OrderId,
      };
      navigateTo = 'OrderDetails';
    }
    if (type === 'cancel') {
      setloading(false);
      navigation.navigate(navigateTo, data);
    } else {
      let status = await OnRequestOtp(data);
      setloading(false);
      if (status) {
        navigation.navigate(navigateTo, data);
      }
    }
  };

  const OnRequestOtp = async (req) => {
    const url = `${ApiUrl}sendotp`;

    const token = await GetItem('userToken');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`,
    };

    let status = false;
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

  return (
    <>
      <LinearStyle>
        <Loader loading={loading} />
        <LogoIcon />
        <Text style={styles.headerTitle}>Unlock Box</Text>
        <ScrollView
          style={{
            flex: 1,
          }}>
          <View style={styles.workspace}>
            <View style={styles.mainspace}>
              <View style={styles.formspace}>
                <View
                  style={[
                    styles.labelcontainer,
                    styles.bottom10,
                    styles.left10,
                  ]}>
                  <Text style={styles.labeltext}>Order Number:</Text>
                  <Text style={styles.labelvalue}>{route.params.ordernum}</Text>
                </View>
                <View style={styles.buttoncontainer}>
                  <CustomButton
                    title="Sender"
                    type="fill"
                    onPress={(event) => OnUnlockClicked(event, 'consignor')}
                  />
                  <CustomButton
                    title="Receiver"
                    type="fill"
                    onPress={(event) => OnUnlockClicked(event, 'consignee')}
                  />
                </View>

                <View style={styles.buttoncontainer}>
                  <CustomButton
                    title="Cancel"
                    onPress={(event) => OnUnlockClicked(event, 'cancel')}
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

export default UnlockScreen;
