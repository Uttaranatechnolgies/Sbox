import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView} from 'react-native';
import LogoIcon from '../logo';
import styles from '../../styles';
import {CustomButton} from '../components/buttions';
import LinearStyle from '../LinearStyle';

import Loader from '../loader';
import axios from 'axios';
import {ApiUrl} from '../../config';
import {GetItem} from '../../sessions';

const OrderDetailsScreen = ({navigation, route}) => {
  const [error, setError] = useState('');
  const [onload, setOnLoad] = useState(true);
  const [loading, setloading] = useState(false);
  const [orderid, setOrderId] = useState(0);
  const [cancelled, setCancelled] = useState(false);

  const [Order, setOrder] = useState({
    agentid: 0,
    comments: '',
    orderid: 0,
    ordernum: '',
    consignee: '',
    consigneenum: '',
    consignor: '',
    consignornum: '',
    noofboxes: 0,
    orderstatusid: 0,
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setOrderId(route.params.orderid);
      setCancelled(false);
      setError('');
      setOrder({
        agentid: 0,
        comments: '',
        orderid: route.params.orderid,
        ordernum: '',
        consignee: '',
        consigneenum: '',
        consignor: '',
        consignornum: '',
        noofboxes: 0,
        orderstatusid: 0,
      });
      setOnLoad(true);
    });

    return unsubscribe;
  }, [navigation, orderid, Order]);

  const GetOrderDetails = async (id) => {
    setloading(true);
    const url = `${ApiUrl}order/${id}`;
    const token = await GetItem('userToken');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`,
    };

    let results = null;
    let statusText = '';

    await axios
      .get(url, {
        headers: headers,
      })
      .then(
        (res) => {
          const data = res.data;
          if (parseInt(data.status) !== 100) {
            statusText = data.statusText;
          } else {
            results = data.data[0];
          }
        },
        (error) => {
          console.log(error);
          statusText = 'Unable to connect the server';
        },
      );

    setloading(false);
    setOrder(results);
  };

  if (route.params.orderid > 0 && onload) {
    setOnLoad(false);
    GetOrderDetails(route.params.orderid);
  }

  const OnAddBoxClicked = (e) => {
    e.preventDefault();
    setOnLoad(false);
    setOrderId(0);
    navigation.navigate('Scan', {
      orderid: route.params.orderid,
      type: 'box',
    });
  };

  const OnUnlockClicked = (e) => {
    e.preventDefault();
    setOnLoad(false);
    setOrderId(0);
    navigation.navigate('Unlock', {
      orderid: route.params.orderid,
      ordernum: Order.ordernum,
    });
  };

  const OnSearchClicked = (e) => {
    e.preventDefault();
    setOnLoad(false);
    setOrderId(0);
    setOrder({
      agentid: 0,
      comments: '',
      orderid: 0,
      ordernum: '',
      consignee: '',
      consigneenum: '',
      consignor: '',
      consignornum: '',
      noofboxes: 0,
      orderstatusid: 0,
    });
    navigation.navigate('Order');
  };

  const OnCancelClicked = async (e) => {
    e.preventDefault();
    setloading(true);
    setCancelled(false);
    const OrderId = route.params.orderid;
    let status = false;
    const url = `${ApiUrl}cancelorder/${OrderId}`;

    const token = await GetItem('userToken');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`,
    };

    await axios
      .get(url, {
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

    if (status) {
      setCancelled(true);
      setError(`Cancelled the ${OrderId} order successful`);
    }
    setloading(false);
  };

  const OnStatusClicked = async (e, statusid) => {
    e.preventDefault();
    setloading(true);
    setCancelled(false);
    const OrderId = route.params.orderid;
    let status = false;
    const url = `${ApiUrl}orderstatus`;

    const body = {
      id: OrderId,
      statusid: statusid,
    };
    const token = await GetItem('userToken');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`,
    };

    await axios
      .post(url, body, {
        headers: headers,
      })
      .then((res) => {
        const data = res.data;
        console.log(data);
        if (parseInt(data.status) !== 100) {
          setError(data.statusText);
        } else {
          status = true;
        }
      })
      .catch((err) => {
        setError('Unable to connect the server');
      });

    if (status) {
      if (statusid === 4 || statusid === 5) setCancelled(true);
      setError(`Order Updated successful`);
    }
    setloading(false);
  };

  const GetButtonItems = () => {
    return (
      <>
        <View style={styles.buttoncontainer}>
          <CustomButton
            title="Search"
            onPress={(event) => OnSearchClicked(event)}
          />
          <CustomButton
            title="AddBox"
            type="fill"
            onPress={(event) => OnAddBoxClicked(event)}
          />
        </View>

        <View style={styles.buttoncontainer}>
          <CustomButton
            title="Cancel"
            onPress={(event) => OnStatusClicked(event, 5)}
          />
          {Order.noofboxes > 0 ? (
            <CustomButton
              title="Un-Lock"
              type="fill"
              onPress={(event) => OnUnlockClicked(event)}
            />
          ) : null}
        </View>
        <View style={styles.buttoncontainer}>
          {Order.noofboxes > 0 ? (
            <CustomButton
              title="In-Transit"
              type="fill"
              onPress={(event) => OnStatusClicked(event, 3)}
            />
          ) : null}
          {Order.noofboxes > 0 ? (
            <CustomButton
              title="Delivered"
              type="fill"
              onPress={(event) => OnStatusClicked(event, 4)}
            />
          ) : null}
        </View>
      </>
    );
  };

  return (
    <>
      <LinearStyle>
        <Loader loading={loading} />
        <LogoIcon />
        <Text style={styles.headerTitle}>Order Details</Text>
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
                    styles.top30,
                  ]}>
                  <Text style={styles.labeltext}>Order Number:</Text>
                  <Text style={styles.labelvalue}>{Order.ordernum}</Text>
                </View>
                <View style={[styles.labelcontainer, styles.bottom10]}>
                  <Text style={styles.labeltext}>Receiver Name:</Text>
                  <Text style={styles.labelvalue}>{Order.consignee}</Text>
                </View>
                <View style={[styles.labelcontainer, styles.bottom10]}>
                  <Text style={styles.labeltext}>Receiver Number:</Text>
                  <Text style={styles.labelvalue}>{Order.consigneenum}</Text>
                </View>
                <View style={[styles.labelcontainer, styles.bottom10]}>
                  <Text style={styles.labeltext}>Sender Name:</Text>
                  <Text style={styles.labelvalue}>{Order.consignor}</Text>
                </View>
                <View style={[styles.labelcontainer, styles.bottom10]}>
                  <Text style={styles.labeltext}>Sender Number:</Text>
                  <Text style={styles.labelvalue}>{Order.consignornum}</Text>
                </View>
                <View style={[styles.labelcontainer, styles.bottom10]}>
                  <Text style={styles.labeltext}>Number of Boxes:</Text>
                  <Text style={styles.labelvalue}>{Order.noofboxes}</Text>
                </View>
                {error != '' ? (
                  <Text style={styles.errortext}>{error}</Text>
                ) : null}
                {cancelled ? (
                  <View style={styles.buttoncontainer}>
                    <CustomButton title="Search" onPress={OnSearchClicked} />
                  </View>
                ) : (
                  <GetButtonItems />
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearStyle>
    </>
  );
};

export default OrderDetailsScreen;
