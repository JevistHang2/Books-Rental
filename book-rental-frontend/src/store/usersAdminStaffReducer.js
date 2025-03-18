import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    "userAdminAndStaff": {
        id: null,
        userName: null,
        firstName: null,
        lastName: null,
        address: null,
        phoneNumber: null,
        email: null,
        role: null,
        registrationDate: null,
        deleteDate: null
    }
};

const usersAdminStaffReducer = createSlice({
    name: "Users Admin & Staff",
    initialState: initialState,
    reducers: {
        setUserAdminStaff(state, action) {
            state.userAdminAndStaff = action.payload
        }
    }

})

export const usersAdminStaffActions = usersAdminStaffReducer.actions;

export default usersAdminStaffReducer.reducer;