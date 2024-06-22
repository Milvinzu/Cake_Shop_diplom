import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import config from "config";
import { RootState } from "../store";

interface SpecialCake {
  _id: string;
  description: string;
  price?: number;
  userId: string;
  status: string;
}

interface SpecialCakeState {
  cakes: SpecialCake[];
  loading: boolean;
  error: string | null;
}

const initialState: SpecialCakeState = {
  cakes: [],
  loading: false,
  error: null,
};

export const createSpecialCake = createAsyncThunk(
  "specialCake/createSpecialCake",
  async (
    cakeData: { description: string; price?: number; userId: string },
    thunkAPI
  ) => {
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/specialcake`,
        cakeData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateSpecialCake = createAsyncThunk(
  "specialCake/updateSpecialCake",
  async (
    updateData: {
      id: string;
      description?: string;
      price?: number;
      status?: string;
    },
    thunkAPI
  ) => {
    try {
      const response = await axios.put(
        `${config.API_BASE_URL}/specialcake/${updateData.id}`,
        updateData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchSpecialCakesByUserId = createAsyncThunk(
  "specialCake/fetchSpecialCakesByUserId",
  async (userId: string, thunkAPI) => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/specialcakes/user/${userId}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllSpecialCakes = createAsyncThunk(
  "specialCake/fetchAllSpecialCakes",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/specialcake`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateCakeStatusToPaid = createAsyncThunk(
  "specialCakes/updateCakeStatusToPaid",
  async (id: string) => {
    const response = await axios.put(
      `${config.API_BASE_URL}/specialcake/${id}/status`,
      {
        status: "paid",
      }
    );
    return response.data;
  }
);

const specialCakeSlice = createSlice({
  name: "specialCake",
  initialState,
  reducers: {
    updateCakeStatus: (
      state,
      action: PayloadAction<{ id: string; status: string }>
    ) => {
      const index = state.cakes.findIndex(
        (cake) => cake._id === action.payload.id
      );
      if (index !== -1) {
        state.cakes[index].status = action.payload.status;
      }
    },
    updateCakeDescription: (
      state,
      action: PayloadAction<{ id: string; description: string }>
    ) => {
      const index = state.cakes.findIndex(
        (cake) => cake._id === action.payload.id
      );
      if (index !== -1) {
        state.cakes[index].description = action.payload.description;
      }
    },
    updateCakePrice: (
      state,
      action: PayloadAction<{ id: string; price: number }>
    ) => {
      const index = state.cakes.findIndex(
        (cake) => cake._id === action.payload.id
      );
      if (index !== -1) {
        state.cakes[index].price = action.payload.price;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSpecialCake.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createSpecialCake.fulfilled,
        (state, action: PayloadAction<SpecialCake>) => {
          state.loading = false;
          state.cakes.push(action.payload);
        }
      )
      .addCase(createSpecialCake.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSpecialCake.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateSpecialCake.fulfilled,
        (state, action: PayloadAction<SpecialCake>) => {
          state.loading = false;
          const index = state.cakes.findIndex(
            (cake) => cake._id === action.payload._id
          );
          if (index !== -1) {
            state.cakes[index] = action.payload;
          }
        }
      )
      .addCase(updateSpecialCake.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSpecialCakesByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSpecialCakesByUserId.fulfilled,
        (state, action: PayloadAction<SpecialCake[]>) => {
          state.loading = false;
          state.cakes = action.payload;
        }
      )
      .addCase(fetchSpecialCakesByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllSpecialCakes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllSpecialCakes.fulfilled,
        (state, action: PayloadAction<SpecialCake[]>) => {
          state.loading = false;
          state.cakes = action.payload;
        }
      )
      .addCase(fetchAllSpecialCakes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateCakeStatus, updateCakeDescription, updateCakePrice } =
  specialCakeSlice.actions;

export const selectSpecialCakes = (state: RootState) => state.specialCake.cakes;
export const selectSpecialCakesLoading = (state: RootState) =>
  state.specialCake.loading;
export const selectSpecialCakesError = (state: RootState) =>
  state.specialCake.error;

export default specialCakeSlice.reducer;
