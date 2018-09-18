import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
import { connect } from 'react-redux';

import EnvelopeScreen from '../screens/EnvelopeScreen';
import EnvelopesScreen from '../screens/EnvelopesScreen';
import TabBarIcon from '../components/TabBarIcon';

export const middleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav,
);

export const stack = createStackNavigator({
  Envelopes: { screen: EnvelopesScreen },
  Envelope: { screen: EnvelopeScreen },
});

export const MainStack = connect(state => ({
  state: state.nav,
}))(reduxifyNavigator(stack, 'root'), 'root');

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
