import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    "pagination": {
        first: null,
        last: null,
        totalPages: null,
        empty: null,
        number: 0,
        size: 9
    },
    "keywordValue" : ""
};

const paginationReducer = createSlice({
    name: "Pagination",
    initialState: initialState,
    reducers: {
        setPagination(state, action) {
            state.pagination.first = action.payload.first;
            state.pagination.last = action.payload.last;
            state.pagination.totalPages = action.payload.totalPages;
            state.pagination.empty = action.payload.empty;
            state.pagination.number = action.payload.number;
            state.pagination.size = action.payload.size;
        },

        setPaginationPageNumber(state, action) {
            state.pagination.number = action.payload
        },

        cleanPagination(state) {
            state.pagination = initialState.pagination
            state.isSearch = initialState.isSearch
            state.keywordValue = initialState.keywordValue
        },

        setSearch(state, action) {
            state.isSearch = action.payload
        },

        setKeywordValue(state, action) {
            state.keywordValue = action.payload
        }
    }
})

export const paginationActions = paginationReducer.actions;

export default paginationReducer.reducer;