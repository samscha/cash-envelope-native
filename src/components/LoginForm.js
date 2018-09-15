import React from 'react';
import {
  Alert,
  AsyncStorage,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import axios from '../axios';

export default class LoginForm extends React.Component {
  state = { username: '', password: '', isLoggingIn: false, error: '' };

  componentDidMount() {
    this.emailInput.focus();
  }

  renderAlert = _ =>
    this.state.error === '' ? null : (
      <Text style={styles.alert} selectable={false}>
        {this.state.error}
      </Text>
    );

  _handleTextChange = state => {
    this.setState({ ...state, error: '' });
  };

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
        error: msg,
        isLoggingIn: false,
      });

      if (msg.includes('password')) return this.passwordInput.focus();

      /**
       * the fallback focus
       */
      this.emailInput.focus();
    }
  };

  _resetErrors = _ => this.setState({ errors: '' });

  /**
   * `state`ful styles
   */
  _styles = key => {
    const styles = { opacity: this.state.isLoggingIn ? 0.2 : 1.0 };

    return styles[key];
  };

  _validateInput = (username, password) => {
    if (!username && !password) {
      this.setState({ error: 'Please provide an email and password' });
      this.emailInput.focus();
      return;
    }

    if (username === '' || password === '') {
      if (!username) {
        this.setState({ error: 'Please provide an email' });
        this.emailInput.focus();
        return;
      }

      this.setState({ error: 'Please provide a password' });
      this.passwordInput.focus();
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
          onChangeText={text => this._handleTextChange({ username: text })}
          onSubmitEditing={_ => this.passwordInput.focus()}
          placeholder="Email"
          ref={input => (this.emailInput = input)}
          returnKeyType="next"
          style={[styles.input, { opacity: this._styles('opacity') }]}
          underlineColorAndroid="transparent"
        />

        <TextInput
          editable={!this.state.isLoggingIn}
          style={[styles.input, { opacity: this._styles('opacity') }]}
          returnKeyType="go"
          ref={input => (this.passwordInput = input)}
          placeholder="Password"
          onChangeText={text => this._handleTextChange({ password: text })}
          onSubmitEditing={_ => this._logInAsync()}
          underlineColorAndroid="transparent"
          secureTextEntry
        />

        {this.renderAlert()}

        <TouchableOpacity
          disabled={this.state.isLoggingIn}
          onPress={_ => this._logInAsync()}
          style={[styles.buttonContainer, { opacity: this._styles('opacity') }]}
        >
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!this.state.isLoggingIn}
          style={[styles.signUpContainer, { opacity: this._styles('opacity') }]}
          onPress={_ => this.props.navigation.navigate('Signup')}
        >
          <Text style={styles.signUpText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  alert: {
    color: '#ff531a',
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    backgroundColor: '#2980b6',
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
  signUpContainer: {
    marginTop: 10,
    paddingVertical: 15,
    borderColor: '#2980b6',
    borderWidth: 1,
  },
  signUpText: {
    color: '#2980b6',
    textAlign: 'center',
    fontWeight: '700',
  },
});
