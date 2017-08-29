import { combineReducers } from 'redux';
import client from 'config/apolloClient';

export default combineReducers({
  apollo: client.reducer()
});
