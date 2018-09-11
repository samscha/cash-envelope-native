import React from 'react';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import LoginForm from '../components/LoginForm';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
});

class LoginScreen extends React.Component {
  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.container}>
          <LoginForm navigation={this.props.navigation} />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

LoginScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

LoginScreen.navigationOptions = {
  title: 'Log In',
};

export default LoginScreen;
