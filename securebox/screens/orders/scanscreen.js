import React, {useState, useEffect, ScrollView} from 'react';
import {View, Text, Switch} from 'react-native';
import LinearStyle from '../LinearStyle';
import LogoIcon from '../logo';
import styles from '../../styles';
import {CustomButton} from '../components/buttions';
import {RNCamera} from 'react-native-camera';

import Loader from '../loader';
import axios from 'axios';
import {ApiUrl} from '../../config';
import {GetItem} from '../../sessions';

const ScanScreen = ({navigation, route}) => {
  const [orderid, setOrderId] = useState(0);
  const [onload, setOnLoad] = useState(true);
  const [error, setError] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [flashMode, setFlashMode] = useState('off');
  const [scanned, setScanned] = useState(false);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setOnLoad(true);
      setOrderId(route.params.orderid);
      setError('');
      setIsEnabled(false);
      setFlashMode('off');
      setScanned(false);
    });

    return unsubscribe;
  }, [navigation, orderid]);

  const addBoxToOrder = async (barcode) => {
    setloading(true);
    const url = `${ApiUrl}addbox`;

    let data = {
      orderid: route.params.orderid,
      barcode: barcode,
    };

    let rslt = {};
    const token = await GetItem('userToken');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`,
    };

    await axios
      .post(url, data, {
        headers: headers,
      })
      .then((res) => {
        rslt = res.data;
      })
      .catch((err) => {
        rslt = {status: 403, statusText: 'Unable to connect the server'};
      });

    setloading(false);

    return rslt;
  };

  const barcodeReceived = async ({barcodes}) => {
    setError('');
    if (barcodes.length > 0) {
      if (barcodes[0].type !== 'UNKNOWN_FORMAT') {
        setScanned(true);
        let code = barcodes[0].data;
        let rslt = await getOrderIdForBarcode(code);
        const type = route.params.type;
        let foundOrder = route.params.orderid;

        if (rslt.status === 100) {
          if (type === 'scan') {
            foundOrder = 0;
            if (rslt.data.statusid === 5) {
              setError(`Order was cancelled`);
            } else if (rslt.data.statusid === 4) {
              setError(`Order was delivered`);
            } else {
              foundOrder = rslt.data.orderid;
            }
          } else {
            foundOrder = 0;
            setError('Barcode in use');
          }
        } else if (rslt.status === 300) {
          if (type === 'scan') {
            foundOrder = 0;
            setError('No orders found');
          } else {
            rslt = await addBoxToOrder(code);
            if (rslt.status !== 100) {
              foundOrder = 0;
            }
          }
        } else {
          foundOrder = 0;
        }

        if (foundOrder > 0) {
          navigation.navigate('OrderDetails', {
            orderid: foundOrder,
          });
        }
      }
    }
  };

  const getOrderIdForBarcode = async (barcode) => {
    setloading(true);
    const token = await GetItem('userToken');
    const url = `${ApiUrl}orderbycode/${barcode}`;

    let rslt = {};

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`,
    };

    await axios
      .get(url, {
        headers: headers,
      })
      .then((res) => {
        rslt = res.data;
        if (rslt.status !== 100) {
          setError(rslt.statusText);
        }
      })
      .catch((err) => {
        rslt = {status: 403, statusText: 'Unable to connect the server'};
      });

    setloading(false);
    return rslt;
  };

  const OnRetryClicked = async (event) => {
    event.preventDefault();
    setError('');
    setScanned(false);
  };

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    if (!isEnabled) {
      setFlashMode('torch');
    } else {
      setFlashMode('off');
    }
  };

  const OnCancelClicked = async (event) => {
    event.preventDefault();
    setError('');
    const type = route.params.type;
    if (type === 'scan') {
      navigation.navigate('Order');
    } else {
      navigation.navigate('OrderDetails', {
        orderid: route.params.orderid,
      });
    }
  };

  return (
    <>
      <LinearStyle>
        <Loader loading={loading} />
        <LogoIcon />
        <Text style={styles.headerTitle}>Barcode Scan</Text>
        <View style={styles.workspace}>
          <View style={styles.mainspace}>
            <View style={styles.formspace}>
              <View style={styles.scancontainer}>
                <View style={styles.switchcontainer}>
                  <Text style={styles.switchtext}>Flash Light </Text>
                  <Switch
                    trackColor={{false: '#767577', true: '#2EB4C0'}}
                    thumbColor={isEnabled ? '#C5C109' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                  />
                </View>

                <RNCamera
                  flashMode={flashMode}
                  whiteBalance={'auto'}
                  cameraType={'back'}
                  autoFocus={'on'}
                  style={styles.scanner}
                  captureAudio={false}
                  onGoogleVisionBarcodesDetected={
                    scanned ? undefined : barcodeReceived
                  }
                />
                {error != '' ? (
                  <Text style={styles.errortext}>{error} </Text>
                ) : null}

                <View style={styles.buttoncontainer}>
                  <CustomButton title="Cancel" onPress={OnCancelClicked} />
                  <CustomButton title="Retry" onPress={OnRetryClicked} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </LinearStyle>
    </>
  );
};

export default ScanScreen;
