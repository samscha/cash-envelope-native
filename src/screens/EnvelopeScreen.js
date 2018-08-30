import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

class EnvelopeScreen extends React.Component {
  static navigatorOptions = {
    // title: 'Envelope',
  };

  render() {
    const { navigation } = this.props;
    const envelope = navigation.getParam('envelope', { name: 'error' });

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{envelope.name}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 15,
    // backgroundColor: '#dddddd',
    backgroundColor: '#fff',
    // backgroundColor: '#00dcff',
  },
  title: {
    fontSize: 24,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default EnvelopeScreen;
