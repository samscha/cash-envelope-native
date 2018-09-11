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
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          onSubmitEditing={() => this.passwordInput.focus()}
          autoCorrect={false}
          keyboardType="email-address"
          returnKeyType="next"
          placeholder="Email"
          underlineColorAndroid="transparent"
          onChangeText={text => this.setState({ username: text })}
        />

        <TextInput
          style={styles.input}
          returnKeyType="go"
          ref={input => (this.passwordInput = input)}
          placeholder="Password"
          onChangeText={text => this.setState({ password: text })}
          underlineColorAndroid="transparent"
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={_ => this._logInAsync()}
        >
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _logInAsync = async () => {
    if (!this.state.username && !this.state.password) {
      return alert('Please provide an email and password');
    }

    if (this.state.username === '' || this.state.password === '') {
      if (!this.state.username) {
        return alert('Please provide an email');
      }

      return alert('Please provide a password');
    }

    try {
      const response = await axios.post('/login', {
        ...this.state,
      });
      await AsyncStorage.setItem(
        'com.cashenvelope',
        JSON.stringify(response.headers),
      );
      this.props.navigation.navigate('App');
    } catch (error) {
      alert(error.response.data.message);
    }
  };
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
});
