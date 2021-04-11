import { Map as MaplibreMap } from "maplibre-gl";

import userPin from "./resources/userPin.png";

const URL = process.env.REACT_APP_API_BASE_URL;

export const sources = {
  "all-objects": {
    cluster: false,
    data: URL + "/geojson/users",
    type: "geojson",
  },
  "clustered-users": {
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
    data: URL + "/geojson/users",
    type: "geojson",
  },
};

export const layers = {
  clusterCountLayer: {
    filter: ["has", "point_count"],
    id: "clusters-count",
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-size": 12,
    },
    source: "clustered-users",
    type: "symbol",
  },
  clusterLayer: {
    filter: ["has", "point_count"],
    id: "clusters",
    paint: {
      // step expression: https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/#step
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#51bbd6",
        100,
        "#f1f075",
        750,
        "#f28cb1",
      ],
      "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
    },
    source: "clustered-users",
    type: "circle",
  },
  unclusteredPointLayer: {
    filter: ["!", ["has", "point_count"]],
    id: "unclustered-points",
    layout: {
      "icon-image": "user-pin",
      "icon-allow-overlap": true,
    },
    source: "clustered-users",
    type: "symbol",
  },

  users: {
    filter: ["!", ["has", "point_count"]],
    id: "users",
    layout: {
      "icon-image": "user-pin",
      "icon-allow-overlap": true,
    },
    source: "all-objects",
    type: "symbol",
  },
};

const addPinImages = (map: MaplibreMap) => {
  map.loadImage(userPin, (error: Error, image: HTMLImageElement) => {
    if (error) {
      throw error;
    }
    map.addImage("user-pin", image);
  });
};

export const addClusteredUsersToMap = (
  map: MaplibreMap,
  userClickedCallback?: (ev: any) => void
) => {
  map.addSource("clustered-users", sources["clustered-users"] as any);
  addPinImages(map);
  map.addLayer(layers["clusterLayer"] as any);
  map.addLayer(layers["clusterCountLayer"] as any);
  map.addLayer(layers["unclusteredPointLayer"] as any);
  if (userClickedCallback) {
    map.on("click", layers["unclusteredPointLayer"].id, userClickedCallback);
  }
};

export const addUsersToMap = (
  map: MaplibreMap,
  userClickedCallback?: (ev: any) => void
) => {
  map.addSource("all-objects", sources["all-objects"] as any);
  addPinImages(map);
  map.addLayer(layers["users"] as any);

  if (userClickedCallback) {
    map.on("click", layers["users"].id, userClickedCallback);
  }
};
