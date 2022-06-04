import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const testSlice = createSlice({
	name: 'test',
	initialState,
	reducers: {},
	extraReducers: {},
});

export const {} = testSlice.actions;
// export const getSomeState = (state) => state.sliceName.stateName;
export default testSlice.reducer;
