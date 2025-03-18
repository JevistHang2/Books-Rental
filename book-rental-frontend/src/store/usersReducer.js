import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    "user": {
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
    },
    "token": null
};

const usersReducer = createSlice({
    name: "Users",
    initialState: initialState,
    reducers: {
        login(state, action) {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        logout(state) {
            state.user = initialState.user;
            state.token = initialState.token;
        },
        editUser(state, action) {
            state.user = action.payload;
        }

    }

})

export const usersActions = usersReducer.actions;

export default usersReducer.reducer;