import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import { RootNavigator } from '../navigation/AppNavigator';

const firstAction = RootNavigator.router.getActionForPathAndParams('Main');
const tempNavState = RootNavigator.router.getStateForAction(firstAction);
const secondAction = RootNavigator.router.getActionForPathAndParams('Main');
// const secondAction = RootNavigator.router.getActionForPathAndParams('Login');
const initialState = RootNavigator.router.getStateForAction(
  secondAction,
  tempNavState,
);

const nav = (state = initialState, action) => {
  let nextState;

  switch (action.type) {
    default:
      nextState = RootNavigator.router.getStateForAction(action, state);
      break;
  }

  return nextState || state;
};

export default nav;
