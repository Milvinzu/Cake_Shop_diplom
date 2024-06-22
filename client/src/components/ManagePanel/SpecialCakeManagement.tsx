import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllSpecialCakes,
  updateSpecialCake,
  selectSpecialCakes,
  selectSpecialCakesLoading,
  selectSpecialCakesError,
} from "../../redux/slices/specialCakeSlice";
import { useTranslation } from "react-i18next";
import { AppDispatch } from "../../redux/store";
import "../../scss/components/_orderHistory.scss";

const statusTranslation = {
  sent: "відправлено",
  recieved: "отримано",
  paid: "оплачено",
  processing: "обробляється",
  cooking: "готується",
  done: "готово",
  "on the way": "у дорозі",
  delivered: "доставлено",
};

const SpecialCakeManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const specialCakes = useSelector(selectSpecialCakes);
  const loading = useSelector(selectSpecialCakesLoading);
  const error = useSelector(selectSpecialCakesError);

  const [expandedCakeId, setExpandedCakeId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("");

  const [editCake, setEditCake] = useState({
    id: "",
    status: "",
    description: "",
    price: 0,
  });

  useEffect(() => {
    dispatch(fetchAllSpecialCakes());
  }, [dispatch]);

  const toggleCakeDetails = (cake: any) => {
    if (expandedCakeId === cake._id) {
      setExpandedCakeId(null);
      setEditCake({ id: "", status: "", description: "", price: 0 });
    } else {
      setExpandedCakeId(cake._id);
      setEditCake({
        id: cake._id,
        status: cake.status,
        description: cake.description,
        price: cake.price,
      });
    }
  };

  const handleUpdateCake = () => {
    dispatch(updateSpecialCake(editCake));
  };

  if (loading) return <p>{t("Loading...")}</p>;
  if (error) return <p>{t("Error loading special cakes")}</p>;

  const filteredCakes = filterStatus
    ? specialCakes.filter((cake) => cake.status === filterStatus)
    : specialCakes;

  // Function to convert newlines to HTML line breaks
  const renderDescriptionWithLineBreaks = (description: string) => {
    return { __html: description.replace(/\n/g, "<br>") };
  };

  return (
    <div className="order-history">
      <h2>{t("Special Cake Management")}</h2>
      <div>
        <label>{t("Filter by status")}: </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">{t("All")}</option>
          {Object.keys(statusTranslation).map((status) => (
            <option key={status} value={status}>
              {statusTranslation[status]}
            </option>
          ))}
        </select>
      </div>
      {filteredCakes.length === 0 ? (
        <p>{t("No special cakes found")}</p>
      ) : (
        filteredCakes.map((cake) => (
          <div key={cake._id} className="order">
            <div
              className="order-summary"
              onClick={() => toggleCakeDetails(cake)}
            >
              <h3>
                {t("Special Cake ID")}: {cake._id}
              </h3>
              <p>
                {t("Status")}: {statusTranslation[cake.status]}
              </p>
              <p>
                {t("Price")}: {cake.price} грн
              </p>
              <p>
                {t("Description")}:{" "}
                <span
                  dangerouslySetInnerHTML={renderDescriptionWithLineBreaks(
                    cake.description
                  )}
                />
              </p>
            </div>
            {expandedCakeId === cake._id && (
              <div className="order-details">
                <div>
                  <label>{t("Change Status")}: </label>
                  <select
                    value={editCake.status}
                    onChange={(e) =>
                      setEditCake({ ...editCake, status: e.target.value })
                    }
                  >
                    {Object.keys(statusTranslation).map((status) => (
                      <option key={status} value={status}>
                        {statusTranslation[status]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>{t("Change Description")}: </label>
                  <input
                    type="text"
                    value={editCake.description}
                    style={{
                      width: "auto",
                      minWidth: "100px",
                      maxWidth: "500px",
                    }}
                    onChange={(e) =>
                      setEditCake({ ...editCake, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>{t("Change Price")}: </label>
                  <input
                    type="number"
                    value={editCake.price}
                    onChange={(e) =>
                      setEditCake({
                        ...editCake,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <button onClick={handleUpdateCake}>{t("Update Cake")}</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default SpecialCakeManagement;
