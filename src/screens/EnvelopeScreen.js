import React from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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
    updatedAt: '',
    errors: {},
    isSaved: false,
    isSaving: false,
    isDeleting: false,
    message: '',
    hasUpdate: false,
    isUpdating: false,
    prev: {},
  };

  componentDidMount() {
    const {
      id,
      name,
      value,
      notes,
      updatedAt,
    } = this.props.navigation.getParam('envelope');

    const formattedValue = `$${value}`;

    if (id && name && value)
      return this.setState({
        id,
        name,
        value: formattedValue,
        notes,
        updatedAt,
        isSaved: true,
        prev: { id, name, value: formattedValue, notes },
      });

    this.titleInput.focus();
  }

  componentDidUpdate(_, prevState) {
    if (
      this.state.isSaved &&
      (prevState.name !== '' &&
        prevState.value !== '' &&
        prevState.bites !== '') &&
      (prevState.name !== this.state.name ||
        prevState.value !== this.state.value ||
        prevState.notes !== this.state.notes)
    )
      this.setState({ hasUpdate: true });
  }

  componentWillUnmount() {
    // axios.cancelRequests();
  }

  renderMessage = _ =>
    this.state.message !== '' ? (
      <Text style={styles.alertTop} selectable={false}>
        {this.state.message}
      </Text>
    ) : null;

  renderAlert = _ =>
    this.state.errors.error ? (
      <Text style={styles.alertTop} selectable={false}>
        {this.state.errors.error}
      </Text>
    ) : null;

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

  renderSaveUpdateEnvelopeButton = _ =>
    this.state.isSaved ? null : (
      <TouchableOpacity
        onPress={_ => this._addEnvelope()}
        disabled={this.state.isSaving}
        style={[styles.buttonContainerSave, this._styles('save')]}
      >
        {this.state.isSaving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save envelope</Text>
        )}
      </TouchableOpacity>
    );

  renderUpdateEnvelopeButton = _ =>
    this.state.hasUpdate && !this._hasErrors() ? (
      <TouchableOpacity
        onPress={_ => this._editEnvelope()}
        disabled={this.state.isUpdating}
        style={[styles.buttonContainerSave, this._styles('update')]}
      >
        {this.state.isUpdating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Update envelope</Text>
        )}
      </TouchableOpacity>
    ) : null;

  renderDeleteEnvelopeButton = _ => (
    <TouchableOpacity
      onPress={_ => this._deleteEnvelope()}
      disabled={this.state.isDeleting || !this.state.isSaved}
      style={[styles.buttonContainer, this._styles('delete')]}
    >
      {this.state.isDeleting ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>Delete envelope</Text>
      )}
    </TouchableOpacity>
  );

  _addEnvelope = async _ => {
    this._dismissKeyboard();

    if (!this._check()) return;

    const { name, value, notes } = this.state;

    const envelope = { name, value: value.slice(1), notes };

    try {
      this.setState({ isSaving: true });

      const response = await axios.post(`/envelopes`, envelope);
      const newEnvelope = response.data;

      this.props.navigation.getParam('addEnvelope')(newEnvelope);

      this.setState({
        id: newEnvelope.id,
        isSaved: true,
        isSaving: false,
        prev: {
          id: newEnvelope.id,
          name: this.state.name,
          value: this.state.value,
          notes: this.state.notes,
        },
      });
    } catch (error) {
      this.setState({ isSaving: false });
    }
  };

  _dismissKeyboard = _ => {
    this.titleInput.blur();
    this.valueInput.blur();
    this.notesInput.blur();
  };

  _editEnvelope = async _ => {
    this._dismissKeyboard();

    if (!this._check()) return;

    const { name, value, notes } = this.state;

    const envelope = { name, value: value.slice(1), notes };

    this.setState({ isUpdating: true });

    try {
      const response = await axios.put(`/envelopes/${this.state.id}`, envelope);

      const { id, name, value, notes } = this.state;

      this.setState({
        isUpdating: false,
        hasUpdate: false,
        prev: { id, name, value, notes },
      });

      this.props.navigation.getParam('updateEnvelopes')(response.data);
    } catch (error) {
      this.setState({ isUpdating: false });
      alert(`error editing envelope: ${error.response.data.message}`);
    }
  };

  __setGeneralError = error => {
    this.setState({
      errors: {
        ...this.state.errors,
        error,
      },
    });
  };

  _check = _ => {
    const { name, value } = this.state;

    if (name === '' && value === '')
      return this.__setGeneralError(
        'Please provide an envelope name and value',
      );

    if (name === '')
      return this.__setGeneralError('Please provide an envelope name');

    if (value === '')
      return this.__setGeneralError('Please provide an envelope value');

    return true;
  };

  _checkName = _state => {
    const state = _state || {};
    state.name = _state ? _state.name : this.state.name;
    state.errors = { ...this.state.errors };
    delete state.errors.name;

    const chars = _state ? state.name.length : this.state.name.length;

    if (chars < 2 && chars > 0)
      state.errors.name = `Envelope name must be greater than 2 characters: ${2 -
        chars} remaining`;
    else if (chars > 100)
      state.errors.name = `Envelope name must be less than 100 characters: ${chars -
        100} too many`;

    if (state.name !== '' && !state.errors.name) {
      if (state.name.trim().length < 1)
        state.errors.name = 'Envelope name must have a letter';

      if (state.name[0] === ' ')
        state.errors.name = 'Envelope name must not start with a space';
    }

    if (
      this.state.isSaved &&
      this.state.prev.name === this.state.name &&
      this.state.prev.value === this.state.value &&
      this.state.prev.notes === this.state.notes
    )
      state.hasUpdate = false;

    delete state.errors.error;

    this.setState({ ...state });
  };

  /**
   * checks the `value` of envelope
   *
   * first check if there is a `_state`, which only happens when text
   * is entered via TextInput
   *
   * if there is `_state`, check if `this.state.value` is empty (first entry)
   * and if there is, just set the state.value to incoming text
   * else, this means a `this.state.value` was already set, so
   * remove the first char (`$`)
   *
   * if there is no `_state`, which happens `onBlur` of TextInput,
   * take `this.state.value` without the `$`. These two conditions are
   * necessary to ensure that this function's `state` has a value to check
   *
   * this.state.value will be formatted as `$<<value>>`, e.g. `$5`
   *
   */
  _checkValue = _state => {
    const state = _state || {};

    if (_state) {
      if (this.state.value === '') state.value = _state.value;
      else state.value = _state.value.slice(1);
    }

    if (!_state) state.value = this.state.value.slice(1);

    state.errors = { ...this.state.errors };
    delete state.errors.value;

    if (state.value === '$' || state.value === '')
      return this.setState({ value: '', errors: state.errors });

    if (!Number.isInteger(+state.value) || state.value.includes(' '))
      state.errors.value = 'Envelope value must be a number (integer)';

    if (state.value < 1 && !state.errors.value)
      state.errors.value = `Envelope value must be greater than 0`;

    const nonDigits = state.value.replace(/[0-9]/g, '');

    if (nonDigits && !state.errors.value)
      state.errors.value = `Envelope value must only be digits: ${nonDigits} not valid`;

    // for (let i = 0; i < state.value.length; i++) {
    //   const num = state.value[i];

    //   if (!'1234567890'.includes(num)) {
    //     state.errors.value = `Envelope value must only be digits: ${num} not valid`;
    //     break;
    //   }
    // }

    state.value = `$${state.value}`;

    if (
      this.state.isSaved &&
      this.state.prev.name === this.state.name &&
      this.state.prev.value === this.state.value &&
      this.state.prev.notes === this.state.notes
    )
      state.hasUpdate = false;

    delete state.errors.error;

    this.setState({ ...state });
  };

  _checkNotes = _state => {
    const state = _state || {};

    if (
      this.state.isSaved &&
      this.state.prev.name === this.state.name &&
      this.state.prev.value === this.state.value &&
      this.state.prev.notes === this.state.notes
    )
      state.hasUpdate = false;

    this.setState({ ...state });
  };

  _deleteEnvelope = async _ => {
    try {
      this.setState({ isDeleting: true });
      const response = await axios.delete(`/envelopes/${this.state.id}`);

      this.props.navigation.getParam('deleteEnvelope')(this.state.id);

      this.props.navigation.navigate('Envelopes');
    } catch (error) {
      alert(`error deleting envelope: ${error}`);

      this.setState({ isDeleting: false });
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

  _hasErrors = _ =>
    Object.keys(this.state.errors).length !== 0 ||
    this.state.name === '' ||
    this.state.value === '';

  /**
   * `state`ful styles
   */
  _styles = key => {
    const styles = {
      delete: {
        marginTop: 10,
        backgroundColor: '#ff531a',
        opacity: this.state.isDeleting || !this.state.isSaved ? 0.2 : 1.0,
      },
      save: {
        opacity: this.state.isSaving ? 0.2 : 1.0,
      },
      update: {
        opacity: this.state.isUpdating ? 0.2 : 1.0,
      },
    };

    return styles[key];
  };

  _updatedAtParsed = _ => {
    const months = {
      '01': 'January',
      '02': 'February',
      '03': 'March',
      '04': 'April',
      '05': 'May',
      '06': 'June',
      '07': 'July',
      '08': 'August',
      '09': 'September',
      '10': 'October',
      '11': 'November',
      '12': 'December',
    };

    const updatedAtSplit = this.state.updatedAt.split('T');

    const date = updatedAtSplit[0];
    const time = updatedAtSplit[1];

    const dateSplit = date.split('-');
    const year = dateSplit[0];
    const month = months[dateSplit[1]];
    const day = dateSplit[2];

    // console.log(new Date().toJSON());

    // TODO: parse to show TODAY, YESTERDAY, etc

    return `${month} ${day}, ${year}`;
  };

  render() {
    return (
      <View style={styles.container}>
        {this.renderMessage()}

        <View>
          {this.renderUpdateEnvelopeButton()}
          {this.renderSaveUpdateEnvelopeButton()}
          {this.renderAlert()}

          <TextInput
            onChangeText={text =>
              this._handleText({
                name: text,
              })
            }
            onBlur={_ => this._checkName()}
            onSubmitEditing={_ => this.valueInput.focus()}
            placeholder="Envelope Title"
            ref={input => (this.titleInput = input)}
            // returnKeyType={this.state.isSaved ? 'done' : 'next'}
            returnKeyType="next"
            style={styles.title}
            underlineColorAndroid="transparent"
            value={this.state.name}
          />
          {this.renderNameAlert()}

          <TextInput
            // keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'phone-pad'}
            keyboardType="phone-pad"
            onChangeText={text => this._handleText({ value: text })}
            onSubmitEditing={_ => this.notesInput.focus()}
            onBlur={_ => this._checkValue()}
            placeholder="$0"
            ref={input => (this.valueInput = input)}
            // returnKeyType={this.state.isSaved ? 'done' : 'next'}
            returnKeyType={Platform.OS === 'ios' ? 'done' : 'next'}
            style={styles.value}
            underlineColorAndroid="transparent"
            value={this.state.value}
          />
          {this.renderValueAlert()}

          <TextInput
            onChangeText={text => this._handleText({ notes: text })}
            onSubmitEditing={_ => this.titleInput.focus()}
            placeholder="notes"
            ref={input => (this.notesInput = input)}
            returnKeyType="next"
            style={styles.notes}
            underlineColorAndroid="transparent"
            value={this.state.notes}
          />
        </View>

        <View>
          <Text style={[styles.buttonText, { color: '#000' }]}>
            {`<<actions here>>`}
          </Text>
        </View>

        <View>
          <Text style={styles.updatedAt}>
            {this.state.updatedAt
              ? `Last updated: ${this._updatedAtParsed()}`
              : null}
          </Text>

          {this.renderDeleteEnvelopeButton()}
        </View>
      </View>
    );
  }
}

const colors = {
  theme: '#304047',
};

const notesFontSize = 14;

const styles = StyleSheet.create({
  alert: {
    color: '#ff531a',
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  alertTop: {
    // color: '#ff531a',
    // fontWeight: '700',
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: 'center',
    backgroundColor: '#ffff99',
  },
  buttonContainer: {
    // backgroundColor: '#ff531a',
    paddingVertical: 15,
    marginTop: 50,
  },
  buttonContainerSave: {
    backgroundColor: colors.theme,
    paddingVertical: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
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
  title: {
    fontSize: 24,
    // marginTop: 10,
    textAlign: 'center',
    padding: 10,
    // backgroundColor: 'red',
  },
  updatedAt: {
    textAlign: 'center',
    color: '#b6b6b6',
  },
});

export default EnvelopeScreen;
