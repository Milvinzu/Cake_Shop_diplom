import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import { useNavigate } from "react-router-dom";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../scss/components/_carousel.scss";

import cakePhoto from "../assets/img/Carousel/cake.png";
import biscuitPhoto from "../assets/img/Carousel/biscuit.png";
import jeliPhoto from "../assets/img/Carousel/jeli.png";
import prevButtonSvg from "../assets/img/Carousel/prevButton.svg";
import nextButtonSvg from "../assets/img/Carousel/nextButton.svg";

const CarouselComponent: React.FC = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleImageClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="carousel">
      <Carousel
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="carousel-arrow carousel-arrow-prev"
            >
              <img src={prevButtonSvg} alt="Previous" />
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="carousel-arrow carousel-arrow-next"
            >
              <img src={nextButtonSvg} alt="Next" />
            </button>
          )
        }
        showArrows={!isMobile}
        autoPlay={!isMobile}
        infiniteLoop={true}
        showThumbs={false}
        showStatus={false}
        dynamicHeight={true}
      >
        <div onClick={() => handleImageClick("/cake")}>
          <img src={cakePhoto} alt="Cake" />
        </div>
        <div onClick={() => handleImageClick("/biscuit")}>
          <img src={biscuitPhoto} alt="Biscuit" />
        </div>
        <div onClick={() => handleImageClick("/jeli")}>
          <img src={jeliPhoto} alt="Jeli" />
        </div>
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
