import React from "react";
import { Routes, Route } from "react-router-dom";
import "./i18n";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Account from "./pages/Account";
import CategoryPage from "./pages/Category";
import ProductDetail from "./pages/ProductDetail";
import ManagementPanel from "./pages/ManagePanel";
import Info from "./pages/Info";
import CustomCake from "pages/CustomCake";
import Order from "pages/Order";
import SuccessfulPay from "pages/SuccessfulPay";
import SearchResultsPage from "pages/SearchResultsPage";
import SearchResultDetail from "pages/SearchResultDetail";
import RestorePassword from "pages/RestorePassword";

import "./scss/app.scss";
import MainLayout from "./layouts/MainLayout";
import SecondaryLayout from "./layouts/SecondaryLayout";
import OrderLayout from "./layouts/OrderLayout";

import {
  AdminRoute,
  ProtectedRoute,
  ProtectedRouteAlert,
} from "./ProtectedRoute";
import SuccessfulPayment from "components/SuccessfulPayment";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="" element={<Home />} />
      </Route>
      <Route path="/*" element={<SecondaryLayout />}>
        <Route path="category/:category" element={<CategoryPage />} />
        <Route path="Login" element={<Login />} />
        <Route path="forgot-password" element={<RestorePassword />} />
        <Route
          path="Account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route path="product/:productId" element={<ProductDetail />} />
        <Route
          path="SearchResults/:productId"
          element={<SearchResultDetail />}
        />
        <Route
          path="management"
          element={
            <AdminRoute>
              <ManagementPanel />
            </AdminRoute>
          }
        />
        <Route path="faq" element={<Info />} />
        <Route
          path="CakeCreate"
          element={
            <ProtectedRouteAlert>
              <CustomCake />
            </ProtectedRouteAlert>
          }
        />
        <Route path="congratulations" element={<SuccessfulPay />} />
        <Route path="search-results" element={<SearchResultsPage />} />
      </Route>
      <Route path="/order/*" element={<OrderLayout />}>
        <Route
          path="confirm"
          element={
            <ProtectedRouteAlert>
              <Order />
            </ProtectedRouteAlert>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
