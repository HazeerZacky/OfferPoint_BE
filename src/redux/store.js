import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers';

const persistedReducer = persistReducer({key:'root', storage}, rootReducer);

export const store = configureStore({
    reducer : persistedReducer
});

export const persistor = persistStore(store);

