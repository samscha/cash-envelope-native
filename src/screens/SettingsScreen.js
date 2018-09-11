import React from 'react';
// import { ExpoConfigView } from '@expo/samples';
import {
  AsyncStorage,
  View,
  Button,
  StatusBar,
  StyleSheet,
} from 'react-native';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    // return <ExpoConfigView />;
    return (
      <View style={styles.container}>
        <Button title="Log out" onPress={this._signOutAsync} />
        <StatusBar barStyle="default" />
      </View>
    );
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
