import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../../config";
import axios from "axios";

interface Flavor {
  _id: string;
  name: string;
  description: string;
  img: string;
}

interface FlavorsState {
  entities: Flavor[];
  loading: "idle" | "loading" | "failed";
}

const initialFlavors: Flavor[] = [];

const flavorsSlice = createSlice({
  name: "flavors",
  initialState: { entities: initialFlavors, loading: "idle" } as FlavorsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTastesByCakeId.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchTastesByCakeId.fulfilled, (state, action) => {
        state.loading = "idle";
        state.entities = action.payload;
      })
      .addCase(fetchTastesByCakeId.rejected, (state) => {
        state.loading = "failed";
      });
  },
});

export const fetchTastesByCakeId = createAsyncThunk(
  "flavors/fetchTastesByCakeId",
  async (cakeId: string) => {
    const response = await axios.get(
      `${config.API_BASE_URL}/taste/cake/${cakeId}`
    );
    console.log(response.data);
    return response.data;
  }
);

export default flavorsSlice.reducer;
