import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 0.5,
    height: 100,
  },
  lastContainer: {
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    height: 100,
  },
  title: {
    fontSize: 18,
    paddingLeft: 10,
    paddingTop: 10,
  },
  notes: {
    fontSize: 12,
    paddingLeft: 10,
    paddingTop: 10,
  },
});

const Envelope = props => (
  <View style={props.isLast ? styles.lastContainer : styles.container}>
    <Text style={styles.title}>{props.envelope.name}</Text>
    <Text style={styles.title}>${props.envelope.value}</Text>
    <Text style={styles.notes}>{props.envelope.notes}</Text>
  </View>
);

Envelope.navigationOptions = {
  // title: 'Envelope',
};

export default Envelope;
