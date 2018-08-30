import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

import LoginScreen from '../components/LoginScreen';
import MainScreen from '../components/MainScreen';
import ProfileScreen from '../components/ProfileScreen';

import { bottomTabNavigator as MainTabNavigator } from './MainTabNavigator';

const middleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav,
);

const RootNavigator = createStackNavigator({
  Login: { screen: LoginScreen },
  Main: { screen: MainScreen },
  Profile: { screen: ProfileScreen },
});

const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root');

const mapStateToProps = state => ({
  state: state.nav,
});

const AppNavigator = connect(mapStateToProps)(AppWithNavigationState);

const SwitchNav = createSwitchNavigator({
  Main: MainTabNavigator,
});

// export { RootNavigator, AppNavigator, middleware, SwitchNav };
export { SwitchNav };

// import React from 'react';
// import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
// import {
//   reduxifyNavigator,
//   createReactNavigationReduxMiddleware,
// } from 'react-navigation-redux-helpers';
// import { connect } from 'react-redux';

// import MainTabNavigator from './MainTabNavigator';
// import NotesNavigator from './NotesNavigator';

// const middleware = createReactNavigationReduxMiddleware(
//   'root',
//   state => state.nav,
// );

// const RootNavigator = createStackNavigator({
//   Main: MainTabNavigator,
//   // Notes: NotesNavigator,
// });

// const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root');

// const mapStateToProps = state => ({
//   state: state.nav,
// });

// const AppNavigator = connect(mapStateToProps)(AppWithNavigationState);
// // const AppNavigator = createStackNavigator(NotesNavigator);

// // import React from 'react';
// // import PropTypes from 'prop-types';
// // import { connect } from 'react-redux';
// // import { createStackNavigator } from 'react-navigation';
// // import {
// //   reduxifyNavigator,
// //   createReactNavigationReduxMiddleware,
// // } from 'react-navigation-redux-helpers';

// // import LoginScreen from '../components/LoginScreen';
// // import MainScreen from '../components/MainScreen';
// // import ProfileScreen from '../components/ProfileScreen';

// // const middleware = createReactNavigationReduxMiddleware(
// //   'root',
// //   state => state.nav,
// // );

// // const RootNavigator = createStackNavigator({
// //   Login: { screen: LoginScreen },
// //   Main: { screen: MainScreen },
// //   Profile: { screen: ProfileScreen },
// // });

// // const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root');

// // const mapStateToProps = state => ({
// //   state: state.nav,
// // });

// // const AppNavigator = connect(mapStateToProps)(AppWithNavigationState);

// export { RootNavigator, AppNavigator, middleware };

// // export default createSwitchNavigator({
// //   // You could add another route here for authentication.
// //   // Read more at https://reactnavigation.org/docs/en/auth-flow.html
// //   Main: MainTabNavigator,
// //   Notes: NotesNavigator,
// // });
