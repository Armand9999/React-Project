import './App.css';
import React, { useState, useEffect } from 'react';
import "./02d@2x.png";

function App() {
  const [cityName, setCityName] = useState('');
  const [weatherData, setWeatherData] = useState([]);
  const [weatherData2, setWeatherData2] = useState([]);
  const [coords, setCoords]  = useState({ lat: 0, lon: 0 });
  const location = []
  const apiKey = 'a8e0fd56f7e64ebb874486b9585a0309';

  
  // navigator.geolocation.getCurrentPosition(function (position) {
  //   setCoords({lat: position.coords.latitude, lon: position.coords.longitude}) 
  // });

  const handleSearch = async () => {
    try {
      // Get location data
      const geoResponse = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(cityName+', Canada')}&key=${apiKey}&pretty=1`);
      const geoData = await geoResponse.json();
      
      try {
        if(geoData.results.length > 0){
          geoData.results.map(data => {
            location.push(data.geometry);
          }) 
        } else {
          console.log('Location not found.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      setCoords({lat: location[0].lat, lon: location[0].lng});
      console.log(coords);
      
      // Get weather data
      const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=5bce0931900ea5bb324950f739423df0&units=metric`);
      const weatherData = await weatherResponse.json();
      

      if (!weatherData) {
        // Handle no weather data
      }

      setWeatherData2(weatherData.main)
      console.log(weatherData2);
      

      const mappedWeatherData = weatherData.weather.map(item => ({
        id: item.id,
        main: item.main,
        description: item.description,
        icon: item.icon
      }));
      console.log(mappedWeatherData);
      setWeatherData(mappedWeatherData);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  return (
    <div className="App p-8 bg-gray-200 min-h-screen">
      <div className="max-w-md mx-auto p-4 bg-white rounded-md shadow-md">
        <input
          type="text"
          placeholder="Enter city name"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        /> 
        <button
          onClick={handleSearch}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Search
        </button>
      </div>
      <br/>
      {
          weatherData2 && (
            <div className="max-w-md mx-auto p-4 bg-white rounded-md shadow-md">
              <p className='text-xl font-semibold'>Temperature: {weatherData2.temp} &deg;C</p>
              <p className='text-gray-600'>Feels like: {weatherData2.feels_like} &deg;C</p>
              <p className='text-gray-600'>Min Temperature: {weatherData2.temp_min} &deg;C</p>
              <p className='text-gray-600'>Max Temperature: {weatherData2.temp_max} &deg;C</p>
              <p className='text-gray-600'>Pressure: {weatherData2.pressure} hPa</p>
              <p className='text-gray-600'>Humidity: {weatherData2.humidity}%</p>
            </div>
          )
      }
      <br/>
      {weatherData.map((item) => (
        <div key={item.id} className="max-w-md mx-auto p-4 bg-white rounded-md shadow-md">
          <p className="text-xl font-semibold">{item.main}</p>
          <p className="text-gray-600">{item.description}</p>
          <img
            className="mt-2 w-12 h-12"
            src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
            alt={item.icon}
          />
        </div>
      ))}
    </div>
  );
}

export default App;
