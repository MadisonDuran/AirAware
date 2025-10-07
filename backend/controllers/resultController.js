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

    // Fetch pollutant data from OpenAQ
    const openaqResponse = await axios.get(
      `https://api.openaq.org/v3/latest?city=${encodeURIComponent(city)}`,
      {
        headers: {
          'X-API-Key': OPENAQ_API_KEY
        }
      }
    );

    const results = openaqResponse.data.results || [];

    // Initialize pollutant sums
    const pollutants = {
      pm25: 0,
      pm10: 0,
      no2: 0,
      so2: 0,
      o3: 0,
      co: 0
    };

    // Sum up measurements (if multiple locations for the city)
    results.forEach(location => {
      (location.measurements || []).forEach(measurement => {
        const param = measurement.parameter.toLowerCase();
        if (pollutants.hasOwnProperty(param)) {
          pollutants[param] += measurement.value;
        }
      });
    });

    // Simple AQI status estimation based on PM2.5 (µg/m³)
    let status = 'Unknown';

    if (pollutants.pm25 <= 12) {
    status = 'Good';
    } else if (pollutants.pm25 <= 35.4) {
    status = 'Moderate';
    } else if (pollutants.pm25 <= 55.4) {
    status = 'Unhealthy for Sensitive Groups';
    } else if (pollutants.pm25 <= 150.4) {
    status = 'Unhealthy';
    } else if (pollutants.pm25 <= 250.4) {
    status = 'Very Unhealthy';
    } else {
    status = 'Hazardous';
    }

    // Combine both sets of data
    const combined = {
      aqi: {
        status: aqiData.status,
        pm10: pollutants.pm10,
        no2: pollutants.no2
      },
      weather: {
        temperature: weather.temp,
        condition: weather.weather.description,
        humidity: weather.rh,
        wind_speed: weather.wind_spd
      },
      chart: {
       pm25: pollutants.pm25,
        pm10: pollutants.pm10,
        no2: pollutants.no2,
        so2: pollutants.so2,
        o3: pollutants.o3,
        co: pollutants.co
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

