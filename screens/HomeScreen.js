import React from 'react';
import {
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser, Icon } from 'expo';

import TabBarIcon from '../components/TabBarIcon';
import Envelope from '../components/Envelope';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    // header: null,
    title: 'Envelopes',
    headerStyle: {
      // backgroundColor: '#9df2ff',
      // backgroundColor: '#ddd',
      borderBottomColor: '#000000',
      borderBottomWidth: 0.5,
    },
  }; // backgroundColor: '#6edc6e',
  // headerRight: (
  //   <Icon.Ionicons
  //     name="md-add"
  //     onPress={_ => alert('asdf')}
  //     size={26}
  //   />
  // ),

  render() {
    const envelopes = [
      { name: 'title1' },
      { name: 'title2' },
      { name: 'title3' },
      { name: 'title4' },
      { name: 'title5' },
      { name: 'title6' },
      { name: 'title7' },
      { name: 'title8' },
      { name: 'title9' },
    ];

    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={_ => alert('asdf')}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>

        {envelopes.map(e => (
          <Envelope key={e.name} envelope={e} />
        ))}
      </ScrollView>
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
  button: {
    alignItems: 'center',
    // height: 50,
    padding: 15,
    // backgroundColor: '#9df2ff',
    // backgroundColor: '#ddd',
    // flex: 1,
    // marginTop: -15,
  },
  buttonText: {
    // backgroundColor: '#228b22',
    textAlign: 'center',
    // width: 90,
    fontSize: 40,
  },
});
