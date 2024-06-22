import React from "react";
import { Outlet } from "react-router-dom";

import SecondHeader from "../components/SecondHeader";
import Footer from "../components/Footer";
import Cart from "../components/Cart";

const MainLayout: React.FC = () => {
  return (
    <div className="wrapper">
      <Cart />
      <div className="header-block">
        <SecondHeader isVisible={true} />
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
