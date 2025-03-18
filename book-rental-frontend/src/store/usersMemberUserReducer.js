import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    "userMemberAndUser": {
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

const usersMemberUserReducer = createSlice({
    name: "Users Member & User",
    initialState: initialState,
    reducers: {
        setUserMemberUser(state, action) {
            state.userMemberAndUser = action.payload
        }
    }

})

export const usersMemberUserActions = usersMemberUserReducer.actions;

export default usersMemberUserReducer.reducer;