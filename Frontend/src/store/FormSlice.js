import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    fields: [],
};

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        addData: (state, action) => {
            console.log(state, action);
            state.fields = action.payload;
        },
    },
});

export const { addData } = counterSlice.actions;

export default counterSlice.reducer;
