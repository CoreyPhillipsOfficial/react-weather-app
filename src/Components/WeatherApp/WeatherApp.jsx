import React, { useState, useEffect } from 'react';
import './WeatherApp.css';

import search_icon from '../Assets/search.png';
import clear_icon from '../Assets/clear.png';
import cloud_icon from '../Assets/cloud.png';
import drizzle_icon from '../Assets/drizzle.png';
import rain_icon from '../Assets/rain.png';
import snow_icon from '../Assets/snow.png';
import wind_icon from '../Assets/wind.png';
import humidity_icon from '../Assets/humidity.png';

const WeatherApp = () => {
    const api_key = process.env.REACT_APP_API_KEY;

    const [wicon, setWicon] = useState(cloud_icon);
    const [unit, setUnit] = useState('imperial'); // Default to imperial units
    const [temperature, setTemperature] = useState(null);
    const [wind, setWind] = useState({
        speed: null,
        unit: 'm/hr', // Default unit for wind speed
    });
    const [humidity, setHumidity] = useState(null);

    const [errorMessage, setErrorMessage] = useState(null);

    const search = async () => {
        const element = document.getElementsByClassName('cityInput');
        if (element[0].value === '') {
            return 0;
        }

        try {
            const unitParam = unit === 'imperial' ? 'imperial' : 'metric';
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${element[0].value}&units=${unitParam}&appid=${api_key}`;
            const response = await fetch(url);
            const data = await response.json();

            // Update state directly instead of manipulating the DOM
            setTemperature(Math.floor(data.main.temp));
            setUnit(unitParam); // Always set the received unit
            setWind({
                speed: Math.floor(data.wind.speed),
                unit: unitParam === 'imperial' ? 'm/hr' : 'km/hr',
            });
            setHumidity(data.main.humidity); // Set humidity in state

            // Update weather icon based on received data
            updateWeatherIcon(data.weather[0].icon);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setErrorMessage("Failed to fetch weather data. Please try again.");
        }
    };


    useEffect(() => {
        // Call the search function whenever 'unit' changes
        search();
    }, [unit]); // Add 'unit' as a dependency

    const toggleUnit = () => {
        // Toggle between 'imperial' and 'metric' units
        setUnit(unit === 'imperial' ? 'metric' : 'imperial');
    };

    const updateWeatherIcon = (iconCode) => {
        if (iconCode === '01d' || iconCode === '01n') {
            setWicon(clear_icon);
        } else if (iconCode === '02d' || iconCode === '02n') {
            setWicon(cloud_icon);
        } else if (iconCode === '03d' || iconCode === '03n') {
            setWicon(drizzle_icon);
        } else if (iconCode === '04d' || iconCode === '04n') {
            setWicon(drizzle_icon);
        } else if (iconCode === '09d' || iconCode === '09n') {
            setWicon(rain_icon);
        } else if (iconCode === '10d' || iconCode === '10n') {
            setWicon(cloud_icon);
        } else if (iconCode === '13d' || iconCode === '13n') {
            setWicon(snow_icon);
        } else {
            setWicon(clear_icon);
        }
    };

    return (
        <div className='container'>
            <div className='top-bar'>
                <input type='text' className='cityInput' placeholder='Search a city' />
                <div className='search-icon' onClick={() => search()}>
                    <img src={search_icon} alt='' />
                </div>
                <button onClick={toggleUnit}>
                    Toggle Unit ({unit === 'imperial' ? '˚F' : '˚C'})
                </button>
            </div>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <div className="weather-image">
                <img src={wicon} alt="" />
            </div>
            <div className="weather-temp">
                {temperature !== null && `${temperature}˚${unit === 'imperial' ? 'F' : 'C'}`}
            </div>
            <div className="weather-location">City</div>
            <div className="data-container">
                <div className="element">
                    <img src={humidity_icon} alt="" className='icon' />
                    <div className="data">
                        <div className="humidity-percent">{humidity !== null && `${humidity} %`}</div>
                        <div className="text">Humidity</div>
                    </div>
                </div>
                <div className="element">
                    <img src={wind_icon} alt="" className='icon' />
                    <div className="data">
                        <div className="wind-rate">{wind.speed} {wind.unit}</div>
                        <div className="text">Wind Speed</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherApp;
