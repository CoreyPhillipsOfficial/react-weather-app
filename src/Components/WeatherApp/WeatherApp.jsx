import React, { useState, useEffect } from 'react'
import './WeatherApp.css'

import search_icon from '../Assets/search.png';
import clear_icon from '../Assets/clear.png';
import cloud_icon from '../Assets/cloud.png';
import drizzle_icon from '../Assets/drizzle.png';
import rain_icon from '../Assets/rain.png';
import snow_icon from '../Assets/snow.png';
import wind_icon from '../Assets/wind.png';
import humidity_icon from '../Assets/humidity.png';

export const WeatherApp = () => {

    let api_key = 
    const [wicon, setWicon] = useState(cloud_icon);
    const [unit, setUnit] = useState('imperial'); // Default to imperial units
    const [temperature, setTemperature] = useState(null);
    const [wind, setWind] = useState({
        speed: null,
        unit: 'm/hr', // Default unit for wind speed
    });

    const search = async () => {
        const element = document.getElementsByClassName('cityInput')
        if (element[0].value === '') {
            return 0;
        }

        let url = `https://api.openweathermap.org/data/2.5/weather?q=${element[0].value}&units=${unit}&appid=${api_key}`;

        let response = await fetch(url);
        let data = await response.json();
        const humidity = document.getElementsByClassName('humidity-percent');
        const wind = document.getElementsByClassName('wind-rate');
        const temperatureElement = document.getElementsByClassName('weather-temp');
        const location = document.getElementsByClassName('weather-location');

        humidity[0].innerHTML = data.main.humidity + ' %';
        wind[0].innerHTML = Math.floor(data.wind.speed) + ' m/hr';

        // Set the temperature in the state
        setTemperature(Math.floor(data.main.temp));

        // Set the temperature unit in the state
        setUnit(unit);

        temperatureElement[0].innerHTML = Math.floor(data.main.temp) + '˚F';
        location[0].innerHTML = data.name;

        // Set the wind speed and unit in the state
        setWind({
            speed: Math.floor(data.wind.speed),
            unit: unit === 'imperial' ? 'm/hr' : 'km/hr',
        });

        if (data.weather[0].icon === '01d' || data.weather[0].icon === '01n') {
            setWicon(clear_icon);
        }
        else if (data.weather[0].icon === '02d' || data.weather[0].icon === '02n') {
            setWicon(cloud_icon);
        }
        else if (data.weather[0].icon === '03d' || data.weather[0].icon === '03n') {
            setWicon(drizzle_icon);
        }
        else if (data.weather[0].icon === '04d' || data.weather[0].icon === '04n') {
            setWicon(drizzle_icon);
        }
        else if (data.weather[0].icon === '09d' || data.weather[0].icon === '09n') {
            setWicon(rain_icon);
        }
        else if (data.weather[0].icon === '10d' || data.weather[0].icon === '10n') {
            setWicon(cloud_icon);
        }
        else if (data.weather[0].icon === '13d' || data.weather[0].icon === '13n') {
            setWicon(snow_icon);
        }
        else {
            setWicon(clear_icon);
        }
    }

    useEffect(() => {
        // Call the search function whenever 'unit' changes
        search();
    }, [unit]); // Add 'unit' as a dependency

    const toggleUnit = () => {
        // Toggle between 'imperial' and 'metric' units
        setUnit(unit === 'imperial' ? 'metric' : 'imperial');
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
                        <div className="humidity-percent">%</div>
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
    )
}

export default WeatherApp