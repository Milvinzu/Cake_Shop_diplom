import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../store";
import config from "../../../config";
import { Product } from "./types";

export const createOrder = createAsyncThunk(
  "cart/createOrder",
  async (
    { description, totalPrice }: { description: string; totalPrice: number },
    { getState }
  ) => {
    try {
      const state: RootState = getState() as RootState;
      const items = state.Cart.items;
      const userId = state.user._id;

      const orderCakes = items.filter((item) => item.category === "Cake");
      const bakeryItems = items.filter((item) => item.category !== "Cake");

      const orderCakeIds = await Promise.all(
        orderCakes.map(async (cake) => {
          try {
            const response = await axios.post(
              `${config.API_BASE_URL}/order-cakes`,
              {
                shablonCakeId: cake._id,
                tasteId: cake.flavorId,
                number: cake.quantity,
                weight: cake.weight,
                price: cake.price,
                words: cake.chocolateWords,
              }
            );
            return response.data._id;
          } catch (error) {
            console.error("Failed to create cake order:", {
              message: error.message,
              config: error.config,
              response: error.response ? error.response.data : null,
            });
            throw new Error(
              `Failed to create cake order for cake ID: ${cake._id}`
            );
          }
        })
      );

      const bakeryIds = bakeryItems.flatMap((item) =>
        Array(item.quantity).fill(item._id)
      );

      const mainOrderPayload = {
        orderCakesIds: orderCakeIds,
        bakeryIds: bakeryIds,
        userId: userId,
        totalPrice: totalPrice,
        description: description,
      };

      const response = await axios.post(
        `${config.API_BASE_URL}/order`,
        mainOrderPayload
      );

      return response.data;
    } catch (error) {
      console.error("Failed to create order:", {
        message: error.message,
        stack: error.stack,
        config: error.config,
        response: error.response ? error.response.data : null,
      });
      throw new Error("Failed to create order: " + error.message);
    }
  }
);
