const axios = require('axios');
require('dotenv').config();

const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY;

async function getCityWeather(req, res) {
  const city = req.params.city;

  try {
    const response = await axios.get(
      `https://api.weatherbit.io/v2.0/current?city=${encodeURIComponent(city)}&key=${WEATHERBIT_API_KEY}`
    );

    const weatherData = response.data.data[0];

    const result = {
      city: weatherData.city_name,
      country: weatherData.country_code,
      temperature: weatherData.temp,
      description: weatherData.weather.description,
      humidity: weatherData.rh,
      wind_speed: weatherData.wind_spd,
      datetime: weatherData.ob_time
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching weather:', error.message);
    res.status(500).json({ error: 'Unable to fetch weather data' });
  }
}

module.exports = { getCityWeather };
