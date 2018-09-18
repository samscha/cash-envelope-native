import React from 'react';
import {
  Alert,
  AsyncStorage,
  View,
  Button,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native';

import axios from '../axios';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  state = {
    user: {},
  };

  async componentWillMount() {
    const headers = JSON.parse(await AsyncStorage.getItem('com.cashenvelope'));

    axios.defaults.headers = headers;
    this._getUserInfo();
  }

  _getUserInfo = async _ => {
    try {
      const response = await axios.get(`/user`);

      this.setState({
        user: response.data,
      });
    } catch (error) {
      alert('Error getting user info');

      this._signOutAsync();
    }
  };

  _handleDeleteAccount = async _ => {
    try {
      await axios.delete(`/user`);

      this._signOutAsync();
    } catch (error) {
      alert('Error deleting account');
    }
  };

  _handleDeleteAccountButtonPressed = _ => {
    Alert.alert('Are you sure?', 'This CANNOT be undone', [
      {
        text: 'Confirm',
        onPress: _ => this._handleDeleteAccount(),
      },
      {
        text: 'Cancel',
        onPress: _ => _,
        style: 'cancel',
      },
    ]);
  };

  _signOutAsync = async _ => {
    await AsyncStorage.clear();

    try {
      await axios.get(`logout`);

      this.props.navigation.navigate('Auth');
    } catch (error) {
      alert('Error logging out');

      this.props.navigation.navigate('Auth');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="default" />
        <Text style={styles.title}>{this.state.user.username}</Text>

        <Button title="Log out" onPress={this._signOutAsync} />

        <Button
          title="Delete account"
          color="#ff531a"
          onPress={_ => this._handleDeleteAccountButtonPressed()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
  title: {
    fontSize: 22,
  },
});
