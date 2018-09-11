import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import SettingsScreen from '../screens/SettingsScreen';
import TabBarIcon from '../components/TabBarIcon';

export const SettingsStack = createStackNavigator({
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
