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
    value: '',
    notes: '',
    errors: {},
  };

  componentWillMount() {
    const { id, name, value, notes } = this.props.navigation.getParam(
      'envelope',
      // {
      //   name: 'error',
      // },
    );

    // this.setState({ id, name, value, notes });
  }

  componentDidMount() {
    this.titleInput.focus();
    // if (this.props.navigation.getParam('addEnvelope')) {
    //   this.props.navigation.getParam('addEnvelope')(this.state);
    // }
  }

  renderNameAlert = _ =>
    this.state.errors.name ? (
      <Text style={styles.alert} selectable={false}>
        {this.state.errors.name}
      </Text>
    ) : null;

  renderValueAlert = _ =>
    this.state.errors.value ? (
      <Text style={styles.alert} selectable={false}>
        {this.state.errors.value}
      </Text>
    ) : null;

  editEnvelope = async data => {
    /**
     * notes can empty
     */
    if (Object.values(data)[0] === '' && Object.keys(data)[0] !== 'notes')
      return alert(`Please provide ${Object.keys(data)[0]}`);

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

  _checkName = _state => {
    const state = _state || {};
    state.name = _state ? _state.name : this.state.name;
    state.errors = { ...this.state.errors, name: '' };

    const chars = _state ? state.name.length : this.state.name.length;

    if ((chars < 2 || chars > 100) && chars > 0) {
      state.errors.name = `Envelope name must be between 2 and 100 characters: ${
        chars < 2 ? 2 - chars : chars - 100
      } ${chars < 2 ? 'remaining' : 'too many'}`;
    }

    if (state.name !== '' && state.errors.name === '') {
      if (state.name.trim().length < 1)
        state.errors.name = 'Envelope name must have a letter';

      if (state.name[0] === ' ')
        state.errors.name = 'Envelope name must not start with a space';
    }

    this.setState({ ...state });
  };

  _checkValue = _state => {
    const state = _state || {};

    if (_state) {
      if (this.state.value === '') state.value = _state.value;
      else state.value = _state.value.slice(1);
    }

    if (!_state) state.value = this.state.value.slice(1);

    state.value = _state ? _state.value : this.state.value.slice(1);
    state.errors = { ...this.state.errors, value: '' };

    if (state.value === '$' || state.value === '')
      return this.setState({ value: '', errors: state.errors });

    if (_state && !Number.isInteger(+state.value))
      state.errors.value = 'Envelope value must be a number (integer)';

    if (state.value < 1)
      state.errors.value = `Envelope value must be greater than 0`;

    state.value = `$${state.value}`;

    this.setState({ ...state });
  };

  _checkNotes = _state => {
    const state = _state || {};

    this.setState({ ...state });
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

  _handleText = state => {
    switch (Object.keys(state)[0]) {
      case 'name':
        return this._checkName(state);

      case 'value':
        return this._checkValue(state);

      case 'notes':
        return this._checkNotes(state);

      default:
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View>
          <TextInput
            onChangeText={text => this._handleText({ name: text })}
            // onSubmitEditing={_ => this.editEnvelope({ name: this.state.name })}
            // onBlur={_ => this.editEnvelope({ name: this.state.name })}
            onSubmitEditing={_ =>
              this.state.value === '' ? this.valueInput.focus() : null
            }
            placeholder="Envelope Title"
            ref={input => (this.titleInput = input)}
            returnKeyType={this.state.value !== '' ? 'done' : 'next'}
            style={styles.title}
            underlineColorAndroid="transparent"
            value={this.state.name}
          />
          {this.renderNameAlert()}

          {/* <View style={styles.valueContainer}> */}
          {/* <Text style={styles.valueText}>$</Text> */}
          <TextInput
            keyboardType="number-pad"
            onChangeText={text => this._handleText({ value: text })}
            onBlur={_ => this._checkValue()}
            // onSubmitEditing={_ => this.notesInput.focus()}
            // onBlur={_ => this.editEnvelope({ value: this.state.value })}
            // onSubmitEditing={_ =>
            //   this.editEnvelope({ value: this.state.value })
            // }
            placeholder="$0"
            ref={input => (this.valueInput = input)}
            returnKeyType="done"
            style={styles.value}
            underlineColorAndroid="transparent"
            value={this.state.value}
          />
          {this.renderValueAlert()}
          {/* </View> */}

          {/* <View style={styles.notesContainer}> */}
          {/* <Text style={styles.notesTitle}>Notes:</Text> */}
          <TextInput
            value={this.state.notes}
            placeholder="notes"
            style={styles.notes}
            ref={input => (this.notesInput = input)}
            onChangeText={text => this._handleText({ notes: text })}
            // onBlur={_ => this.editEnvelope({ notes: this.state.notes })}
            // onSubmitEditing={_ =>
            //   this.editEnvelope({ notes: this.state.notes })
            // }
            autoCorrect={false}
            returnKeyType="done"
            underlineColorAndroid="transparent"
            value={this.state.notes}
          />
          {/* </View> */}
        </View>

        <View>
          <Text>actions here</Text>
        </View>

        <TouchableOpacity
          onPress={_ => this._deleteEnvelope()}
          style={styles.buttonContainer}
        >
          <Text style={styles.buttonText}>Delete envelope</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const notesFontSize = 14;

const styles = StyleSheet.create({
  alert: {
    color: '#ff531a',
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
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
    // margin: 10,
    padding: 10,
    paddingTop: 0,
    // backgroundColor: 'red',
    marginLeft: 0,
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
  title: {
    fontSize: 24,
    // marginTop: 10,
    textAlign: 'center',
    padding: 10,
    // backgroundColor: 'red',
  },
});

export default EnvelopeScreen;
