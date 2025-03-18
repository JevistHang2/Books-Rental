import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    "bookTypes": {
        id: null,
        name: null,
        code: null
    }
};

const bookTypesReducer = createSlice({
    name: "BookTypes",
    initialState: initialState,
    reducers: {
        setBookTypes(state, action) {
            state.bookTypes = action.payload;
        }
    }
})

export const bookTypesActions = bookTypesReducer.actions;

export default bookTypesReducer.reducer;