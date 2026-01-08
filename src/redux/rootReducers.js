
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './reducers/auth.reducer';
import sportReducer from './reducers/sport_reducer';
import userReducer from './reducers/user_reducer';
import casinoReducer from './reducers/casino.reducer'

const rootReducer = combineReducers({
  authUser: authReducer,
  sport : sportReducer,
  user : userReducer,
  casino :casinoReducer,

});

export default rootReducer;
