import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './src/redux/rootReducers';


const store = configureStore({
  reducer: rootReducer,
});

export default store;
