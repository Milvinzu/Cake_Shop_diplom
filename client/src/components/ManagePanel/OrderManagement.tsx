import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrders,
  selectOrders,
  selectOrdersLoading,
  selectOrdersError,
  updateOrderStatus,
} from "../../redux/slices/orderSlice";
import { useTranslation } from "react-i18next";
import { RootState, AppDispatch } from "../../redux/store";
import "../../scss/components/ManagePanel/_orderManagement.scss";

const OrderManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const statusTranslation = {
    created: "Створено",
    paid: "оплачено",
    processing: "обробляється",
    cooking: "готується",
    done: "готово",
    "on the way": "у дорозі",
    delivered: "доставлено",
  };

  const handleStatusChange = (
    orderId: string,
    newStatus: string,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    event.stopPropagation();
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
  };

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleStatusFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(event.target.value);
  };

  const handleStartDateFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartDate(new Date(event.target.value));
  };

  const handleEndDateFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEndDate(new Date(event.target.value));
  };

  const filteredOrders = orders.filter((order) => {
    let statusMatch = true;
    let dateMatch = true;

    if (statusFilter) {
      statusMatch = order.status === statusFilter;
    }

    if (startDate && endDate) {
      const orderDate = new Date(order.createdAt);
      dateMatch = orderDate >= startDate && orderDate <= endDate;
    }

    return statusMatch && dateMatch;
  });

  if (loading) return <p>{t("Loading...")}</p>;
  if (error) return <p>{t("Error loading orders")}</p>;

  return (
    <div className="order-management">
      <h2>{t("Order Management")}</h2>
      <div className="filters">
        <label>
          {t("Filter by status:")}
          <select value={statusFilter} onChange={handleStatusFilterChange}>
            <option value="">{t("All")}</option>
            {Object.keys(statusTranslation).map((status) => (
              <option key={status} value={status}>
                {statusTranslation[status]}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t("Filter by start date:")}
          <input
            type="date"
            value={startDate?.toISOString().split("T")[0] || ""}
            onChange={handleStartDateFilterChange}
          />
        </label>
        <label>
          {t("Filter by end date:")}
          <input
            type="date"
            value={endDate?.toISOString().split("T")[0] || ""}
            onChange={handleEndDateFilterChange}
          />
        </label>
      </div>
      {filteredOrders.length === 0 ? (
        <p>{t("No orders found")}</p>
      ) : (
        filteredOrders.map((order) => {
          const bakeryCount: { [key: string]: number } = {};
          order.bakeryIds.forEach((item) => {
            bakeryCount[item._id] = (bakeryCount[item._id] || 0) + 1;
          });

          return (
            <div key={order._id} className="order">
              <div
                className="order-summaryy"
                onClick={() => toggleOrderDetails(order._id)}
              >
                <h3>Номер замовлення: {order._id}</h3>
                <p>Статус замовлення: {statusTranslation[order.status]}</p>
                <p>Загальна ціна: {order.totalPrice} грн</p>
              </div>
              {expandedOrderId === order._id && (
                <div className="order-details">
                  <h4>Солодощі:</h4>
                  {order.orderCakesIds.map((item) => (
                    <div key={item._id} className="order-item">
                      <img src={item.img} alt="" />
                      <div>
                        <p>Торт: {item.name}</p>
                        <p>Смак: {item.tasteName}</p>
                        <p>Кількість: {item.number}</p>
                        <p>Вага: {item.weight}</p>
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
                        <div>
                          <p>{item.name}</p>
                          <p>Кількість: {count}</p>
                          <p>Вага: {item.weight}</p>
                          <p>Ціна: {item.price} грн</p>
                        </div>
                      </div>
                    );
                  })}
                  <p>Опис замовлення: {order.description}</p>
                  <label>
                    Змінити статус:
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value, e)
                      }
                    >
                      {Object.keys(statusTranslation).map((status) => (
                        <option key={status} value={status}>
                          {statusTranslation[status]}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default OrderManagement;
