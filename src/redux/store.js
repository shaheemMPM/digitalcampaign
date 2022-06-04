import { configureStore } from '@reduxjs/toolkit';
import testReducer from './test/testSlice';

export const store = configureStore({
	reducer: {
		test: testReducer,
	},
});
