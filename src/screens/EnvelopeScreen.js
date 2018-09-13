import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';

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

  componentDidMount() {
    if (this.props.navigation.getParam('addEnvelope')) {
      this.props.navigation.getParam('addEnvelope')(this.state);
    }
  }

  editEnvelope = async data => {
    try {
      const response = await axios.request({
        url: `/envelopes/${this.state.id}`,
        method: 'put',
        data,
      });

      this.props.navigation.getParam('updateEnvelopes', {
        name: 'error',
      })(response.data);
    } catch (error) {
      alert(`error editing envelope: ${error.response.data.message}`);
    }
  };

  _deleteEnvelope = async _ => {
    try {
      const response = await axios.delete(`/envelopes/${this.state.id}`);

      this.props.navigation.getParam('deleteEnvelope', { name: 'error' })(
        this.state.id,
      );

      this.props.navigation.navigate('Envelopes');
    } catch (error) {
      alert(`error deleting envelope: ${error}`);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.title}
          value={this.state.name}
          onChangeText={text => this.setState({ name: text })}
          onSubmitEditing={_ => this.editEnvelope({ name: this.state.name })}
          underlineColorAndroid="transparent"
        />

        <View style={styles.valueContainer}>
          <Text style={styles.valueText}>$</Text>
          <TextInput
            style={styles.value}
            value={this.state.value + ''}
            onChangeText={text => this.setState({ value: +text })}
            onSubmitEditing={_ =>
              this.editEnvelope({ value: this.state.value })
            }
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.notesContainer}>
          <Text style={styles.notesTitle}>Notes:</Text>
          <TextInput
            value={this.state.notes}
            placeholder={this.state.notes ? null : 'no notes'}
            style={styles.notes}
            onChangeText={text => this.setState({ notes: text })}
            onSubmitEditing={_ =>
              this.editEnvelope({ notes: this.state.notes })
            }
            autoCorrect={false}
            returnKeyType="done"
            underlineColorAndroid="transparent"
          />
        </View>

        <TouchableOpacity
          onPress={_ => this._deleteEnvelope()}
          style={styles.buttonContainer}
        >
          <Text style={styles.buttonText}>Delete note</Text>
        </TouchableOpacity>
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
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  valueText: {
    alignSelf: 'center',
  },
  value: {
    fontSize: 18,
    margin: 10,
    marginLeft: 0,
    // textAlign: 'center',
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
  buttonContainer: {
    backgroundColor: '#ff531a',
    paddingVertical: 15,
    marginTop: 50,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
});

export default EnvelopeScreen;
