import { configureStore, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';
import authReducer from './features/auth/authSlice';
import walletReducer from './features/wallet/walletSlice';

const authPersistedReducer = persistReducer({
  key: 'auth',
  version: 1,
  storage
}, authReducer);

const walletPersistedReducer = persistReducer({
  key: 'wallet',
  version: 1,
  storage
}, walletReducer)

const store = configureStore({
  reducer: combineReducers({
    auth: authPersistedReducer,
    wallet: walletPersistedReducer
  }),
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  }).concat(logger)
});


export default store;
