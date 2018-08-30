import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';
import { connect } from 'react-redux';
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';

import LoginScreen from '../components/LoginScreen';
import MainScreen from '../components/MainScreen';
import ProfileScreen from '../components/ProfileScreen';

// import { MainStack } from './AppNavigator';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Envelopes',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-mail-open${focused ? '' : '-outline'}`
          : 'md-mail-open'
      }
    />
  ),
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Envelopes',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-mail-open${focused ? '' : '-outline'}`
          : 'md-mail-open'
      }
    />
  ),
};

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

const middleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav,
);

const MainStackU = createStackNavigator({
  Login: { screen: LoginScreen },
  Main: { screen: MainScreen },
  Profile: { screen: ProfileScreen },
});

const AppWithNavigationState = reduxifyNavigator(MainStackU, 'root');

const mapStateToProps = state => ({
  state: state.nav,
});

const MainStack = connect(mapStateToProps)(AppWithNavigationState);

MainStack.navigationOptions = {
  tabBarLabel: 'Envelopes',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-mail-open${focused ? '' : '-outline'}`
          : 'md-mail-open'
      }
    />
  ),
};

const bottomTabNavigator = createBottomTabNavigator({
  MainStack,
  HomeStack,
  LinksStack,
  SettingsStack,
});

export { bottomTabNavigator, MainStack, MainStackU, middleware };
// export default createBottomTabNavigator({
//   MainStack,
//   HomeStack,
//   LinksStack,
//   SettingsStack,
// });
