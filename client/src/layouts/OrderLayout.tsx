import React from "react";
import { Outlet } from "react-router-dom";

import OrderHeader from "../components/OrderHeader";
import Footer from "../components/Footer";

const MainLayout: React.FC = () => {
  return (
    <div className="wrapper">
      <div className="header-block">
        <OrderHeader />
      </div>
      <div className="content">
        <Outlet />
      </div>
      <div className="footer-block">
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
