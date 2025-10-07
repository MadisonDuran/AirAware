// === Sidebar controls ===
function showSidebar() {
  document.querySelector(".sidebar").style.display = "flex";
}
function hideSidebar() {
  document.querySelector(".sidebar").style.display = "none";
}

// === DOM elements ===
const searchForm = document.getElementById("searchForm");
const searchBar = document.getElementById("search-bar");
const searchDropdown = document.getElementById("searchDropdown");
const dataDropdown = document.getElementById("dataDropdown");

// === Populate dropdown for OpenAQ ===
function populateDropdown(type) {
  let endpoint = "";
  if (type === "countries") {
    endpoint = "/api/countries";
  } else if (type === "instruments") {
    endpoint = "api/instruments";
  } else if (type === "manufacturers") {
    endpoint = "/api/manufacturers";
  } else {
    dataDropdown.innerHTML = '<option value="">Select...</option>';
    return;
  }

  fetch(endpoint)
    .then(res => res.json())
    .then(data => {
      dataDropdown.innerHTML = '<option value="">Select...</option>';
      const items = data.results || data;
      items.forEach(item => {
        const value = item.code || item.country || item.id || item.name;
        const label = item.name ? `${item.name} (${value})` : value;
        const opt = document.createElement("option");
        opt.value = value;
        opt.textContent = label;
        dataDropdown.appendChild(opt);
      });
      console.log("Dropdown populated:", type);
    })
    .catch(err => {
      console.error("Dropdown fetch error:", err);
      dataDropdown.innerHTML = '<option value="">Error loading data</option>';
    });
}

// Initialize dropdowns
if (searchDropdown && dataDropdown) {
  searchDropdown.addEventListener("change", () => populateDropdown(searchDropdown.value));
  populateDropdown(searchDropdown.value);
}

// === Unified Search Submit Handler ===
searchForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const query = searchBar.value.trim();
  const type = searchDropdown.value;
  const selected = dataDropdown.value;

  // If user entered a city → Weather API
  if (query && !selected) {
    try {
      const response = await fetch(`/api/search/${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("City not found");

      const data = await response.json();
      updateWeatherSection(data.weather);
      updateAQISection(data.aqi);
      updatePieChart(data.chart, data.location, data.aqi.status, data.message);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch weather data.");
    }
    return;
  }

  // If user selected dropdowns → OpenAQ API
  if (selected || type) {
    let endpoint = "";
    if (type === "countries" && selected) {
      endpoint = `/api/countries/${selected}`;
    } else if (type === "countries") {
      endpoint = `/api/countries?search=${encodeURIComponent(query)}`;
    } else if (type === "instruments") {
      endpoint = `/api/instruments?search=${encodeURIComponent(query)}`;
    } else if (type === "manufacturers") {
      endpoint = `/api/manufacturers?search=${encodeURIComponent(query)}`;
    }

    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      showOpenAQResults(data, type, selected);
    } catch (err) {
      console.error("OpenAQ fetch error:", err);
      showErrorMessage("Error fetching OpenAQ data.");
    }
  }
});

// === Weather update functions ===
function updateWeatherSection(weather) {
  const section = document.getElementById("bottom-data__section");
  section.innerHTML = `
    <div class="info-data__container">
      <h2>City Weather Lookup</h2>
      <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
      <p><strong>Condition:</strong> ${weather.condition}</p>
      <p><strong>Humidity:</strong> ${weather.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${weather.wind_speed} m/s</p>
    </div>`;
}

function updateAQISection(aqi) {
  const section = document.getElementById("top-data__section");
  section.innerHTML = `
    <div class="info-data__container">
      <h2>Air Quality Index (AQI)</h2>
      <p><strong>Status:</strong> ${aqi.status}</p>
      <p><strong>Tree pollen:</strong> ${aqi.tree_pollen}</p>
      <p><strong>Grass pollen:</strong> ${aqi.grass_pollen}</p>
    </div>`;
}

function updatePieChart(chartData, location, status, message) {
  const pie = document.getElementById("pie-data__container");
  if (!pie) return;

  const total = chartData.pollution + chartData.pollen + chartData.aqi + chartData.other;
  const pollutionPercent = (chartData.pollution / total) * 100;
  const pollenPercent = (chartData.pollen / total) * 100;
  const aqiPercent = (chartData.aqi / total) * 100;
  const otherPercent = (chartData.other / total) * 100;

  const chart = pie.querySelector(".chart-data__container");
  chart.style.background = `conic-gradient(
    #0000ff 0% ${pollutionPercent}%,
    #002966 ${pollutionPercent}% ${pollutionPercent + pollenPercent}%,
    #377B2B ${pollutionPercent + pollenPercent}% ${pollutionPercent + pollenPercent + aqiPercent}%,
    #7AC142 ${pollutionPercent + pollenPercent + aqiPercent}% 100%)`;

  document.getElementById("location").textContent = location.city;
  document.getElementById("region").textContent = location.region;
  document.getElementById("status").textContent = status;
  document.getElementById("message").textContent = message;

  const figcaption = document.querySelector(".portions-data__container");
  figcaption.innerHTML = `
    <div class="portion-item"><div class="portion-color"></div>${pollutionPercent.toFixed(1)}% Pollution</div>
    <div class="portion-item"><div class="portion-color"></div>${pollenPercent.toFixed(1)}% Pollen</div>
    <div class="portion-item"><div class="portion-color"></div>${aqiPercent.toFixed(1)}% AQI</div>
    <div class="portion-item"><div class="portion-color"></div>${otherPercent.toFixed(1)}% Other</div>`;
}

// === OpenAQ Results Renderer ===
function showOpenAQResults(data, type, selected) {
  let resultsDiv = document.getElementById("searchResults");
  if (!resultsDiv) {
    resultsDiv = document.createElement("div");
    resultsDiv.id = "searchResults";
    resultsDiv.className = "results-list";
    searchForm.parentNode.appendChild(resultsDiv);
  }
  resultsDiv.innerHTML = "";

  const items = data.results || data;
  if (!items || items.length === 0) {
    resultsDiv.textContent = "No results found.";
    return;
  }

  const grid = document.createElement("div");
  grid.className = "country-grid";

  items.slice(0, 10).forEach(loc => {
    const card = document.createElement("div");
    card.className = "country-card";

    let countryCodeDisplay = "-";
    if (typeof loc.country === "string") countryCodeDisplay = loc.country;
    else if (loc.country?.code) countryCodeDisplay = loc.country.code;

    card.innerHTML = `
      <h3>${loc.name || loc.location || "Unknown"}</h3>
      ${loc.city ? `<p><strong>City:</strong> ${loc.city}</p>` : ""}
      ${countryCodeDisplay ? `<p><strong>Country:</strong> ${countryCodeDisplay}</p>` : ""}
      ${loc.coordinates ? `<p><strong>Coordinates:</strong> ${loc.coordinates.latitude}, ${loc.coordinates.longitude}</p>` : ""}
      ${loc.lastUpdated ? `<p><strong>Last Updated:</strong> ${new Date(loc.lastUpdated).toLocaleDateString()}</p>` : ""}
    `;

    grid.appendChild(card);
  });

  resultsDiv.appendChild(grid);
  resultsDiv.scrollIntoView({ behavior: "smooth" });
}

// === Error Display Helper ===
function showErrorMessage(msg) {
  let resultsDiv = document.getElementById("searchResults");
  if (!resultsDiv) {
    resultsDiv = document.createElement("div");
    resultsDiv.id = "searchResults";
    resultsDiv.className = "results-list";
    searchForm.parentNode.appendChild(resultsDiv);
  }
  resultsDiv.textContent = msg;
}
