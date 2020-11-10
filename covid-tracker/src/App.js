// import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import './App.css';
import InfoBox from './InfoBox';
import MapWorld from './MapWorld';
import TableData from './TableData';
import LineGraph from './LineGraph';
import PieChart from './PieChart';
import FilterTable from './FilterTable';
import numeral from 'numeral';
import { SortData, prettyPrintStat, setPieChartData } from './utils';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from '@material-ui/core';
import 'leaflet/dist/leaflet.css';


function App() {
  const [countries, setCountries] = useState([]); // data for select Menu
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({}) //set data for info box
  const [mapCenter, setMapCenter] = useState({ lat: 12.61, lng: 3.90 });
  const [mapZoom, setMapZoom] = useState(3);
  const [caseType, setCaseType] = useState("cases");
  const [dataset, setDataset] = useState([]); //set data for pie chart

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
      setDataset(setPieChartData(data));
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
        )).filter(country => country.value !== null);

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
    
    const url = countryCode === 'worldwide' 
                              ? 'https://disease.sh/v3/covid-19/all' 
                              : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
                              
    await fetch(url)
    .then(response => response.json())
          .then(data => {
            setSelectedCountry(countryCode);
            setCountryInfo(data);
            setDataset(setPieChartData(data));

            if (countryCode === 'worldwide') {
              setMapZoom(3);
              GetCountriesData();
            } else {
              setMapCenter({lat: data.countryInfo.lat, lng: data.countryInfo.long});
              setMapCountries([].concat(data));
              setMapZoom(3);
            }
          })
  }

  return (
    <div className="App">
      <h1 className='App__title'>COVID19 TRACKER</h1>

      <div className="App__top">
        <div className="app__left">

          {/* Graph */}
          <div className='app__graph-group'>
            <div className="app__graph">
              <h3 className="">Daily new {caseType}</h3>
              <LineGraph className={'graph__item'} caseType={caseType} select={selectedCountry} type={0}/>
            </div>
            <div className="app__graph">
              <h3 className="">Total {caseType}</h3>
              <LineGraph className={'graph__item'} caseType={caseType} select={selectedCountry} type={1}/>
            </div>
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
        {/* Title + Select Dropdown */}
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={selectedCountry} onChange={onCountryChange}>
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

        {/* Stats */}
        <div className="app__stats">
          <InfoBox active={caseType === 'cases'}
                  onClick={e => setCaseType('cases')} 
                  title="Total Cases" 
                  cases={prettyPrintStat(countryInfo.todayCases)} 
                  total={numeral(countryInfo.cases).format('0,0')} 
                  isBlue />

          <InfoBox active={caseType === 'recovered'}
                  onClick={e => setCaseType('recovered')} 
                  title="Recovers" 
                  cases={prettyPrintStat(countryInfo.todayRecovered)} 
                  total={numeral(countryInfo.recovered).format('0,0')} 
                  isGreen />

          <InfoBox active={caseType === 'deaths'}
                  onClick={e => setCaseType('deaths')} 
                  title="Deaths" 
                  cases={prettyPrintStat(countryInfo.todayDeaths)} 
                  total={numeral(countryInfo.deaths).format('0,0')} 
                  isRed />
        </div>
        <PieChart data={dataset}/>
        </CardContent>
      </Card>
      </div>

      {/* Table */}
      <div className='App__bottom'>
        <div className='app__table__header'>
            <h3 className='app__tableTitle'>Live cases by country</h3>
            <FilterTable target={document.querySelector('.MuiTable-root')}/>
          </div>
          <TableData countries={tableData}/>
        </div>
      </div>

  );
}

export default App;
