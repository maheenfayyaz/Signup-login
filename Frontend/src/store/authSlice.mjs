import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("token") || null,
    userID: localStorage.getItem("userID") || null,
    isAuthenticated: localStorage.getItem("token") ? true : false,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.token = action.payload.token;
            state.userID = action.payload._id;
            state.isAuthenticated = true;
        },
    }
})

export const { login } = authSlice.actions
export default authSlice.reducer