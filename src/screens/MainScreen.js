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
import Envelope from './EnvelopesScreen';

const envelopes = [
  // { name: 'Groceries' },
  { name: 'Pet' },
  { name: 'Gas' },
  { name: 'title4' },
  { name: 'title5' },
  { name: 'title6' },
  { name: 'title7' },
];

const MainScreen = props => (
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
            props.navigation.navigate('Detail', {
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

MainScreen.navigationOptions = {
  title: 'Envelopes',
};

export default MainScreen;

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
