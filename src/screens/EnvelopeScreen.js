import React from 'react';
import { AsyncStorage, View, Text, TextInput, StyleSheet } from 'react-native';

import axios from '../axios';

class EnvelopeScreen extends React.Component {
  static navigatorOptions = {
    // title: 'Envelope',
  };

  state = {
    id: '',
    name: '',
    value: -1,
    notes: '',
  };

  componentWillMount() {
    const { id, name, value, notes } = this.props.navigation.getParam(
      'envelope',
      {
        name: 'error',
      },
    );

    this.setState({
      id,
      name,
      value,
      notes,
    });
  }

  _handleTextChange = notes => {
    this.setState({ notes });
  };

  editEnvelope = async data => {
    const cookies = JSON.parse(await AsyncStorage.getItem('com.cashenvelope'));

    try {
      const response = await axios.request({
        url: `/envelopes/${this.state.id}`,
        method: 'put',
        data,
        headers: {
          Cookie: cookies,
        },
      });

      const update = this.props.navigation.getParam('updateEnvelopes', {
        name: 'error',
      });

      update(response.data);
    } catch (error) {
      alert(`error editing envelope: ${error.response.data.message}`);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.state.name}</Text>
        <Text style={styles.value}>${this.state.value}</Text>

        <View style={styles.notesContainer}>
          <Text style={styles.notesTitle}>Notes:</Text>
          <TextInput
            value={this.state.notes}
            placeholder={this.state.notes ? null : 'no notes'}
            style={styles.notes}
            onChangeText={text => this._handleTextChange(text)}
            onSubmitEditing={_ =>
              this.editEnvelope({ notes: this.state.notes })
            }
            autoCorrect={false}
            returnKeyType="done"
            underlineColorAndroid="transparent"
          />
        </View>
      </View>
    );
  }
}

const notesFontSize = 14;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginTop: 10,
    textAlign: 'center',
  },
  value: {
    fontSize: 18,
    margin: 10,
    textAlign: 'center',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notesTitle: {
    fontSize: notesFontSize,
    alignSelf: 'center',
    paddingLeft: 10,
  },
  notes: {
    fontSize: notesFontSize,
    padding: 10,
    textAlign: 'left',
  },
});

export default EnvelopeScreen;
