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
    .then((res) => res.json())
    .then((data) => {
      dataDropdown.innerHTML = '<option value="">Select...</option>';
      const items = data.results || data;
      items.forEach((item) => {
        const value = item.code || item.country || item.id || item.name;
        const label = item.name ? `${item.name} (${value})` : value;
        const opt = document.createElement("option");
        opt.value = value;
        opt.textContent = label;
        dataDropdown.appendChild(opt);
      });
      console.log("Dropdown populated:", type);
    })
    .catch((err) => {
      console.error("Dropdown fetch error:", err);
      dataDropdown.innerHTML = '<option value="">Error loading data</option>';
    });
}

// Initialize dropdowns
if (searchDropdown && dataDropdown) {
  searchDropdown.addEventListener("change", () =>
    populateDropdown(searchDropdown.value)
  );
  populateDropdown(searchDropdown.value);
}

// === Unified Search Submit Handler ===
searchForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const query = searchBar.value.trim();
  const type = searchDropdown.value;
  const selected = dataDropdown.value;

  if (!query && !selected) return;
  let endpoint = "";
  if (type === "countries" && selected) {
    endpoint = `/api/countries/${selected}`;
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        console.log("API response for country:", data); // Debug log
        let resultsDiv = document.getElementById("searchResults");
        if (!resultsDiv) {
          resultsDiv = document.createElement("div");
          resultsDiv.id = "searchResults";
          resultsDiv.className = "results-list";
          searchForm.parentNode.appendChild(resultsDiv);
        }
        resultsDiv.innerHTML = "";
        // Fix: always use data.results, never results directly
        if (data && Array.isArray(data.results) && data.results.length > 0) {
          const debugInfo = document.createElement("div");
          debugInfo.style.color = "gray";
          debugInfo.style.fontSize = "0.9em";
          debugInfo.textContent = `Country: ${selected} | Locations returned: ${data.results.length}`;
          resultsDiv.appendChild(debugInfo);
          const grid = document.createElement("div");
          grid.className = "country-grid";
          // Only show cards for locations that match the selected country code
          let count = 0;
          const uniqueIds = new Set();
          for (const loc of data.results) {
            // Only show cards if the location's country matches the selected country code
            if (
              loc.country &&
              typeof loc.country === "string" &&
              loc.country !== selected
            )
              continue;
            if (
              loc.country &&
              typeof loc.country === "object" &&
              loc.country.code &&
              loc.country.code !== selected
            )
              continue;
            if (count >= 10) break;
            if (uniqueIds.has(loc.id)) continue;
            uniqueIds.add(loc.id);
            count++;
            const summaryCard = document.createElement("div");
            summaryCard.className = "country-card";
            let summaryHtml = `<h3>${
              loc.name || loc.location || "Air Quality"
            }</h3>`;
            if (loc.name || loc.location)
              summaryHtml += `<p><strong>Location:</strong> ${
                loc.name || loc.location
              }</p>`;
            if (loc.city && loc.city !== "-" && loc.city !== "Not listed")
              summaryHtml += `<p><strong>City:</strong> ${loc.city}</p>`;
            if (loc.country)
              summaryHtml += `<p><strong>Country Code:</strong> ${loc.country}</p>`;
            if (
              loc.coordinates &&
              loc.coordinates.latitude &&
              loc.coordinates.longitude
            )
              summaryHtml += `<p><strong>Coordinates:</strong> ${loc.coordinates.latitude}, ${loc.coordinates.longitude}</p>`;
            if (loc.firstUpdated)
              summaryHtml += `<p><strong>First Updated:</strong> ${new Date(
                loc.firstUpdated
              ).toLocaleDateString()}</p>`;
            if (loc.lastUpdated)
              summaryHtml += `<p><strong>Last Updated:</strong> ${new Date(
                loc.lastUpdated
              ).toLocaleDateString()}</p>`;
            let parameters = [];
            if (loc.parameters && Array.isArray(loc.parameters)) {
              parameters = parameters.concat(
                loc.parameters.map((param) => ({
                  id: param.id || "-",
                  name: param.name || param.parameter || "-",
                  units: param.units || "-",
                }))
              );
            }
            if (loc.sensors && Array.isArray(loc.sensors)) {
              parameters = parameters.concat(
                loc.sensors.map((sensor) => {
                  const param = sensor.parameter || {};
                  return {
                    id: param.id || "-",
                    name: param.name || param.parameter || "-",
                    units: param.units || "-",
                  };
                })
              );
            }
            const seen = new Set();
            parameters = parameters.filter((p) => {
              const key = `${p.id}-${p.name}-${p.units}`;
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            });
            if (parameters.length > 0) {
              summaryHtml += "<h4>Air Quality Parameters</h4>";
              summaryHtml +=
                '<table class="aq-params-table"><thead><tr><th>ID</th><th>Name</th><th>Units</th></tr></thead><tbody>';
              parameters.forEach((param) => {
                summaryHtml += `<tr>
          <td>${param.id}</td>
          <td>${param.name}</td>
          <td>${param.units}</td>
         </tr>`;
              });
              summaryHtml += "</tbody></table>";
            } else {
              summaryHtml += "<p>No air quality parameters available.</p>";
            }
            summaryCard.innerHTML = summaryHtml;
            grid.appendChild(summaryCard);
          }
          resultsDiv.appendChild(grid);
          resultsDiv.scrollIntoView({ behavior: "smooth" });
        } else {
          resultsDiv.textContent = "No locations found or no data returned.";
          console.warn("No data returned from API:", data);
        }
      })
      .catch((err) => {
        let resultsDiv = document.getElementById("searchResults");
        if (!resultsDiv) {
          resultsDiv = document.createElement("div");
          resultsDiv.id = "searchResults";
          resultsDiv.className = "results-list";
          searchForm.parentNode.appendChild(resultsDiv);
        }
        // Show a more helpful error message if err.response?.data?.error exists
        let errorMsg = "Error fetching locations: ";
        if (err.response && err.response.data && err.response.data.error) {
          errorMsg += err.response.data.error;
        } else if (err.message) {
          errorMsg += err.message;
        } else {
          errorMsg += "Unknown error.";
        }
        resultsDiv.textContent = errorMsg;
        console.error("Search error:", err);
      });
  } else if (type === "countries") {
    endpoint = `/api/countries?search=${encodeURIComponent(
      query
    )}`;
  } else if (type === "instruments") {
    endpoint = `/api/instruments?search=${encodeURIComponent(
      query
    )}`;
  } else if (type === "manufacturers") {
    endpoint = `/api/manufacturers?search=${encodeURIComponent(
      query
    )}`;
  }
  if (endpoint && type !== "countries") {
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        console.log("API response for", type, ":", data); // Debug log
        let resultsDiv = document.getElementById("searchResults");
        if (!resultsDiv) {
          resultsDiv = document.createElement("div");
          resultsDiv.id = "searchResults";
          resultsDiv.className = "results-list";
          searchForm.parentNode.appendChild(resultsDiv);
        }
        resultsDiv.innerHTML = "";
        const items = data.results || data;
        if (items && items.length > 0) {
          if (searchDropdown.value === "countries") {
            // Display countries in a styled card grid
            const grid = document.createElement("div");
            grid.className = "country-grid";
            items.forEach((item) => {
              const card = document.createElement("div");
              card.className = "country-card";
              let cardHtml = `
         <h3>${item.name || item.location || "Unknown Location"}</h3>
         <p><strong>City:</strong> ${item.city || "-"}</p>
         <p><strong>Country:</strong> ${
           typeof item.country === "string"
             ? item.country
             : item.country?.code || "-"
         }</p>
         <p><strong>Coordinates:</strong> ${
           item.coordinates
             ? `${item.coordinates.latitude}, ${item.coordinates.longitude}`
             : "-"
         }</p>
         <p><strong>First Updated:</strong> ${
           item.firstUpdated
             ? new Date(item.firstUpdated).toLocaleDateString()
             : "-"
         }</p>
         <p><strong>Last Updated:</strong> ${
           item.lastUpdated
             ? new Date(item.lastUpdated).toLocaleDateString()
             : "-"
         }</p>
        `;
              // Collect parameters from both item.parameters and item.sensors
              let parameters = [];
              if (item.parameters && Array.isArray(item.parameters)) {
                parameters = parameters.concat(
                  item.parameters.map((param) => ({
                    id: param.id || "-",
                    name: param.name || param.parameter || "-",
                    units: param.units || "-",
                  }))
                );
              }
              if (item.sensors && Array.isArray(item.sensors)) {
                parameters = parameters.concat(
                  item.sensors.map((sensor) => {
                    const param = sensor.parameter || {};
                    return {
                      id: param.id || "-",
                      name: param.name || param.parameter || "-",
                      units: param.units || "-",
                    };
                  })
                );
              }
              // Remove duplicates by id+name+units
              const seen = new Set();
              parameters = parameters.filter((p) => {
                const key = `${p.id}-${p.name}-${p.units}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
              });
              // Add parameters section as a table if available
              if (parameters.length > 0) {
                cardHtml += "<h4>Parameters</h4>";
                cardHtml +=
                  '<table class="aq-params-table"><thead><tr><th>ID</th><th>Name</th><th>Units</th></tr></thead><tbody>';
                parameters.forEach((param) => {
                  cardHtml += `<tr>
           <td>${param.id}</td>
           <td>${param.name}</td>
           <td>${param.units}</td>
          </tr>`;
                });
                cardHtml += "</tbody></table>";
              } else {
                cardHtml += "<p>No parameters available.</p>";
              }
              card.innerHTML = cardHtml;
              grid.appendChild(card);
            });
            resultsDiv.appendChild(grid);
          } else {
            // Default list for other types
            items.forEach((item) => {
              const card = document.createElement("div");
              card.className = "country-card";
              let cardHtml = `<h3>${
                item.name || item.code || item.id || "Unknown"
              }</h3>`;
              // Debug: log parameters for each card
              console.log(
                "Parameters for card:",
                item.name || item.code || item.id,
                item.parameters
              );
              // Add parameters section as a table if available
              if (
                item.parameters &&
                Array.isArray(item.parameters) &&
                item.parameters.length > 0
              ) {
                cardHtml += "<h4>Parameters</h4>";
                cardHtml +=
                  '<table class="aq-params-table"><thead><tr><th>Name</th><th>Units</th><th>Display Name</th></tr></thead><tbody>';
                item.parameters.forEach((param) => {
                  cardHtml += `<tr>
           <td>${param.parameter || param.name || param.id || "-"}</td>
           <td>${param.units || "-"}</td>
           <td>${param.displayName || "-"}</td>
          </tr>`;
                });
                cardHtml += "</tbody></table>";
              } else {
                cardHtml += "<p>No parameters available.</p>";
              }
              card.innerHTML = cardHtml;
              resultsDiv.appendChild(card);
            });
          }
        } else {
          resultsDiv.textContent = "No results found or no data returned.";
          console.warn("No data returned from API:", data);
        }
      })
      .catch((err) => {
        let resultsDiv = document.getElementById("searchResults");
        if (!resultsDiv) {
          resultsDiv = document.createElement("div");
          resultsDiv.id = "searchResults";
          resultsDiv.className = "results-list";
          searchForm.parentNode.appendChild(resultsDiv);
        }
        // Show a more helpful error message if err.response?.data?.error exists
        let errorMsg = "Error fetching results: ";
        if (err.response && err.response.data && err.response.data.error) {
          errorMsg += err.response.data.error;
        } else if (err.message) {
          errorMsg += err.message;
        } else {
          errorMsg += "Unknown error.";
        }
        resultsDiv.textContent = errorMsg;
        console.error("Search error:", err);
      });
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

  const total =
    chartData.pollution + chartData.pollen + chartData.aqi + chartData.other;
  const pollutionPercent = (chartData.pollution / total) * 100;
  const pollenPercent = (chartData.pollen / total) * 100;
  const aqiPercent = (chartData.aqi / total) * 100;
  const otherPercent = (chartData.other / total) * 100;

  const chart = pie.querySelector(".chart-data__container");
  chart.style.background = `conic-gradient(
    #0000ff 0% ${pollutionPercent}%,
    #002966 ${pollutionPercent}% ${pollutionPercent + pollenPercent}%,
    #377B2B ${pollutionPercent + pollenPercent}% ${
    pollutionPercent + pollenPercent + aqiPercent
  }%,
    #7AC142 ${pollutionPercent + pollenPercent + aqiPercent}% 100%)`;

  document.getElementById("location").textContent = location.city;
  document.getElementById("region").textContent = location.region;
  document.getElementById("status").textContent = status;
  document.getElementById("message").textContent = message;

  const figcaption = document.querySelector(".portions-data__container");
  figcaption.innerHTML = `
    <div class="portion-item"><div class="portion-color"></div>${pollutionPercent.toFixed(
      1
    )}% Pollution</div>
    <div class="portion-item"><div class="portion-color"></div>${pollenPercent.toFixed(
      1
    )}% Pollen</div>
    <div class="portion-item"><div class="portion-color"></div>${aqiPercent.toFixed(
      1
    )}% AQI</div>
    <div class="portion-item"><div class="portion-color"></div>${otherPercent.toFixed(
      1
    )}% Other</div>`;
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

  items.slice(0, 10).forEach((loc) => {
    const card = document.createElement("div");
    card.className = "country-card";

    let countryCodeDisplay = "-";
    if (typeof loc.country === "string") countryCodeDisplay = loc.country;
    else if (loc.country?.code) countryCodeDisplay = loc.country.code;

    card.innerHTML = `
      <h3>${loc.name || loc.location || "Unknown"}</h3>
      ${loc.city ? `<p><strong>City:</strong> ${loc.city}</p>` : ""}
      ${
        countryCodeDisplay
          ? `<p><strong>Country:</strong> ${countryCodeDisplay}</p>`
          : ""
      }
      ${
        loc.coordinates
          ? `<p><strong>Coordinates:</strong> ${loc.coordinates.latitude}, ${loc.coordinates.longitude}</p>`
          : ""
      }
      ${
        loc.lastUpdated
          ? `<p><strong>Last Updated:</strong> ${new Date(
              loc.lastUpdated
            ).toLocaleDateString()}</p>`
          : ""
      }
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
