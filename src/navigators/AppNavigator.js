import { createSwitchNavigator } from 'react-navigation';

import App from './MainNavigator';
import Auth from './AuthNavigator';
import Loading from './LoadingNavigator';
import Signup from './SignupNavigator';

export default createSwitchNavigator(
  {
    App,
    Auth,
    Loading,
    Signup,
  },
  {
    initialRouteName: 'Loading',
  },
);
