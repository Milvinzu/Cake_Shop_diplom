import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProducts,
  searchProducts,
  clearProductSearch,
} from "../redux/slices/searchSlice";
import { AppDispatch, RootState } from "../redux/store";
import "../scss/components/_secondheader.scss";
import SearchResultsCarousel from "./SearchResultsCarousel";

import logo from "../assets/img/logo.png";
import searchIcon from "../assets/img/SecondHeader/search-icon.svg";
import closeIcon from "../assets/img/SecondHeader/close-icon.svg";

interface HeaderProps {
  isVisible: boolean;
}

const Header: React.FC<HeaderProps> = ({ isVisible }) => {
  const [showHeader, setShowHeader] = useState(isVisible);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const products = useSelector(
    (state: RootState) => state.search.filteredProducts
  );
  const status = useSelector((state: RootState) => state.search.status);
  const navigate = useNavigate();

  //bug with keyboord on phone
  useEffect(() => {
    const handleScroll = () => {
      if (!isVisible) {
        const scrollThreshold = window.innerWidth <= 768 ? 300 : 550;
        if (window.scrollY > scrollThreshold) {
          setShowHeader(true);
        } else {
          setShowHeader(false);
          setSearchText("");
          dispatch(clearProductSearch());
          setShowSearchInput(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isVisible]);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setShowMobileMenu(false); // Close mobile menu when resizing to prevent layout issues
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
    if (!showSearchInput) {
      dispatch(clearProductSearch());
    }
  };

  const closeSearchInput = () => {
    setShowSearchInput(false);
    dispatch(clearProductSearch());
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value;
    setSearchText(searchText);
    dispatch(searchProducts(searchText));
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      navigate("/search-results");
    }
  };

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <>
      <div className="container">
        <div
          className={`SecondHeader ${showHeader || isVisible ? "show" : ""}`}
        >
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="Logo" />
            </Link>
          </div>
          <div className="menu">
            <div
              className="menu-item"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button>{t("Sweets")}</button>
              {showDropdown && (
                <div className="dropdown">
                  <Link to="/category/Cake">{t("Cakes")}</Link>
                  <Link to="/category/Eclair">{t("Eclairs")}</Link>
                  <Link to="/category/Marshmallow">{t("Marshmallows")}</Link>
                  <Link to="/category/Pastry">{t("Pastries")}</Link>
                  <Link to="/category/Tart">{t("Tarts")}</Link>
                  <Link to="/category/Macaron">{t("Macaron")}</Link>
                </div>
              )}
            </div>
            <Link to="/CakeCreate" className="menu-item">
              <button>{t("Own design")}</button>
            </Link>
            <Link to="/faq" className="menu-item">
              <button>{t("Information")}</button>
            </Link>
          </div>
          <div className={`search ${showSearchInput ? "open" : ""}`}>
            {showSearchInput ? (
              <>
                <input
                  type="text"
                  placeholder={t("Search")}
                  className="search-input"
                  value={searchText}
                  onChange={handleSearch}
                  onKeyPress={handleKeyPress}
                />
                <button onClick={closeSearchInput}>
                  <img src={closeIcon} alt="Close" />
                </button>
              </>
            ) : (
              <button onClick={toggleSearchInput}>
                <img src={searchIcon} alt="Search" />
              </button>
            )}
          </div>
          <button className="mobile-menu-button" onClick={toggleMobileMenu}>
            ☰
          </button>
        </div>
        {showHeader &&
          showSearchInput &&
          status === "succeeded" &&
          products.length > 0 &&
          searchText.length > 0 && (
            <SearchResultsCarousel secondHeader={true} mobileMenu={false} />
          )}
      </div>
      {showMobileMenu && (
        <>
          <div className="mobile-menu">
            <button className="close-button" onClick={toggleMobileMenu}>
              ✖
            </button>
            <input
              type="text"
              placeholder="Search"
              className="search-input"
              value={searchText}
              onChange={handleSearch}
              onKeyPress={handleKeyPress}
            />
            <Link to="/category/Cake" onClick={toggleMobileMenu}>
              {t("Cakes")}
            </Link>
            <Link to="/category/Eclair" onClick={toggleMobileMenu}>
              {t("Eclairs")}
            </Link>
            <Link to="/category/Marshmallow" onClick={toggleMobileMenu}>
              {t("Marshmallows")}
            </Link>
            <Link to="/category/Pastry" onClick={toggleMobileMenu}>
              {t("Pastries")}
            </Link>
            <Link to="/category/Tart" onClick={toggleMobileMenu}>
              {t("Tarts")}
            </Link>
            <Link to="/category/Macaron" onClick={toggleMobileMenu}>
              {t("Macaron")}
            </Link>
            <Link to="/CakeCreate" onClick={toggleMobileMenu}>
              {t("Own design")}
            </Link>
            <Link to="/faq" onClick={toggleMobileMenu}>
              {t("Information")}
            </Link>
          </div>
          {showMobileMenu &&
            status === "succeeded" &&
            products.length > 0 &&
            searchText.length > 0 && (
              <SearchResultsCarousel secondHeader={true} mobileMenu={true} />
            )}
        </>
      )}
    </>
  );
};

export default Header;
