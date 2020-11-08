// import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import './App.css';
import InfoBox from './InfoBox';
import MapWorld from './MapWorld';
import Table from './Table';
import LineGraph from './LineGraph';
import numeral from 'numeral';
import {SortData, prettyPrintStat} from './utils';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from '@material-ui/core';
import 'leaflet/dist/leaflet.css';


function App() {
  const [countries, setCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [defautCountry, setdefautCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({})
  const [mapCenter, setMapCenter] = useState({ lat: 12.61, lng: 3.90 });
  const [mapZoom, setMapZoom] = useState(2);
  const [caseType, setCaseType] = useState("cases");

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, [])
  const GetCountriesData = async () => {
    await fetch('https://disease.sh/v3/covid-19/countries')
      .then(response => response.json())
      .then(data => {
        const countries = data.map(country => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ));

        const sortedData = SortData(data);
        setTableData(sortedData);
        setCountries(countries);
        setMapCountries(data);
        setMapCenter({ lat: 12.61, lng: 3.90 });
      })
  };
  useEffect(() => {

    GetCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    console.log(mapCenter);
    
    const url = countryCode === 'worldwide' 
                              ? 'https://disease.sh/v3/covid-19/all' 
                              : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
                              
    await fetch(url)
    .then(response => response.json())
          .then(data => {
            setdefautCountry(countryCode);
            setCountryInfo(data);

            if (countryCode === 'worldwide') {
              setMapZoom(2);
              GetCountriesData();
            } else {
              setMapCenter({lat: data.countryInfo.lat, lng: data.countryInfo.long});
              setMapCountries([].concat(data));
              setMapZoom(5);
            }
          })
  }

  return (
    <div className="App">
      <div className="app__left">

        {/* Header */}
        <div className="app__header">
          <h1>COVID19 TRACKER</h1>

          <FormControl className="app__dropdown">
            <Select variant="outlined" value={defautCountry} onChange={onCountryChange}>
              <MenuItem value="worldwide" key="">Worldwide</MenuItem>
              {
                countries.map(country => (
                  <MenuItem
                    value={country.value}
                    key={country.name}>
                    {country.name}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>

        </div>
        {/* Title + Select Dropdown */}

        {/* Stats */}
        <div className="app__stats">
          <InfoBox active={caseType === 'cases'}
                  onClick={e => setCaseType('cases')} 
                  title="Covid19 Cases" 
                  cases={prettyPrintStat(countryInfo.todayCases)} 
                  total={numeral(countryInfo.cases).format('0,0')} />

          <InfoBox active={caseType === 'recovered'}
                  onClick={e => setCaseType('recovered')} 
                  title="Recovers" 
                  cases={prettyPrintStat(countryInfo.todayRecovered)} 
                  total={numeral(countryInfo.recovered).format('0,0')} />

          <InfoBox active={caseType === 'deaths'}
                  onClick={e => setCaseType('deaths')} 
                  title="Deaths" 
                  cases={prettyPrintStat(countryInfo.todayDeaths)} 
                  total={numeral(countryInfo.deaths).format('0,0')} />
        </div>

        {/* Map */}
        <MapWorld casesType={caseType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>

          <h3>Live cases by country</h3>
          {/* Table */}
          <Table countries={tableData}/>

            <h3 className="app__chartTitle">Worldwide new {caseType}</h3>
          {/* Graph */}
          <LineGraph className='app__graph' caseType={caseType}/>

        </CardContent>
      </Card>

    </div>
  );
}

export default App;
