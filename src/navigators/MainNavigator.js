import { createBottomTabNavigator } from 'react-navigation';

import { MainStack } from '../stacks/MainStack';
import { SettingsStack } from '../stacks/SettingsStack';

export default createBottomTabNavigator({
  MainStack,
  SettingsStack,
});
