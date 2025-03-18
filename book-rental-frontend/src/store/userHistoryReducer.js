import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    "userHistory": {
        usersId: null,
        booksId: null,
        bookTypesId: null,
        rentalsId: null,
        rentalDetailsId: null,
        bookTitles: null,
        bookTypesName: null,
        startRentalDate: null,
        endRentalDate: null,
        rentalPrice: null,
        finePrice: null,
        totalPrice: null,
        statusRental: null,
        usersFirstName: null,
        usersLastName: null
    }
};

const userHistoryReducer = createSlice({
    name: "User History",
    initialState: initialState,
    reducers: {
        setUserHistory(state, action) {
            state.userHistory = action.payload;
        }
    }
})

export const userHistoryActions = userHistoryReducer.actions;

export default userHistoryReducer.reducer;