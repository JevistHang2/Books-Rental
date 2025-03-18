import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    "rental": {
        userId: null,
        rentalId: null,
        firstName: null,
        lastName: null,
        startRentalDate: null
    }
};

const rentalsReducer = createSlice({
    name: "Rentals",
    initialState: initialState,
    reducers: {
        setRentals(state, action) {
            state.rental = action.payload;
        }
    }
})

export const rentalsActions = rentalsReducer.actions;

export default rentalsReducer.reducer;