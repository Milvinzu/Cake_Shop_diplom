import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import config from "config";

interface OrderCake {
  _id: string;
  shablonCakeId: string;
  name: string;
  img: string;
  tasteId: string;
  tasteName: string;
  number: number;
  weight: string;
  price: number;
  words: string;
}

interface Bakery {
  _id: string;
  img: string;
  weight: string;
  quantity: number;
  name: string;
  price: number;
}

interface Order {
  _id: string;
  orderCakesIds: OrderCake[];
  bakeryIds: Bakery[];
  userId: string;
  status: string;
  totalPrice: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchOrdersByUserId = createAsyncThunk<Order[], string>(
  "orders/fetchOrdersByUserId",
  async (userId: string, thunkAPI) => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/order/user/${userId}`
      );
      const orders: Order[] = response.data;

      const fetchCakeDetails = orders.map(async (order) => {
        const orderCakes = await Promise.all(
          order.orderCakesIds.map(async (cake) => {
            const [cakeResponse, tasteResponse] = await Promise.all([
              axios.get(
                `${config.API_BASE_URL}/shabloncake/${cake.shablonCakeId}`
              ),
              axios.get(`${config.API_BASE_URL}/taste/${cake.tasteId}`),
            ]);
            return {
              ...cake,
              img: cakeResponse.data.img,
              name: cakeResponse.data.name,
              tasteName: tasteResponse.data.name,
            };
          })
        );
        return { ...order, orderCakesIds: orderCakes };
      });

      const fetchBakeryDetails = orders.map(async (order) => {
        const bakeryCount: Record<string, number> = {};
        order.bakeryIds.forEach((bakery) => {
          bakeryCount[bakery._id] = (bakeryCount[bakery._id] || 0) + 1;
        });

        const bakeries = await Promise.all(
          order.bakeryIds.map(async (bakery) => {
            const bakeryResponse = await axios.get(
              `${config.API_BASE_URL}/regularbakery/${bakery._id}`
            );
            return {
              ...bakery,
              img: bakeryResponse.data.img,
              name: bakeryResponse.data.name,
              weight: bakeryResponse.data.weight,
              count: bakeryCount[bakery._id],
            };
          })
        );
        return { ...order, bakeryIds: bakeries };
      });

      const ordersWithCakes = await Promise.all(fetchCakeDetails);
      const ordersWithBakeries = await Promise.all(fetchBakeryDetails);

      const combinedOrders = ordersWithCakes.map((order, index) => ({
        ...order,
        bakeryIds: ordersWithBakeries[index].bakeryIds,
      }));

      return combinedOrders;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchAllOrders = createAsyncThunk<Order[], void>(
  "orders/fetchAllOrders",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/order`);
      const orders: Order[] = response.data;

      const fetchCakeDetails = orders.map(async (order) => {
        const orderCakes = await Promise.all(
          order.orderCakesIds.map(async (cake) => {
            const [cakeResponse, tasteResponse] = await Promise.all([
              axios.get(
                `${config.API_BASE_URL}/shabloncake/${cake.shablonCakeId}`
              ),
              axios.get(`${config.API_BASE_URL}/taste/${cake.tasteId}`),
            ]);
            return {
              ...cake,
              img: cakeResponse.data.img,
              name: cakeResponse.data.name,
              tasteName: tasteResponse.data.name,
            };
          })
        );
        return { ...order, orderCakesIds: orderCakes };
      });

      const fetchBakeryDetails = orders.map(async (order) => {
        const bakeryCount: Record<string, number> = {};
        order.bakeryIds.forEach((bakery) => {
          bakeryCount[bakery._id] = (bakeryCount[bakery._id] || 0) + 1;
        });

        const bakeries = await Promise.all(
          order.bakeryIds.map(async (bakery) => {
            const bakeryResponse = await axios.get(
              `${config.API_BASE_URL}/regularbakery/${bakery._id}`
            );
            return {
              ...bakery,
              img: bakeryResponse.data.img,
              name: bakeryResponse.data.name,
              weight: bakeryResponse.data.weight,
              count: bakeryCount[bakery._id],
            };
          })
        );
        return { ...order, bakeryIds: bakeries };
      });

      const ordersWithCakes = await Promise.all(fetchCakeDetails);
      const ordersWithBakeries = await Promise.all(fetchBakeryDetails);

      const combinedOrders = ordersWithCakes.map((order, index) => ({
        ...order,
        bakeryIds: ordersWithBakeries[index].bakeryIds,
      }));

      return combinedOrders;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk<
  Order,
  { id: string; status: string }
>("orders/updateOrderStatus", async ({ id, status }, thunkAPI) => {
  try {
    const response = await axios.put(`${config.API_BASE_URL}/order/${id}`, {
      status,
    });
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrdersByUserId.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.orders = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        fetchOrdersByUserId.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.orders = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchAllOrders.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateOrderStatus.fulfilled,
        (state, action: PayloadAction<Order>) => {
          const index = state.orders.findIndex(
            (order) => order._id === action.payload._id
          );
          if (index !== -1) {
            state.orders[index] = action.payload;
          }
          state.loading = false;
        }
      )
      .addCase(
        updateOrderStatus.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default orderSlice.reducer;
export const selectOrders = (state: RootState) => state.orders.orders;
export const selectOrdersLoading = (state: RootState) => state.orders.loading;
export const selectOrdersError = (state: RootState) => state.orders.error;
