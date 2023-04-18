const axios = require('axios');
const config = require('../config');

const { weatherAPIURL, weatherAPIKey } = config;

exports.getWeatherByCity = async (req, res) => {
    const { city } = req.params;
    const currentWeatherUrl = `${weatherAPIURL}/weather?q=${city}&appid=${weatherAPIKey}`;
    const forecastUrl = `${weatherAPIURL}/forecast?q=${city}&appid=${weatherAPIKey}`;
  
    try {
      const [currentWeatherResponse, forecastResponse] = await Promise.all([
        axios.get(currentWeatherUrl),
        axios.get(forecastUrl)
      ]);
  
      const currentWeatherData = currentWeatherResponse.data;
      const forecastData = forecastResponse.data;
  
      // Combine current weather and forecast data into a single object
      const weatherData = {
        current: currentWeatherData,
        forecast: forecastData
      };
  
      res.status(200).json(weatherData);

    } catch (error) {
      console.error(error.response.data);
      res.status(500).json({ message: 'An error occurred while fetching the weather data.' });
    }
}

exports.getWeatherByCoordinates = async (req, res) => {
    const { lat, lon } = req.params;
    const currentWeatherUrl = `${weatherAPIURL}/weather?lat=${lat}&lon=${lon}&appid=${weatherAPIKey}`;
    const forecastUrl = `${weatherAPIURL}/forecast?lat=${lat}&lon=${lon}&appid=${weatherAPIKey}`;
  
    try {
      const [currentWeatherResponse, forecastResponse] = await Promise.all([
        axios.get(currentWeatherUrl),
        axios.get(forecastUrl)
      ]);
  
      const currentWeatherData = currentWeatherResponse.data;
      const forecastData = forecastResponse.data;
  
      // Combine current weather and forecast data into a single object
      const weatherData = {
        current: currentWeatherData,
        forecast: forecastData
      };
  
        res.status(200).json(weatherData);
    } catch (error) {
      const {message} = error.response.data;
        res.status(500).json({ message: message});
    }
}