import React from 'react';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import SignupForm from '../components/SignupForm';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
});

class SignupScreen extends React.Component {
  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.container}>
          <SignupForm navigation={this.props.navigation} />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

SignupScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

SignupScreen.navigationOptions = {
  title: 'Sign up',
};

export default SignupScreen;
