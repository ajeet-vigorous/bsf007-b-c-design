import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sportServices } from "../services/sport_services";

const initialState = {
  
};

export const getSportMatchList = createAsyncThunk(
  "sports/getSportMatchList",
  async (reqData, { rejectWithValue }) => {
    try {
      const sportMatchList = await sportServices.getSportmatchList(reqData);
      return sportMatchList;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const sportSlice = createSlice({
  name: "sport",
  initialState,
  reducers: {
    logout(state) {
      state.loggedIn = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSportMatchList.pending, (state) => {
        state.loading = true;
        state.sportMatchList = [];
      })
      .addCase(getSportMatchList.fulfilled, (state, action) => {
        state.loading = false;
        state.loggedIn = true;
        state.sportMatchList = action.payload?.data;
      })
      .addCase(getSportMatchList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.sportMatchList = [];
      })
      
  },
});

export const { logout } = sportSlice.actions;

export default sportSlice.reducer;
