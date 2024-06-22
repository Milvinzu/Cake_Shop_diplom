import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProducts,
  searchProducts,
  clearProductSearch,
} from "../redux/slices/searchSlice";
import { AppDispatch, RootState } from "../redux/store";
import "../scss/components/_header.scss";
import SearchResultsCarousel from "./SearchResultsCarousel";

import logo from "../assets/img/logo.png";
import searchIcon from "../assets/img/Header/search-icon.svg";
import closeIcon from "../assets/img/Header/close-icon.svg";

const Header: React.FC = () => {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch: AppDispatch = useDispatch();
  const products = useSelector(
    (state: RootState) => state.search.filteredProducts
  );
  const status = useSelector((state: RootState) => state.search.status);
  const navigate = useNavigate();

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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
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

  const handleScroll = () => {
    const scrollThreshold = window.innerWidth <= 768 ? 300 : 550;
    if (window.scrollY > scrollThreshold) {
    } else {
      closeSearchInput();
      setSearchText("");
    }
  };

  useEffect(() => {
    dispatch(fetchAllProducts());
    document.addEventListener("mousedown", handleClickOutside);

    const handleResize = () => {
      // const scrollThreshold = window.innerWidth <= 768 ? 300 : 550;
      // if (window.scrollY <= scrollThreshold) {
      //   closeSearchInput();
      // }
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dispatch]);

  return (
    <>
      <div className="container">
        <div className="header">
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="Logo" />
            </Link>
          </div>
          <div className="navigation">
            <div className="dropdown" ref={dropdownRef}>
              <button className="dropdown-button" onClick={toggleDropdown}>
                {t("Sweets")}
              </button>
              {dropdownOpen && (
                <div className="dropdown-content open">
                  <Link to="/category/cake">{t("Cakes")}</Link>
                  <Link to="/category/Eclair">{t("Eclairs")}</Link>
                  <Link to="/category/Marshmallow">{t("Marshmallows")}</Link>
                  <Link to="/category/Pastry">{t("Pastries")}</Link>
                  <Link to="/category/Tart">{t("Tarts")}</Link>
                  <Link to="/category/Macaron">{t("Macaron")}</Link>
                </div>
              )}
            </div>
            <button className="nav-button">
              <Link to="/CakeCreate">{t("Own design")}</Link>
            </button>
            <button className="nav-button">
              <Link to="/faq">{t("Information")}</Link>
            </button>
          </div>
          <div className={`search ${showSearchInput ? "open" : ""}`}>
            {showSearchInput ? (
              <>
                <input
                  type="text"
                  placeholder={t("Search") || "Search"}
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
        </div>
      </div>
      {showSearchInput &&
        status === "succeeded" &&
        products.length > 0 &&
        searchText.length > 0 && (
          <SearchResultsCarousel secondHeader={false} mobileMenu={false} />
        )}
    </>
  );
};

export default Header;
