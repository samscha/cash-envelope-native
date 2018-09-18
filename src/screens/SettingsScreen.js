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
      //
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

  _signOutAsync = async () => {
    try {
      await axios.get(`logout`);
      await AsyncStorage.clear();
      this.props.navigation.navigate('Auth');
    } catch (error) {
      alert('Error logging out');
    }
  };
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
