import React, { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (location = null) => {
    setError(null);
    setLoading(true);

    let query = city;

    if (location) {
      query = `${location.latitude},${location.longitude}`;
    }

    if (query) {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=25c6efa0ecff4b3190c91556242508&q=${encodeURIComponent(query)}&aqi=no`
        );
        const data = await response.json();

        if (data.error) {
          setError(data.error.message);
          setWeather(null);
        } else {
          setWeather(data);
        }
      } catch (err) {
        setError("Unable to fetch weather data. Please try again.");
        setWeather(null);
      } finally {
        setLoading(false); 
      }
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather({ latitude, longitude });
        },
        (error) => {
          setError("Unable to retrieve your location.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(); 
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center text-white"
      style={{ backgroundImage: "url('/background.png')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="weather-container p-4 rounded">
        <h1 className="mb-4 text-shadow">Simple Weather App</h1>
       
        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={() => fetchWeather()} className="btn btn-warning">
            <i className="bi bi-search"></i> <strong>Check</strong>
          </button>
        </div>

        <button onClick={handleUseCurrentLocation} className="btn btn-link text-white mb-4">
          Use Current Location
        </button>

        {loading && <p className="text-white mb-4">Loading...</p>}

        {error && <p className="text-danger mb-4">{error}</p>}

        {weather && weather.location && weather.current && (
          <div className="weather-info text-white p-4 rounded">
            <div className="info-container">
              <div className="location-temp-container">
                <div className="weather-location">{weather.location.name}</div>
                <div className="weather-temp">{weather.current.temp_c}°C</div>
              </div>
              <div className="weather-details-container">
              <div className="weather-time">
                  <span>Local Time:</span> {formatTime(weather.location.localtime_epoch * 1000)}
                </div>
                <div className="weather-detail">
                  <span className="weather-detail-label">Wind:</span> {weather.current.wind_kph} kph
                </div>
                <div className="weather-detail">
                  <span className="weather-detail-label">Pressure:</span> {weather.current.pressure_mb} hPa
                </div>
                <div className="weather-detail">
                  <span className="weather-detail-label">Humidity:</span> {weather.current.humidity}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

