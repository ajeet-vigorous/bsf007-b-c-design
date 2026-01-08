import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authServices } from "../services/auth.services";
import { toast } from "react-toastify";
import { message } from "antd";

const initialState = {

};

export const login = createAsyncThunk(
  "authentication/login",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await authServices.login(userData);
      message.success("User logged in successfully.", 2);
      return user;
    } catch (error) {
      message.error(error?.data?.message, 2);
      return rejectWithValue(error);
    }
  }
);


export const updatePassword = createAsyncThunk(
  "authentication/updatePassword",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await authServices.updatePassword(userData);
      // if(user){
      //   if(!user?.error){
      //     window.location.href = "/login";
      //   }
      // }
    
      return user;
    } catch (error) {
      message.error(error?.data?.message, 2);
      return rejectWithValue(error.message);
    }
  }
);


const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    logout(state) {
      state.loggedIn = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.login_loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.login_loading = false;
        state.loggedIn = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.login_loading = false;
        state.error = action.payload;
      })

      .addCase(updatePassword.pending, (state) => {
        state.updatePassword_loading = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.updatePassword_loading = false;
        state.user = action.payload;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.updatePassword_loading = false;
        state.error = action.payload;
      })

  },
});

export const { logout } = authenticationSlice.actions;

export default authenticationSlice.reducer;
