import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 0.5,
    height: 100,
  },
  lastContainer: {
    borderTopWidth: 0.5,
    height: 100,
    borderBottomWidth: 0.5,
  },
  title: {
    paddingLeft: 10,
    paddingTop: 10,
    fontSize: 18,
  },
});

const Envelope = props => (
  <View style={props.isLast ? styles.lastContainer : styles.container}>
    <Text style={styles.title}>{props.envelope.name}</Text>
    <Text style={styles.title}>${props.envelope.value}</Text>
  </View>
);

Envelope.navigationOptions = {
  title: 'Envelope',
};

export default Envelope;
