import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    "books": {
        id: null,
        title: null,
        author: null,
        type: {
            id: null,
            name: null,
            code: null
        },
        stock: null,
        price: null,
        description: null,
        deleteDate: null
    }
};

const booksReducer = createSlice({
    name: "Books",
    initialState: initialState,
    reducers: {
        setBooks(state, action) {
            state.books = action.payload;
        }
    }
})

export const booksActions = booksReducer.actions;

export default booksReducer.reducer;