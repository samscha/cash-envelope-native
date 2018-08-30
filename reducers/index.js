import { combineReducers } from 'redux';

import notesReducer from './notes';
import navReducer from './nav';

const rootReducer = combineReducers({
  // notes: notesReducer,
  nav: navReducer,
});

export default rootReducer;
