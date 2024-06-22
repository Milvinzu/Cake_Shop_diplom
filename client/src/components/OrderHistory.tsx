import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrdersByUserId,
  selectOrders,
  selectOrdersLoading,
  selectOrdersError,
} from "../redux/slices/orderSlice";
import { selectUser } from "../redux/slices/User/userSelectors";
import { useTranslation } from "react-i18next";
import { AppDispatch } from "../redux/store";
import Loader from "./Loader";
import "../scss/components/_orderHistory.scss";

interface OrderCake {
  _id: string;
  shablonCakeId: string;
  img: string;
  tasteId: string;
  number: number;
  weight: string;
  price: number;
  words: string;
}

interface Bakery {
  _id: string;
  img: string;
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

const OrderHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t, i18n } = useTranslation();
  const user = useSelector(selectUser);
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const statusTranslation = {
    created: "створено",
    paid: "оплачено",
    processing: "обробляється",
    cooking: "готується",
    done: "готово",
    "on the way": "у дорозі",
    delivered: "доставлено",
  };

  const currentLang = i18n.language;
  const parseLocalizedString = (str: string | undefined, lang: string) => {
    if (typeof str !== "string") {
      return "";
    }
    if (str.includes("%eng%")) {
      const parts = str.split("%eng%");
      return lang === "en" && parts[1] ? parts[1] : parts[0];
    } else {
      return str;
    }
  };

  const parseLocalizedStringWeight = (
    str: string | undefined,
    lang: string
  ) => {
    if (typeof str !== "string") {
      return "";
    }

    // Define language-specific replacements
    const replacements: { [key: string]: string } = {
      кг: lang === "en" ? "kg" : "кг",
      порцій: lang === "en" ? "servings" : "порцій",
    };

    // Replace matching strings in the input
    let parsedStr = str;
    Object.keys(replacements).forEach((key) => {
      const regex = new RegExp(key, "gi"); // "gi" for case-insensitive and global
      parsedStr = parsedStr.replace(regex, replacements[key]);
    });

    return parsedStr;
  };
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchOrdersByUserId(user._id));
    }
  }, [dispatch, user]);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (loading)
    return (
      <div className="loading">
        <Loader />
      </div>
    );
  if (error) return <p>{t("Error loading orders")}</p>;

  return (
    <div className="order-history">
      <h2>{t("Order history")}</h2>
      {orders.length === 0 ? (
        <p>{t("No orders found")}</p>
      ) : (
        orders.map((order) => {
          const bakeryCount: { [key: string]: number } = {};
          order.bakeryIds.forEach((item) => {
            bakeryCount[item._id] = (bakeryCount[item._id] || 0) + 1;
          });

          return (
            <div
              key={order._id}
              className="order"
              onClick={() => toggleOrderDetails(order._id)}
            >
              <div className="order-summaryy">
                <h3>Номер замовлення: {order._id}</h3>
                <p>Статус замовлення: {statusTranslation[order.status]}</p>
                <p>{order.totalPrice} грн</p>
              </div>
              {expandedOrderId === order._id && (
                <div className="order-details">
                  <h4>Солодощі:</h4>
                  {order.orderCakesIds.map((item) => (
                    <div key={item._id} className="order-item">
                      <img src={item.img} alt="" />
                      <div className="order-item-info-cake">
                        <p>
                          Торт: {parseLocalizedString(item.name, currentLang)}
                        </p>
                        <p>
                          Смак:{" "}
                          {parseLocalizedString(item.tasteName, currentLang)}
                        </p>
                        <p>Кількість: {item.number}</p>
                        <p>
                          Вага:{" "}
                          {parseLocalizedStringWeight(item.weight, currentLang)}
                        </p>
                        <p>Ціна: {item.price} грн</p>
                        <p>Напис шоколадом: {item.words}</p>
                      </div>
                    </div>
                  ))}
                  {Object.entries(bakeryCount).map(([id, count]) => {
                    const item = order.bakeryIds.find(
                      (bakery) => bakery._id === id
                    );
                    if (!item) return null;
                    return (
                      <div key={id} className="order-item">
                        <img src={item.img} alt="" />
                        <div className="order-item-info">
                          <p>{item.name}</p>
                          <p>Кількість: {count}</p>
                          <p>Вага: {item.weight}</p>
                          <p>Ціна: {item.price} грн</p>
                        </div>
                      </div>
                    );
                  })}
                  <p>Опис замовлення: {order.description}</p>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default OrderHistory;
