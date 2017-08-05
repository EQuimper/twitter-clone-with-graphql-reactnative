import { combineReducers } from 'redux';

import nav from './navigation';

export default client => combineReducers({
  apollo: client.reducer(),
  nav
});
