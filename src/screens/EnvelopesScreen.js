import React from 'react';
import {
  AsyncStorage,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableNativeFeedback,
  TouchableHighlight,
} from 'react-native';

import axios from '../axios';

import Envelope from '../components/Envelope';

class EnvelopesScreen extends React.Component {
  state = {
    envelopes: [],
  };

  async componentWillMount() {
    const cookies = JSON.parse(await AsyncStorage.getItem('com.cashenvelope'));

    try {
      const response = await axios.request({
        url: '/envelopes',
        method: 'get',
        headers: {
          Cookie: cookies,
        },
      });
      this.setState({ envelopes: response.data });
    } catch (error) {
      // console.log(error.request);
      // console.log(error.config);
      // console.log(error.request);
      // console.log(error.response);
      // console.log(error.line);
      // console.log(error.column);
      // console.log(error.sourceURL);
      alert(`error retrieving envelopes: ${error.response}`);
    }
  }

  _addEnvelope = async _ => {
    alert('asdf');
  };

  render() {
    const props = this.props;
    const envelopes = this.state.envelopes;

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          <TouchableOpacity
            style={styles.button}
            onPress={_ => this._addEnvelope()}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>

          <View style={styles.envelopes}>
            {envelopes.map((e, index, array) => (
              <Touchable
                key={e.name}
                underlayColor="#dddddd"
                onPress={_ =>
                  props.navigation.navigate('Envelope', {
                    envelope: e,
                  })
                }
              >
                {Platform.OS === 'android' ? (
                  /**
                   * TouchableNativeFeedback requires a parent View
                   *
                   * https://facebook.github.io/react-native/docs/touchablenativefeedback
                   *
                   */
                  <View>
                    <Envelope
                      key={e.name}
                      envelope={e}
                      isLast={array.length - 1 === index}
                    />
                  </View>
                ) : (
                  <Envelope
                    key={e.name}
                    envelope={e}
                    isLast={array.length - 1 === index}
                  />
                )}
              </Touchable>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
}
EnvelopesScreen.navigationOptions = {
  title: 'Envelopes',
};

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
  envelopes: {
    // borderBottomWidth: 0.5,
  },
});

export default EnvelopesScreen;
