import React from 'react';
import {
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableNativeFeedback,
  TouchableHighlight,
} from 'react-native';

import Envelope from '../components/Envelope';

const envelopes = [
  { name: 'Groceries' },
  { name: 'Pet' },
  { name: 'Gas' },
  { name: 'title4' },
  { name: 'title5' },
  { name: 'title6' },
  { name: 'title7' },
];

const EnvelopesScreen = props => (
  <View style={styles.container}>
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={_ => alert('asdf')}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>

      {envelopes.map(e => (
        <Touchable
          key={e.name}
          underlayColor="#dddddd"
          onPress={_ =>
            props.navigation.navigate('Envelope', {
              envelope: e,
            })
          }
        >
          <Envelope key={e.name} envelope={e} />
        </Touchable>
      ))}
    </ScrollView>
  </View>
);

EnvelopesScreen.navigationOptions = {
  title: 'Envelopes',
};

export default EnvelopesScreen;

const Touchable =
  Platform.OS === 'android' ? TouchableNativeFeedback : TouchableHighlight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    alignItems: 'center',
    padding: 15,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 40,
  },
});
