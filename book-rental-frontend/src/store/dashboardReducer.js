import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    "dashboardData": {
        countRentalBookThisMonth: null,
        countReturnBookThisMonth: null,
        sumIncomeThisMonth: null,
        countBookOnRentalThisMonth: null
    }
};

const dashboardReducer = createSlice({
    name: "Dashboard",
    initialState: initialState,
    reducers: {
        setDashboard(state, action) {
            state.dashboardData = action.payload;
        },

        cleanDashboard(state) {
            state.dashboardData = initialState.dashboardData;
        }
    }
})

export const dashboardActions = dashboardReducer.actions;

export default dashboardReducer.reducer;