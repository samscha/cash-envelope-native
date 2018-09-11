import React from 'react';
import { Button, StyleSheet, AsyncStorage, View } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

// const LoginScreen = ({ navigation }) => (
//   <View style={styles.container}>
//     <Text style={styles.welcome}>Screen A</Text>
//     <Text style={styles.instructions}>This is great</Text>
//     <Button
//       // onPress={() => navigation.dispatch({ type: 'Login' })}
//       onPress={_ => _signInAsync}
//       title="Log in"
//     />
//   </View>
// );

class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Please Log In',
  };

  render() {
    return (
      <View style={styles.container}>
        <Button
          // onPress={() => navigation.dispatch({ type: 'Login' })}
          onPress={_ => this._signInAsync()}
          title="Log in"
        />
      </View>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };
}

LoginScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

LoginScreen.navigationOptions = {
  title: 'Log In',
};

export default LoginScreen;
