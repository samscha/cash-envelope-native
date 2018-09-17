import React from 'react';
import {
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
    error: '',
    usernameError: '',
    passwordError: '',
    confirmPasswordError: '',
    hasErrors: true,
  };

  componentDidMount() {
    this.emailInput.focus();
  }

  renderAlert = _ =>
    this.state.error === '' ? null : (
      <Text style={styles.alert} selectable={false}>
        {this.state.error}
      </Text>
    );

  renderConfirmPasswordAlert = _ =>
    this.state.confirmPasswordError === '' ? null : (
      <Text style={styles.alert} selectable={false}>
        {this.state.confirmPasswordError}
      </Text>
    );

  renderUsernameAlert = _ =>
    this.state.usernameError === '' ? null : (
      <Text style={styles.alert} selectable={false}>
        {this.state.usernameError}
      </Text>
    );

  renderPasswordAlert = _ =>
    this.state.passwordError === '' ? null : (
      <Text style={styles.alert} selectable={false}>
        {this.state.passwordError}
      </Text>
    );

  /* *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
  /* *~*~*~*~*~*~*~*~*~* START TextInput CHECK FUNCTIONS *~*~*~*~*~*~*~*~*~*~ */
  /* *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */

  /**
   * local `state` will only exist when text is changed in `confirmPassword`
   * TextInput. This is done because `this.state` is delayed by one char
   *
   * otherwise, this function is called when `onBlur` from said TextInput and
   * checking password (in the specific case mentioned in `_checkPassword`)
   * without local `state`. This means we are just checking the `this.state`
   * values for `confirmPassword`
   *
   */
  _checkConfirmPassword = state => {
    if (this._otherErrorsExistExcept('confirmPasswordError')) return;

    const confirmPassword = state
      ? state.confirmPassword
      : this.state.confirmPassword;
    const password = this.state.password;

    if (password !== confirmPassword) {
      return this.setState({
        confirmPasswordError: `Passwords do not match`,
      });
    }

    this._resetConfirmPasswordErrors();
  };

  /**
   * it's possible for the user to type in a correctly formatted password
   * then type in a non-matching but valid `confirmPassword`
   * then change `password` to match `confirmPassword`
   * so we need to first check if `confirmPasswordError` exists, which
   * means there are no other errors and this error will take precedence
   * over checking for `password` validity
   *
   * if there are no `confirmPasswordError`s, then proceed to check `password`
   *
   */
  _checkPassword = state => {
    // if (this.state.confirmPasswordError !== '')
    //   return this._checkConfirmPassword();

    if (
      this.state.confirmPassword !== '' &&
      (state ? state.password : this.state.password) !==
        this.state.confirmPassword
    )
      return this.setState({
        confirmPasswordError: `Passwords do not match`,
      });

    if (this._otherErrorsExistExcept('passwordError')) return;

    const chars = state ? state.password.length : this.state.password.length;

    if (chars < 8 || chars > 64)
      return this.setState({
        passwordError: `Password must be between 8 and 64 characters: ${chars}`,
      });

    this._resetPasswordErrors();
  };

  _checkPasswordWithConfirmPassword = state => {
    if (state.password !== this.state.confirmPassword) return;

    this.setState({ confirmPasswordError: '' });
  };

  _checkUsername = async state => {
    if (this._otherErrorsExistExcept('usernameError')) return;

    const chars = state ? state.username.length : this.state.username.length;

    if (chars < 7 || chars > 32)
      return this.setState({
        usernameError: `Username must be between 7 and 32 characters: ${chars}`,
      });

    this._resetUsernameErrors();
    // TODO: add check to see if username exists in db already (async)
  };

  /* *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */
  /* *~*~*~*~*~*~*~*~*~*~ END TextInput CHECK FUNCTIONS ~*~*~*~*~*~*~*~*~*~*~ */
  /* *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~ */

  /**
   * check each TextInput to see there isn't an error for that type
   * check to see if local `state` is for `username`, `password` or
   * `confirmPassword`
   *
   * state:
   * {
   *   username | password | confirmPassword: 'my_info_here'
   * }
   *
   * shoudl match `this.state` TextInput fields
   *
   */
  _handleTextChange = state => {
    switch (Object.keys(state)[0]) {
      case 'username':
        if (
          (this.state.usernameError !== '' &&
            !this._otherErrorsExistExcept('usernameError')) ||
          this.state.error !== ''
        )
          this._checkUsername(state);
        break;

      case 'password':
        if (
          this.state.passwordError !== '' &&
          !this._otherErrorsExistExcept('passwordError')
        )
          this._checkPassword(state);

        if (this.state.confirmPasswordError !== '')
          this._checkPasswordWithConfirmPassword(state);
        break;

      case 'confirmPassword':
        if (
          this.state.confirmPasswordError !== '' &&
          !this._otherErrorsExistExcept('confirmPasswordError')
        )
          this._checkConfirmPassword(state);
        break;

      default:
    }

    this.setState({
      ...state,
      hasErrors:
        !this._hasValidInput() || state.confirmPassword
          ? this.state.password !== state.confirmPassword
          : false || state.password
            ? state.password !== this.state.confirmPassword
            : false,
      error: '',
    });
  };

  /**
   * checks integrity of signup form fields
   */
  _hasValidInput = _ => {
    return (
      this.state.username !== '' &&
      this.state.password !== '' &&
      this.state.confirmPassword !== '' &&
      this.state.usernameError === '' &&
      this.state.passwordError === '' &&
      this.state.confirmPasswordError === ''
    );
  };

  _otherErrorsExistExcept = errorType => {
    const usernameError = this.state.usernameError;
    const passwordError = this.state.passwordError;
    const confirmPasswordError = this.state.confirmPasswordError;

    if (usernameError && errorType !== 'usernameError') return true;
    if (passwordError && errorType !== 'passwordError') return true;
    if (confirmPasswordError && errorType !== 'confirmPasswordError')
      return true;

    return false;
  };

  _signUpAsync = async _ => {
    this._resetAllErrors();

    const username = this.state.username;
    const password = this.state.password;
    const confirmPassword = this.state.confirmPassword;

    if (!this._validateInput(username, password, confirmPassword)) return;

    try {
      this.setState({ isSigningUp: true });

      const response = await axios.post('/users', {
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
        hasErrors: true,
        error: msg,
        isSigningUp: false,
      });

      /**
       * the fallback focus
       */
      this.emailInput.focus();
    }
  };

  _resetAllErrors = _ => {
    this._resetConfirmPasswordErrors();
    this._resetErrors();
    this._resetPasswordErrors();
    this._resetUsernameErrors();
  };

  _resetConfirmPasswordErrors = _ =>
    this.setState({ confirmPasswordError: '' });

  _resetErrors = _ =>
    this.setState({
      error: '',
    });

  _resetPasswordErrors = _ =>
    this.setState({
      passwordError: '',
    });

  _resetUsernameErrors = _ =>
    this.setState({
      usernameError: '',
    });

  /**
   * `state`ful styles
   */
  _styles = key => {
    const styles = {
      opacity: this.state.isSigningUp ? 0.2 : 1.0,
      opacitySignUpButton:
        this.state.isSigningUp || this.state.hasErrors ? 0.2 : 1.0,
    };

    return styles[key];
  };

  _validateInput = (username, password, confirmPassword) => {
    if (!username && !password && !confirmPassword) {
      this.setState({
        error: 'Please provide an email, password and confirm password',
      });
      this.emailInput.focus();
      return;
    }

    if (username === '' || password === '' || confirmPassword === '') {
      if (!username) {
        this.setState({
          error: 'Please provide an email',
        });
        this.emailInput.focus();
        return;
      }

      if (!password) {
        this.setState({
          error: 'Please provide a password',
        });
        this.passwordInput.focus();
        return;
      }

      this.setState({
        error: 'Please confirm password',
      });
      this.confirmPassword.focus();
      return;
    }

    if (password !== confirmPassword) {
      this.setState({
        error: 'Passwords do not match',
      });
      this.confirmPassword.focus();
      return;
    }

    return true;
  };

  render() {
    console.log(this.state);
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
          onSubmitEditing={_ =>
            this._hasValidInput && this.password === this.confirmPassword
              ? this._signUpAsync()
              : null
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
          disabled={this.state.isSigningUp || this.state.hasErrors}
          onPress={_ => this._signUpAsync()}
          style={[
            styles.buttonContainer,
            { opacity: this._styles('opacitySignUpButton') },
          ]}
        >
          <Text style={styles.buttonText}>Sign up</Text>
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
