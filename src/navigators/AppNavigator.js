import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
  createSwitchNavigator,
} from 'react-navigation';
import {
  reduxifyNavigator,
  // createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
import { connect } from 'react-redux';

import TabBarIcon from '../components/TabBarIcon';
import SettingsScreen from '../screens/SettingsScreen';
// import MainScreen from '../screens/MainScreen';
import { MainStack } from '../stacks/MainStack';

// import LoginScreen from '../components/LoginScreen';
import EnvelopeScreen from '../screens/EnvelopeScreen';

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-options${focused ? '' : '-outline'}`
          : 'md-options'
      }
    />
  ),
};

// const middleware = createReactNavigationReduxMiddleware(
//   'root',
//   state => state.nav,
// );

// const MainStackU = createStackNavigator({
//   // Login: { screen: LoginScreen },
//   Main: { screen: MainScreen },
//   Detail: { screen: EnvelopeScreen },
// });

// const AppWithNavigationState = reduxifyNavigator(MainStackU, 'root');

// const mapStateToProps = state => ({
//   state: state.nav,
// });

// const MainStack = connect(mapStateToProps)(AppWithNavigationState);

// MainStack.navigationOptions = {
//   tabBarLabel: 'Envelopes',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={
//         Platform.OS === 'ios'
//           ? `ios-mail-open${focused ? '' : '-outline'}`
//           : 'md-mail-open'
//       }
//     />
//   ),
// };

const bottomTabNavigator = createBottomTabNavigator({
  MainStack,
  SettingsStack,
});

const AppNavigator = createSwitchNavigator({
  Main: bottomTabNavigator,
});

// export { AppNavigator, MainStack, MainStackU, middleware };
export { AppNavigator, MainStack };
