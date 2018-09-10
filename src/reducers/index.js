// import { combineReducers } from 'redux';

// import notesReducer from './notes';
// import navReducer from './nav';

// const rootReducer = combineReducers({
//   // notes: notesReducer,
//   nav: navReducer,
// });

// export default rootReducer;

import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

// import { MainStackU as RootNavigator } from '../navigators/AppNavigator';
import { stack as RootNavigator } from '../stacks/MainStack';
// import { SwitchNav as RootNavigator } from '../navigators/AppNavigator';

// const RootNavigator = SwitchNav;

// Start with two routes: The Main screen, with the Login screen on top.
const firstAction = RootNavigator.router.getActionForPathAndParams('Envelopes');
// const tempNavState = RootNavigator.router.getStateForAction(firstAction);
// const secondAction = RootNavigator.router.getActionForPathAndParams('Main');
// const secondAction = RootNavigator.router.getActionForPathAndParams('Login');
const initialNavState = RootNavigator.router.getStateForAction(
  // secondAction,
  // tempNavState,
  firstAction,
);

function nav(state = initialNavState, action) {
  let nextState;
  switch (action.type) {
    case 'Login':
      nextState = RootNavigator.router.getStateForAction(
        NavigationActions.back(),
        state,
      );
      break;
    case 'Logout':
      nextState = RootNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Login' }),
        state,
      );
      break;
    default:
      nextState = RootNavigator.router.getStateForAction(action, state);
      break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
}

const initialAuthState = { isLoggedIn: false };

function auth(state = initialAuthState, action) {
  switch (action.type) {
    case 'Login':
      return { ...state, isLoggedIn: true };
    case 'Logout':
      return { ...state, isLoggedIn: false };
    default:
      return state;
  }
}

const AppReducer = combineReducers({
  nav,
  auth,
});

export default AppReducer;
