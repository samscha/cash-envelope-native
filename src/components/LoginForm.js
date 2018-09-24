import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import axios from '../axios';

export default class LoginForm extends React.Component {
  state = {
    username: '',
    password: '',
    isLoggingIn: false,
    error: '',
    errors: {},
  };

  componentDidMount() {
    this.emailInput.focus();
  }
  renderUsernameAlert = _ =>
    this.state.errors.username ? (
      <Text style={styles.alert} selectable={false}>
        {this.state.errors.username}
      </Text>
    ) : null;

  renderPasswordAlert = _ =>
    this.state.errors.password ? (
      <Text style={styles.alert} selectable={false}>
        {this.state.errors.password}
      </Text>
    ) : null;

  renderAlert = _ =>
    this.state.errors.login ? (
      <Text style={styles.alert} selectable={false}>
        {this.state.errors.login}
      </Text>
    ) : null;

  _checkUsername = async _state => {
    const state = _state || {};
    state.errors = {};

    const chars = _state ? state.username.length : this.state.username.length;

    if ((chars < 7 || chars > 32) && chars > 0) {
      state.errors.username = `Username must be between 7 and 32 characters: ${
        chars < 7 ? 7 - chars : chars - 32
      } ${chars < 7 ? 'remaining' : 'too many'}`;
    }

    // TODO: add check to see if username exists in db already (async)

    this.setState({ ...state });
  };

  _checkPassword = _state => {
    const state = _state || {};
    state.errors = {};

    const chars = _state ? state.password.length : this.state.password.length;

    if ((chars < 8 || chars > 64) && chars > 0)
      state.errors.password = `Password must be between 8 and 64 characters: ${
        chars < 8 ? 8 - chars : chars - 64
      } ${chars < 8 ? 'remaining' : 'too many'}`;

    this.setState({ ...state });
  };

  _handleTextChange = state => {
    switch (Object.keys(state)[0]) {
      case 'username':
        return this._checkUsername(state);

      case 'password':
        return this._checkPassword(state);

      default:
        return this.setState({
          errors: {
            login: `Error updating state: ${Object.keys(state)[0]} not found`,
          },
        });
    }
  };

  _hasErrors = _ =>
    (Object.keys(this.state.errors).length !== 0 &&
      this.state.errors.msg &&
      !this.state.errors.msg.includes('network connection')) ||
    this.state.username === '' ||
    this.state.password === '';

  _logInAsync = async _ => {
    this.setState({ error: '' });

    const username = this.state.username;
    const password = this.state.password;

    if (!this._validateInput(username, password)) return;

    try {
      this.setState({ isLoggingIn: true });
      const response = await axios.post('/login', {
        username,
        password,
      });

      await AsyncStorage.setItem(
        'com.cashenvelope',
        JSON.stringify(response.headers),
      );

      this.props.navigation.navigate('App');
    } catch (error) {
      /**
       * if there is no response error, this means a response was never received
       * this is likely due to connectivity issues
       *
       */
      let msg;

      if (error.response) {
        if (error.response.data.message) {
          msg = error.response.data.message;
        } else {
          if (error.response.request.status === 503) {
            msg = 'Unable to reach server';
          } else {
            msg = 'Unknown error occured';
          }
        }
      } else {
        msg = error.request._response;
      }

      this.setState({
        errors: { login: msg },
        isLoggingIn: false,
      });

      if (msg.includes('password')) return this.passwordInput.focus();

      /**
       * the fallback focus
       */
      this.emailInput.focus();
    }
  };

  _resetErrors = _ =>
    this.setState({
      errors: '',
    });

  /**
   * `state`ful styles
   */
  _styles = key => {
    const styles = {
      opacity: this.state.isLoggingIn ? 0.2 : 1.0,
      opacityLogInButton:
        this.state.isLoggingIn || this._hasErrors() ? 0.2 : 1.0,
    };

    return styles[key];
  };

  _validateInput = (username, password) => {
    if (!username && !password) {
      this.setState({
        error: 'Please provide an email and password',
      });
      this.emailInput.focus();
      return;
    }

    if (username === '' || password === '') {
      if (!username) {
        this.setState({
          error: 'Please provide an email',
        });
        this.emailInput.focus();
        return;
      }

      this.passwordInput.focus();
      this.setState({
        error: 'Please provide a password',
      });
      return;
    }

    return true;
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          editable={!this.state.isLoggingIn}
          keyboardType="email-address"
          onBlur={_ => this._checkUsername()}
          onChangeText={text => this._handleTextChange({ username: text })}
          onSubmitEditing={_ =>
            this.state.password && !this._hasErrors()
              ? this._logInAsync()
              : this.passwordInput.focus()
          }
          placeholder="Email"
          ref={input => (this.emailInput = input)}
          returnKeyType={
            this.state.password && !this._hasErrors() ? 'done' : 'next'
          }
          style={[styles.input, { opacity: this._styles('opacity') }]}
          underlineColorAndroid="transparent"
        />
        {this.renderUsernameAlert()}

        <TextInput
          editable={!this.state.isLoggingIn}
          onBlur={_ => this._checkPassword()}
          onChangeText={text => this._handleTextChange({ password: text })}
          onSubmitEditing={_ => this._logInAsync()}
          placeholder="Password"
          ref={input => (this.passwordInput = input)}
          returnKeyType="go"
          secureTextEntry
          style={[styles.input, { opacity: this._styles('opacity') }]}
          underlineColorAndroid="transparent"
        />
        {this.renderPasswordAlert()}

        {this.renderAlert()}

        <TouchableOpacity
          disabled={this.state.isLoggingIn || this._hasErrors()}
          onPress={_ => this._logInAsync()}
          style={[
            styles.buttonContainer,
            { opacity: this._styles('opacityLogInButton') },
          ]}
        >
          {this.state.isLoggingIn ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Log in</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          disabled={this.state.isLoggingIn}
          style={[styles.altContainer, { opacity: this._styles('opacity') }]}
          onPress={_ => this.props.navigation.navigate('Signup')}
        >
          <Text style={styles.altText}>Create an account</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const colors = {
  theme: '#304047',
};

const styles = StyleSheet.create({
  alert: {
    color: '#ff531a',
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    backgroundColor: colors.theme,
    paddingVertical: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    backgroundColor: 'rgba(225,225,225,0.55)',
    marginBottom: 10,
    padding: 10,
  },
  altContainer: {
    marginTop: 10,
    paddingVertical: 15,
    borderColor: colors.theme,
    borderWidth: 1,
  },
  altText: {
    color: colors.theme,
    textAlign: 'center',
    fontWeight: '700',
  },
});
