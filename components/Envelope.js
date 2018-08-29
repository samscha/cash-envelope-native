import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    // borderColor: 'blue',
    // borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    height: 100,
    // backgroundColor: '#f1f1f1',
    // marginTop: 20,
    // marginBottom: 20,
    // width: 100,
  },
  title: {
    // padding: 5,
    // paddingBottom: 10,
    paddingLeft: 10,
    paddingTop: 10,
    fontSize: 18,
  },
});

const Envelope = props => (
  <View style={styles.container}>
    <Text style={styles.title}>{props.envelope.name}</Text>
  </View>
);

Envelope.navigationOptions = {
  title: 'Envelope',
};

export default Envelope;
