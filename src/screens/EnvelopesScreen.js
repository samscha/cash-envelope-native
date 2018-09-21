import React from 'react';
import {
  Alert,
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
    // try {
    //   const response = await axios.request({
    //     url: '/envelopes',
    //     method: 'post',
    //     data: envelope,
    //   });

    this.setState({
      envelopes: this.state.envelopes.concat([envelope]),
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

  _addEnvelope = _ => {
    // try {
    //   const response = await axios.request({
    //     url: '/envelopes',
    //     method: 'post',
    //     data: {
    //       name: 'New note',
    //       value: '1',
    //       notes: '',
    //     },
    //   });

    // const newEnvelope = {
    //   id: '0',
    //   name: 'Test',
    //   value: 1,
    //   notes: 'Test note',
    // };

    this.props.navigation.navigate('Envelope', {
      envelope: {},
      addEnvelope: this.addEnvelope,
      updateEnvelopes: this.updateEnvelopes,
      deleteEnvelope: this.deleteEnvelope,
    });
    // } catch (error) {
    //   alert(`error adding envelope: ${error.response.data.message}`);
    // }
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
      this.setState({ refreshing: false });

      const msg = error.response
        ? error.response.data.message
        : error.request._response;

      Alert.alert('Error', `${msg}`, [
        { text: 'OK', onPress: _ => this._handleEnvelopesError() },
      ]);
    }
  };

  _handleEnvelopesError = async _ => {
    await AsyncStorage.removeItem('com.cashenvelope');
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
                  <View>{EnvelopeComp(e, index, array)}</View>
                ) : (
                  EnvelopeComp(e, index, array)
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

const EnvelopeComp = (e, index, array) => (
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
