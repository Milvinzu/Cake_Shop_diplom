import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import OrderSummaryItem from "./OrderSummaryItem";
import "../scss/components/_orderSummary.scss";

const OrderSummary = () => {
  const cartItems = useSelector((state: RootState) => state.Cart.items);
  const totalPrice = useSelector((state: RootState) =>
    state.Cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  );

  return (
    <>
      <div className="order_items">
        {cartItems.map((item) => (
          <OrderSummaryItem key={item.uniqueKey} product={item} />
        ))}
      </div>
      <div className="total_price"></div>
    </>
  );
};

export default OrderSummary;
