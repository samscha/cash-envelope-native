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
  state = { username: '', password: '', isLoggingIn: false };

  componentDidMount() {
    this.emailInput.focus();
  }

  _logInAsync = async _ => {
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
      const title = 'Error';

      const msg = error.response
        ? error.response.data.message
        : error.request._response;

      this._renderAlert(title, msg, _ => {
        this.setState({ isLoggingIn: false });

        if (msg.includes('username')) return this.emailInput.focus();

        if (msg.includes('password')) return this.passwordInput.focus();
      });
    }
  };

  _renderAlert = (title, msg, cb) => {
    Alert.alert(title, msg, [
      {
        text: 'OK',
        onPress: _ => cb(),
      },
    ]);
  };

  /**
   * `state`ful styles
   */
  _styles = key => {
    const styles = { opacity: this.state.isLoggingIn ? 0.2 : 1.0 };

    return styles[key];
  };

  _validateInput = (username, password) => {
    if (!username && !password) {
      return Alert.alert('', 'Please provide an email and password', [
        {
          text: 'OK',
          onPress: _ => this.emailInput.focus(),
        },
      ]);
    }

    if (username === '' || password === '') {
      if (!username) {
        return Alert.alert('', 'Please provide an email', [
          {
            text: 'OK',
            onPress: _ => this.emailInput.focus(),
          },
        ]);
      }

      return Alert.alert('', 'Please provide a password', [
        {
          text: 'OK',
          onPress: _ => this.passwordInput.focus(),
        },
      ]);
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
          onChangeText={text => this.setState({ username: text })}
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
          onChangeText={text => this.setState({ password: text })}
          onSubmitEditing={_ => this._logInAsync()}
          underlineColorAndroid="transparent"
          secureTextEntry
        />

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
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    backgroundColor: 'rgba(225,225,225,0.55)',
    marginBottom: 10,
    padding: 10,
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
