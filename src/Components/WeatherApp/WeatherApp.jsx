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
    const [unit, setUnit] = useState('imperial');
    const [temperature, setTemperature] = useState(null);
    const [wind, setWind] = useState({
        speed: null,
        unit: 'm/hr',
    });
    const [humidity, setHumidity] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [triggerSearch, setTriggerSearch] = useState(false);

    // New state for location details
    const [locationData, setLocationData] = useState({
        city: null,
        state: null,
        country: null,
    });

    const search = async () => {
        if (searchInput === '') {
            return 0;
        }

        try {
            let city;
            let stateCode;
            let countryCode;

            if (searchInput.includes(',')) {
                const [cityPart, statePart, countryPart] = searchInput.split(',');
                city = cityPart.trim();
                stateCode = statePart.trim();
                countryCode = countryPart.trim();
            } else {
                city = searchInput.trim();
                stateCode = '';
                countryCode = '';
            }

            const unitParam = unit === 'imperial' ? 'imperial' : 'metric';
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}${stateCode ? ',' + stateCode : ''}${countryCode ? ',' + countryCode : ''}&units=${unitParam}&appid=${api_key}`;
            const response = await fetch(url);
            const data = await response.json();

            setTemperature(Math.floor(data.main.temp));
            setUnit(unitParam);
            setWind({
                speed: Math.floor(data.wind.speed),
                unit: unitParam === 'imperial' ? 'm/hr' : 'km/hr',
            });
            setHumidity(data.main.humidity);
            updateWeatherIcon(data.weather[0].icon);

            // Update location data state
            setLocationData({
                city: data.name,
                state: stateCode,
                country: data.sys.country,
            });

            setErrorMessage(null);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setErrorMessage("Failed to fetch weather data. Please try again.");
        }
    };

    useEffect(() => {
        if (triggerSearch) {
            search();
            setTriggerSearch(false); // Reset triggerSearch after searching
        }
    }, [unit, searchInput, triggerSearch]);

    const searchUnit = () => {
        setUnit(unit === 'imperial' ? 'metric' : 'imperial');
        setTriggerSearch(true); // Trigger search after changing the unit
    };

    const updateWeatherIcon = (iconCode) => {
        const iconMapping = {
            '01d': clear_icon,
            '01n': clear_icon,
            '02d': cloud_icon,
            '02n': cloud_icon,
            '03d': drizzle_icon,
            '03n': drizzle_icon,
            '04d': cloud_icon,
            '04n': cloud_icon,
            '09d': rain_icon,
            '09n': rain_icon,
            '10d': rain_icon,
            '10n': rain_icon,
            '13d': snow_icon,
            '13n': snow_icon,
        };

        const selectedIcon = iconMapping[iconCode] || clear_icon;
        setWicon(selectedIcon);
    };

    return (
        <div className='container'>
            <div className='top-bar'>
                <input
                    type='text'
                    className='cityInput'
                    placeholder='Search a city'
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            setTriggerSearch(true);
                        }
                    }}
                />
                <div className='search-icon' onClick={() => setTriggerSearch(true)}>
                    <img src={search_icon} alt='' />
                </div>
            </div>
            <button onClick={() => searchUnit()} className='button'>
                Toggle Unit ({unit === 'imperial' ? '˚F' : '˚C'})
            </button>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <div className="weather-image">
                <img src={wicon} alt="" />
            </div>
            <div className="weather-temp">
                {temperature !== null && `${temperature}˚${unit === 'imperial' ? 'F' : 'C'}`}
            </div>
            <div className="weather-location">
                {(locationData.city || locationData.state || locationData.country) && (
                    <p>{`${locationData.city || ''}${locationData.city && locationData.state ? ', ' : ''}${locationData.state || ''}${(locationData.city || locationData.state) && locationData.country ? ', ' : ''}${locationData.country || ''}`}</p>
                )}
            </div>
            <div className="data-container">
                <div className="element">
                    <img src={humidity_icon} alt="" />
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
