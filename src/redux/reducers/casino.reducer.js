import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { casinoServices } from "../services/casino.services";
import { message } from "antd";

const initialState = {

};

export const casinoBetPlaceFunc = createAsyncThunk(
  "casino/casinoBetPlaceFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await casinoServices.casinoBetPlaceFunc(userData);
      message.success(user?.message, 2);
      return user;
    } catch (error) {
      message.error(error?.data?.message, 2);
      return rejectWithValue(error.message);
    }
  }
);


export const intCasinoCateogeoryWiseList = createAsyncThunk(
  "website/getCateogeory",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await casinoServices.intCasinoCateogeoryWiseList(userData);
      // message.success(user?.message, 2);
      return response;
    } catch (error) {
      // message.error(error?.data?.message, 2);
      return rejectWithValue(error.message);
    }
  }
);

export const intGrupCsnoList = createAsyncThunk(
  "website/getInternationalGroupCasinoList",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await casinoServices.intGrupCsnoList(userData);
      // message.success(user?.message, 2);
      return response;
    } catch (error) {
      // message.error(error?.data?.message, 2);
      return rejectWithValue(error.message);
    }
  }
);
export const getCasinoLoginUrl = createAsyncThunk(
  "casino/getCasinoLoginUrl",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await casinoServices.getCasinoLoginUrl(payload);
      return response?.data;
    } catch (error) {
      message.error(error?.data?.message || "Something went wrong", 2);
      return rejectWithValue(error.message);
    }
  }
);





const casinoSlice = createSlice({
  name: "casino",
  initialState,
  reducers: {


  },
  extraReducers: (builder) => {
    builder
      .addCase(casinoBetPlaceFunc.pending, (state) => {
        state.casinoLoading = true;
      })
      .addCase(casinoBetPlaceFunc.fulfilled, (state, action) => {
        state.casinoLoading = false;
        state.loggedIn = true;
        state.user = action.payload;
      })
      .addCase(casinoBetPlaceFunc.rejected, (state, action) => {
        state.casinoLoading = false;
        state.error = action.payload;
      })


      .addCase(intCasinoCateogeoryWiseList.pending, (state) => {
        state.casinoLoading = true;
      })
      .addCase(intCasinoCateogeoryWiseList.fulfilled, (state, action) => {
        state.casinoLoading = false;
        state.loggedIn = true;
        state.intCasinoCateogeoryWiseListData = action.payload;
      })
      .addCase(intCasinoCateogeoryWiseList.rejected, (state, action) => {
        state.casinoLoading = false;
        state.error = action.payload;
      })



      .addCase(intGrupCsnoList.pending, (state) => {
        state.casinoLoading = true;
      })
      .addCase(intGrupCsnoList.fulfilled, (state, action) => {
        state.casinoLoading = false;
        state.loggedIn = true;
        state.intGrupCsnoListData = action.payload?.data;
      })
      .addCase(intGrupCsnoList.rejected, (state, action) => {
        state.casinoLoading = false;
        state.error = action.payload;
      })

      .addCase(getCasinoLoginUrl.pending, (state) => {
        state.casinoLoading = true;
      })
      .addCase(getCasinoLoginUrl.fulfilled, (state, action) => {
        state.casinoLoading = false;
        state.casinoLoginData = action.payload;
      })
      .addCase(getCasinoLoginUrl.rejected, (state, action) => {
        state.casinoLoading = false;
        state.error = action.payload;
      })


  },
});

export const { logout } = casinoSlice.actions;

export default casinoSlice.reducer;
