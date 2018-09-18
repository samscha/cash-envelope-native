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
    confirmPassword: '',
    isSigningUp: false,
    errors: {},
    hasErrors: true,
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

  renderConfirmPasswordAlert = _ =>
    this.state.errors.confirmPassword ? (
      <Text style={styles.alert} selectable={false}>
        {this.state.errors.confirmPassword}
      </Text>
    ) : null;

  renderAlert = _ =>
    this.state.errors.signup ? (
      <Text style={styles.alert} selectable={false}>
        {this.state.errors.signup}
      </Text>
    ) : null;

  /* *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
  /* *~*~*~*~*~*~*~*~*~* START TextInput CHECK FUNCTIONS *~*~*~*~*~*~*~*~*~*~ */
  /* *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */

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

    /**
     * if there is a confirm password, check if password entries match
     *
     * this might happen if the user tries to change `password` instead of
     * `confirmPassword`
     */
    if (this.state.confirmPassword !== '') {
      const password = state.password || this.state.password;
      const confirmPassword = this.state.confirmPassword;

      if (password !== confirmPassword)
        state.errors.confirmPassword = 'Passwords do not match';
    }

    const chars = _state ? state.password.length : this.state.password.length;

    if (!state.errors.confirmPassword && (chars < 8 || chars > 64) && chars > 0)
      state.errors.password = `Password must be between 8 and 64 characters: ${
        chars < 8 ? 8 - chars : chars - 64
      } ${chars < 8 ? 'remaining' : 'too many'}`;

    this.setState({ ...state });
  };

  _checkConfirmPassword = _state => {
    const state = _state || {};
    state.errors = {};

    const password = this.state.password;
    const confirmPassword = _state
      ? state.confirmPassword
      : this.state.confirmPassword;

    if (password !== confirmPassword)
      state.errors.confirmPassword = 'Passwords do not match';

    /**
     * if passwords match (there is no confirmPassword error,
     * then check that `this.state.password` is valid
     *
     * this is done to prevent users from typing a non-valid password into
     * `confirmPassword` then matching it to `password`
     *
     */
    if (!state.errors.confirmPassword && this.state.password !== '') {
      const chars = this.state.password.length;

      if (chars < 8 || chars > 64)
        state.errors.password = `Password must be between 8 and 64 characters: ${
          chars < 8 ? 8 - chars : chars - 64
        } ${chars < 8 ? 'remaining' : 'too many'}`;
    }

    this.setState({ ...state });
  };

  /* *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
  /* *~*~*~*~*~*~*~*~*~*~ END TextInput CHECK FUNCTIONS ~*~*~*~*~*~*~*~*~*~*~ */
  /* *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */

  /**
   * state:
   * {
   *   username | password | confirmPassword: 'my_info_here'
   * }
   *
   * should match `this.state` TextInput fields
   *
   */
  _handleTextChange = state => {
    switch (Object.keys(state)[0]) {
      case 'username':
        return this._checkUsername(state);

      case 'password':
        return this._checkPassword(state);

      case 'confirmPassword':
        return this._checkConfirmPassword(state);

      default:
        return this.setState({ errors: { signup: `Error updating fields` } });
    }
  };

  _hasErrors = _ =>
    Object.keys(this.state.errors).length !== 0 ||
    this.state.username === '' ||
    this.state.password === '' ||
    this.state.confirmPassword === '';

  /**
   * if creating user is successful, log in to server to get token
   */
  _signUpAsync = async _ => {
    const username = this.state.username;
    const password = this.state.password;

    try {
      this.setState({ isSigningUp: true });

      await axios.post('/users', {
        username,
        password,
      });

      const loginResponse = await axios.post('/login', {
        username,
        password,
      });

      await AsyncStorage.setItem(
        'com.cashenvelope',
        JSON.stringify(loginResponse.headers),
      );

      this.props.navigation.navigate('App');
    } catch (error) {
      const msg = axiosErrorMessage(error);

      this.setState({
        errors: { signup: msg },
        isSigningUp: false,
      });

      if (msg.includes('password')) return this.passwordInput.focus();

      /**
       * the fallback focus
       */
      this.emailInput.focus();
    }
  };

  /**
   * `state`ful styles
   */
  _styles = key => {
    const styles = {
      opacity: this.state.isSigningUp ? 0.2 : 1.0,
      opacitySignUpButton:
        this.state.isSigningUp || this._hasErrors() ? 0.2 : 1.0,
    };

    return styles[key];
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          editable={!this.state.isSigningUp}
          keyboardType="email-address"
          onBlur={_ => this._checkUsername()}
          onChangeText={text => this._handleTextChange({ username: text })}
          onSubmitEditing={_ => this.passwordInput.focus()}
          placeholder="Email"
          ref={input => (this.emailInput = input)}
          returnKeyType="next"
          style={[styles.input, { opacity: this._styles('opacity') }]}
          underlineColorAndroid="transparent"
        />
        {this.renderUsernameAlert()}

        <TextInput
          editable={!this.state.isSigningUp}
          onBlur={_ => this._checkPassword()}
          onChangeText={text => this._handleTextChange({ password: text })}
          onFocus={_ => this._checkPassword()}
          onSubmitEditing={_ => this.confirmPassword.focus()}
          placeholder="Password"
          ref={input => (this.passwordInput = input)}
          returnKeyType="next"
          secureTextEntry
          style={[styles.input, { opacity: this._styles('opacity') }]}
          underlineColorAndroid="transparent"
        />
        {this.renderPasswordAlert()}

        <TextInput
          editable={!this.state.isSigningUp}
          onBlur={_ => this._checkConfirmPassword()}
          onChangeText={text =>
            this._handleTextChange({ confirmPassword: text })
          }
          onFocus={_ => this._checkPassword()}
          onSubmitEditing={_ =>
            this._hasErrors() ? null : this._signUpAsync()
          }
          placeholder="Confirm Password"
          ref={input => (this.confirmPassword = input)}
          returnKeyType="go"
          secureTextEntry
          style={[styles.input, { opacity: this._styles('opacity') }]}
          underlineColorAndroid="transparent"
        />
        {this.renderConfirmPasswordAlert()}

        {this.renderAlert()}

        <TouchableOpacity
          disabled={this.state.isSigningUp || this._hasErrors()}
          onPress={_ => this._signUpAsync()}
          style={[
            styles.buttonContainer,
            { opacity: this._styles('opacitySignUpButton') },
          ]}
        >
          {this.state.isSigningUp ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          disabled={this.state.isSigningUp}
          style={[styles.altContainer, { opacity: this._styles('opacity') }]}
          onPress={_ => this.props.navigation.navigate('Auth')}
        >
          <Text style={styles.altText}>Have an account?</Text>
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

/**
 * if there is no response error, this means a response was never received
 * this is likely due to connectivity issues
 *
 */
const axiosErrorMessage = error => {
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

  return msg;
};
