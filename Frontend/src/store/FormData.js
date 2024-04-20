import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './FormSlice'; 
export const store = configureStore({
    reducer: {
        counter: counterReducer, 
    },
});
