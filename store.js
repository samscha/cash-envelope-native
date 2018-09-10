import { applyMiddleware } from 'redux';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';

import reducer from './src/reducers';

export default createStore(
  reducer,
  applyMiddleware(
    createReactNavigationReduxMiddleware('root', state => state.nav),
  ),
);
