import { createSwitchNavigator } from 'react-navigation';

// import { MainStack } from '../stacks/MainStack';
// import { SettingsStack } from '../stacks/SettingsStack';

// const bottomTabNavigator = createBottomTabNavigator({
//   MainStack,
//   SettingsStack,
// });

import App from './MainNavigator';
import Auth from './AuthNavigator';
import Loading from './LoadingNavigator';

export default createSwitchNavigator(
  {
    App,
    Auth,
    Loading,
  },
  {
    initialRouteName: 'Loading',
  },
);
