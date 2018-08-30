import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

// import LoginStatusMessage from './LoginStatusMessage';
// import AuthButton from './AuthButton';

import Envelope from './Envelope';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

const MainScreen = () => (
  // <ScrollView style={styles.container}>
  <ScrollView>
    {/* <LoginStatusMessage /> */}
    {/* <AuthButton /> */}
    <Envelope />
    <Envelope />
    <Envelope />
    <Envelope />
    <Envelope />
    <Envelope />
    <Envelope />
    <Envelope />
    <Envelope />
    <Envelope />
    <Envelope />
    <Envelope />
    <Envelope />
    <Envelope />
    <Envelope />
    <Envelope />
    <Envelope />
  </ScrollView>
);

MainScreen.navigationOptions = {
  title: 'Envelopes',
};

export default MainScreen;
