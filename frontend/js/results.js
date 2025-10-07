// // Show the sidebar from mobile view 
// function showSidebar() {
//   const sidebar = document.querySelector(".sidebar");
//   sidebar.style.display = "flex";
// }

// // Hide the sidebar from mobile view 
// function hideSidebar() {
//   const sidebar = document.querySelector(".sidebar");
//   sidebar.style.display = "none";
// }

// // // Get the form from the search bar input
// // const form = document.getElementById('searchForm')
// // const searchBtn = document.getElementById('search-btn')

// // // Click on the Search button 
// // function clickSearch(){

// // }


// // // Display the AQI container 
// // function showAQI(){

// // }

// // // Display the City Weather Lookup container 
// // function showLookup(){

// // }

// // // Loading page for pie-chart
// // document.addEventListener("DOMContentLoaded", showPieChart)

// // // Display the Pie Chart container 
// // function showPieChart(){
// //     console.log("pie-chart on load")


//     // Grab the element from the pie chart 
//     const pie = document.getElementById("pie-data__container");
        
//     // Grab values from data attrbuite (return an integer to access data)
//     const pollution = parseInt(pie.dataset.pollution);
//     const pollen = parseInt(pie.dataset.pollen);
//     const aqi = parseInt(pie.dataset.aqi);
//     const others = parseInt(pie.dataset.others);

//     // Calculate the angles
//     const total = pollution + pollen + aqi + others;
//     let pollutionPercent = (pollution/total) * 100;
//     let pollenPercent = (pollen/total) * 100;
//     let aqiPercent = (aqi/total) * 100;
//     let othersPercent = (others/total) * 100;

//     // Colors changes based by percenatges 
//     const chart = pie.querySelector(".chart-data__container");
//     chart.style.background = `conic-gradient(
//     #0000ff 0% ${pollutionPercent}%,
//     #002966 ${pollutionPercent}% ${pollutionPercent + pollenPercent}%,
//     #377B2B ${pollutionPercent + pollenPercent}% ${pollutionPercent + pollenPercent + aqiPercent}%,
//     #7AC142 ${pollutionPercent + pollenPercent + aqiPercent}% 100%
//     )`;

// }

// Show the sidebar from mobile view 
function showSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "flex";
}

// Hide the sidebar from mobile view 
function hideSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "none";
}

// 1. Main form submit listener (search logic)
document.getElementById('searchForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const city = document.getElementById('search-bar').value.trim();
  if (!city) return alert('Please enter a city');

  try {
    const response = await fetch(`http://localhost:5000/api/search/${encodeURIComponent(city)}`);
    if (!response.ok) throw new Error('City not found');

    const data = await response.json();

    updateWeatherSection(data.weather);
    updateAQISection(data.aqi);
    updatePieChart(data.chart, data.location, data.aqi.status, data.message);

    // Optional: hide cover image if needed
    // hideCoverImage();

  } catch (err) {
    console.error(err);
    alert('Failed to fetch city data. Please try again.');
  }
});

// 2. Update the Weather Section
function updateWeatherSection(weather) {
  const weatherSection = document.getElementById('bottom-data__section');

  weatherSection.innerHTML = `
    <div class="info-data__container">
      <h2>City Weather Lookup</h2>
      <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
      <p><strong>Condition:</strong> ${weather.condition}</p>
      <p><strong>Humidity:</strong> ${weather.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${weather.wind_speed} m/s</p>
    </div>
  `;
}

// 3. Update the AQI Section
function updateAQISection(aqi) {
  const aqiSection = document.getElementById('top-data__section');

  aqiSection.innerHTML = `
    <div class="info-data__container">
      <h2>Air Quality Index (AQI)</h2>
      <p><strong>Status:</strong> ${aqi.status}</p>
      <p><strong>Tree pollen:</strong> ${aqi.tree_pollen}</p>
      <p><strong>Grass pollen:</strong> ${aqi.grass_pollen}</p>
    </div>
  `;
}

// 4. Update the Pie Chart
function updatePieChart(chartData, location, status, message) {
  const pie = document.getElementById("pie-data__container");

  // Update data attributes
  pie.dataset.pollution = chartData.pollution;
  pie.dataset.pollen = chartData.pollen;
  pie.dataset.aqi = chartData.aqi;
  pie.dataset.other = chartData.other; // match HTML attribute name

  // Update location info
  document.getElementById("location").textContent = location.city;
  document.getElementById("region").textContent = location.region;
  document.getElementById("status").textContent = status;
  document.getElementById("message").textContent = message;

  const total = chartData.pollution + chartData.pollen + chartData.aqi + chartData.other;
  const pollutionPercent = (chartData.pollution / total) * 100;
  const pollenPercent = (chartData.pollen / total) * 100;
  const aqiPercent = (chartData.aqi / total) * 100;
  const otherPercent = (chartData.other / total) * 100;

  // Update chart gradient
  const chart = pie.querySelector(".chart-data__container");
  chart.style.background = `conic-gradient(
    #0000ff 0% ${pollutionPercent}%,
    #002966 ${pollutionPercent}% ${pollutionPercent + pollenPercent}%,
    #377B2B ${pollutionPercent + pollenPercent}% ${pollutionPercent + pollenPercent + aqiPercent}%,
    #7AC142 ${pollutionPercent + pollenPercent + aqiPercent}%
  )`;

  // Update center label
  const label = chart.querySelector(".chart-label");
  label.textContent = "100%";

  // Update chart labels
const figcaption = document.querySelector(".portions-data__container");
  figcaption.innerHTML = `
    <div class="portion-item"><div class="portion-color"></div>${pollutionPercent.toFixed(1)}% Pollution</div>
    <div class="portion-item"><div class="portion-color"></div>${pollenPercent.toFixed(1)}% Pollen</div>
    <div class="portion-item"><div class="portion-color"></div>${aqiPercent.toFixed(1)}% AQI</div>
    <div class="portion-item"><div class="portion-color"></div>${otherPercent.toFixed(1)}% Other</div>
  `;
}

// 5. Optional: Hide the intro image on search
function hideCoverImage() {
  const cover = document.getElementById('cover-image');
  if (cover) cover.style.display = 'none';
}
