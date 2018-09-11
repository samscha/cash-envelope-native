import { createStackNavigator } from 'react-navigation';

import LoginScreen from '../screens/LoginScreen';

export const AuthStack = createStackNavigator({
  LogIn: LoginScreen,
});
