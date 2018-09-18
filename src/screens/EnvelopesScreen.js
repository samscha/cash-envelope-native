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
  RefreshControl,
} from 'react-native';

import axios from '../axios';

import Envelope from '../components/Envelope';

class EnvelopesScreen extends React.Component {
  state = {
    envelopes: [],
    refreshing: false,
  };

  async componentWillMount() {
    const headers = JSON.parse(await AsyncStorage.getItem('com.cashenvelope'));

    axios.defaults.headers = headers;
    this._getEnvelopes();
  }

  addEnvelope = envelope => {
    this.setState({
      envelopes: this.state.envelopes.concat(envelope),
    });
  };

  updateEnvelopes = envelope => {
    this.setState({
      envelopes: this.state.envelopes.map(
        e => (e.id === envelope.id ? envelope : e),
      ),
    });
  };

  deleteEnvelope = id => {
    this.setState({
      envelopes: this.state.envelopes.filter(e => e.id !== id),
    });
  };

  _addEnvelope = async note => {
    try {
      const response = await axios.request({
        url: '/envelopes',
        method: 'post',
        data: {
          name: 'New note',
          value: '1',
          notes: '',
        },
      });

      const newEnvelope = response.data;

      this.props.navigation.navigate('Envelope', {
        envelope: newEnvelope,
        updateEnvelopes: this.updateEnvelopes,
        deleteEnvelope: this.deleteEnvelope,
        addEnvelope: this.addEnvelope,
      });
    } catch (error) {
      alert(`error adding envelope: ${error.response.data.message}`);
    }
  };

  _onRefresh = _ => {
    this.setState({ refreshing: true });
    this._getEnvelopes();
  };

  _getEnvelopes = async _ => {
    try {
      const response = await axios.request({
        url: '/envelopes',
        method: 'get',
      });

      this.setState({ envelopes: response.data, refreshing: false });
    } catch (error) {
      const msg = error.response
        ? error.response.data.message
        : error.request._response;

      alert(`error retrieving envelopes: ${msg}`);

      await AsyncStorage.clear();
    }
  };

  render() {
    const props = this.props;
    const envelopes = this.state.envelopes;

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <TouchableOpacity
            style={styles.button}
            onPress={_ => this._addEnvelope()}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>

          <View style={styles.envelopes}>
            {envelopes.map((e, index, array) => (
              <Touchable
                key={e.id}
                underlayColor="#dddddd"
                onPress={_ =>
                  props.navigation.navigate('Envelope', {
                    envelope: e,
                    updateEnvelopes: this.updateEnvelopes,
                    deleteEnvelope: this.deleteEnvelope,
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
                    {EnvelopeComp(e, index, array, this.editEnvelope)}
                  </View>
                ) : (
                  EnvelopeComp(e, index, array, this.addEnvelope)
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

const EnvelopeComp = (e, index, array, editEnvelope) => (
  <Envelope key={e.id} envelope={e} isLast={array.length - 1 === index} />
);

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
