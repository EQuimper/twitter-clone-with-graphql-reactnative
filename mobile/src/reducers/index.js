import { combineReducers } from 'redux';

import nav from './navigation';
import user from './user';

export default client => combineReducers({
  apollo: client.reducer(),
  nav,
  user
});
