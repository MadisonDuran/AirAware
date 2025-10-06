const axios = require('axios');
require('dotenv').config();

const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY;
const OPENAQ_API_KEY = process.env.OPENAQ_API_KEY;

exports.getCityWeather = async (req, res) => {
  const city = req.params.city;

  try {
    // Fetch from Weatherbit API
    const weatherResponse = await axios.get(
      `https://api.weatherbit.io/v2.0/current?city=${encodeURIComponent(city)}&key=${WEATHERBIT_API_KEY}`
    );
    const weather = weatherResponse.data.data[0];

    // Mock AQI/pollen data — replace this with actual OpenAQ or another API if needed
    const aqiData = {
      status: "Moderate",
      tree_pollen: 120,
      grass_pollen: 90,
      pollution: 40,
      pollen: 30,
      aqi: 20,
      other: 10,
      region: "North Carolina",
      message: "Air quality is acceptable."
    };

    // Combine both sets of data
    const combined = {
      aqi: {
        status: aqiData.status,
        tree_pollen: aqiData.tree_pollen,
        grass_pollen: aqiData.grass_pollen
      },
      weather: {
        temperature: weather.temp,
        condition: weather.weather.description,
        humidity: weather.rh,
        wind_speed: weather.wind_spd
      },
      chart: {
        pollution: aqiData.pollution,
        pollen: aqiData.pollen,
        aqi: aqiData.aqi,
        other: aqiData.other
      },
      location: {
        city: weather.city_name,
        region: weather.state_code || weather.country_code || 'Unknown'
      },
      message: aqiData.message || 'Stay informed.'
    };

    res.json(combined);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch city data.' });
  }
};

