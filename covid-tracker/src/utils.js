import { Circle, Popup } from "react-leaflet";
import React from "react";
import numeral from "numeral";

const casesTypeColors = {
  cases: {
    hex: "#497ff4",
    rgb: "rgb(204, 16, 52)",
    half_op: "rgba(204, 16, 52, 0.5)",
    opaciti: 0.2,
    multiplier: 750,
  },
  recovered: {
    hex: "#7dd71d",
    rgb: "rgb(125, 215, 29)",
    half_op: "rgba(125, 215, 29, 0.5)",
    opaciti: 0.3,
    multiplier: 750,
  },
  deaths: {
    hex: "#fb4443",
    rgb: "rgb(251, 68, 67)",
    half_op: "rgba(251, 68, 67, 0.5)",
    opaciti: 0.3,
    multiplier: 2000,
  },
};

export {casesTypeColors};

export const SortData = (data) => {
    const sortedData = [...data];
    return sortedData.sort((a, b) =>b.cases - a.cases);
}

export const prettyPrintStat = (stat) => stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const showDataOnMap = (data, casesType = "cases") =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      fillOpacity={0.2}
      weight={2}
      key={country.country}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="info-container">
          <div className="info-flag" style={{ backgroundImage: `url(${country.countryInfo.flag})` }}></div>
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));

  export const buildChartData = (data, caseType, select, type) => {
    const chartData = [];
    const dataArray = select === 'worldwide' 
                                ? Object.entries(data[caseType]) 
                                : Object.entries(data['timeline'][caseType]);
    let lastDataPoint;

    for (let [date, cases = 0] of dataArray) {
        if (lastDataPoint) {
            let newDataPoint = type === 0 ? {
                x: date,
                y: cases - lastDataPoint < 0 ? 0 : cases - lastDataPoint,
            } : {
              x: date,
              y: cases,
            };
            chartData.push(newDataPoint);
        }
        lastDataPoint = cases;
    }
    return chartData;
};

export const setPieChartData = (data) => {
  const total = data.cases;
  let deaths = Number.parseFloat((data.deaths / total) * 100).toFixed(2);
  let recovered = Number.parseFloat((data.recovered / total) * 100).toFixed(2);
  let active = Number.parseFloat((data.active / total) * 100).toFixed(2);
  return [{
    data: [deaths, recovered, active],
    backgroundColor: ['#fb4443', '#7dd71d', '#497ff4']
  }];
}