import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    "historyRental": {
        userId: null,
        rentalId: null,
        firstName: null,
        lastName: null,
        startRentalDate: null,
        bookCount: null,
        allTotalPrice : null
    }
};

const historyReducer = createSlice({
    name: "History Rental",
    initialState: initialState,
    reducers: {
        setHistoryRental(state, action) {
            state.historyRental = action.payload;
        }
    }
})

export const historyActions = historyReducer.actions;

export default historyReducer.reducer;