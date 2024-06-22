import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import MapPoint from "../assets/img/Footer/map-point-GeoZone.svg";

const MapWithGeoZone = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const kharkivCoords = [49.971, 36.252];

    const map = L.map("map").setView(kharkivCoords, 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const kharkivBoundaryCoords = [
      [49.89512258912442, 36.42925485225095],
      [49.897121795734854, 36.44022540992727],
      [49.91627278638809, 36.450546394308674],
      [49.94266265688432, 36.449030724922025],
      [49.970523588747845, 36.399807567626624],
      [49.991547912281426, 36.40009626651285],
      [49.99962103848891, 36.37223682485627],
      [50.01349065782828, 36.36595762408101],
      [50.022255677677535, 36.38169171284598],
      [50.031798166872385, 36.37136895058543],
      [50.0378712470177, 36.37526638554938],
      [50.0473270333053, 36.357367054603806],
      [50.05506641343819, 36.36155318910002],
      [50.06368485230947, 36.2945750492639],
      [50.04802223825526, 36.27487135239552],
      [50.030082730152266, 36.26058075825936],
      [50.04273842829963, 36.24657886227774],
      [50.04301653834528, 36.223771651841936],
      [50.05525177255451, 36.229689979062165],
      [50.06929063994718, 36.21691505334698],
      [50.07392302780752, 36.20746016482331],
      [50.058727122260926, 36.18970518425364],
      [50.03304993316715, 36.19057128088264],
      [50.023776815245, 36.19511828834057],
      [50.00740764159663, 36.19774023277991],
      [49.99736986714826, 36.199883712651655],
      [49.98962688374215, 36.18375658041548],
      [49.98542677817357, 36.16773151661241],
      [49.98916751505939, 36.155483060202435],
      [49.98076685691703, 36.13619174135671],
      [49.954676923399006, 36.16511892737615],
      [49.957927385128954, 36.19824712456977],
      [49.941765780230064, 36.232674463405914],
      [49.93115638605979, 36.25883737344249],
      [49.9354769175828, 36.30661703642215],
      [49.93008780751427, 36.36060372585767],
      [49.92437283406314, 36.40181549002625],
      [49.909594396516006, 36.41877654898846],
      [49.89509039514527, 36.42953058176512],
    ];

    const kharkivBoundary = L.polygon(kharkivBoundaryCoords, {
      color: "#3388ff",
      weight: 1,
      fillOpacity: 0.2,
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);

    const icon1 = L.icon({
      iconUrl: MapPoint,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });

    const marker1 = L.marker([49.9841938113108, 36.24557250019827], {
      icon: icon1,
    }).addTo(markersLayer);

    marker1.bindTooltip(`${t("Pickup point")} №1`).openTooltip();

    const icon2 = L.icon({
      iconUrl: MapPoint,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });

    const marker2 = L.marker([50.034860402138825, 36.22003915042083], {
      icon: icon2,
    }).addTo(markersLayer);

    marker2.bindTooltip(`${t("Pickup point")} №2`).openTooltip();
  }, []);

  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "600px",
        zIndex: "0",
        border: "15px solid #e4e3e8",
        borderRadius: "20px",
      }}
    ></div>
  );
};

export default MapWithGeoZone;
