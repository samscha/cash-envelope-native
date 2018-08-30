import { createStore, applyMiddleware } from 'redux';
// import { persistStore, persistCombineReducers } from 'redux-persist';
// import storage from 'redux-persist/es/storage';
// import notesReducer from './reducers/notes';
import reducer from './reducers';

import { middleware } from './navigation/AppNavigator';

// const persistConfig = {
//   key: 'root',
//   storage
// }

// const reducers = {
//   notes: notesReducer,
// };

const store = createStore(reducer, applyMiddleware(middleware));

// const persistedReducers = persistCombineReducers(persistConfig, reducers);
// const store = createStore(persistedReducers);
// const persistor = persistStore(store);

export {
  // persistor,
  store,
};
