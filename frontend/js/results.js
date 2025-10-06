document.addEventListener('DOMContentLoaded', () => {
  // Mobile Sidebar controls
  const showSidebar = () => document.querySelector(".sidebar").style.display = "flex";
  const hideSidebar = () => document.querySelector(".sidebar").style.display = "none";
  window.showSidebar = showSidebar;
  window.hideSidebar = hideSidebar;

  // Elements
  const routesSelect = document.getElementById('routes');
  const countriesSelect = document.getElementById('countries');
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('search-bar');
  const searchError = document.getElementById('search-error');

  const topContent = document.getElementById('top-content');
  const bottomContent = document.getElementById('bottom-content');
  const pieContent = document.getElementById('pie-content');

  const topImage = document.querySelector('#top-data__section .clipart-Icon');
  const bottomImage = document.querySelector('#bottom-data__section .clipart-Icon');
  const pieImage = document.getElementById('clipart-pie');

  let dynamicSelect = null;

  // ---------- Helpers ----------
  const showImage = (img) => img && (img.style.display = '');
  const hideImage = (img) => img && (img.style.display = 'none');

  const clearSection = (section) => {
    section.innerHTML = '';
    section.style.display = 'none';
  };

  const showSection = (section) => section.style.display = '';

  const fetchJson = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
    return res.json();
  };

  // ---------- Dynamic Select Setup ----------
  const ensureDynamicSelect = () => {
    if (dynamicSelect) return dynamicSelect;

    dynamicSelect = document.createElement('select');
    dynamicSelect.id = 'dynamic-select';
    dynamicSelect.innerHTML = '<option value="">-- choose an option --</option>';
    routesSelect.insertAdjacentElement('afterend', dynamicSelect);

    return dynamicSelect;
  };

  // Populate a select with fetched options
  const populateSelect = (select, items, getLabel, getValue) => {
    select.innerHTML = '<option value="">-- choose an option --</option>';
    items.forEach(item => {
      const opt = document.createElement('option');
      opt.value = getValue(item);
      opt.textContent = getLabel(item);
      select.appendChild(opt);
    });
  };

  // ---------- Event Handlers ----------

  // Handle route changes
  routesSelect.addEventListener('change', async (e) => {
    const route = e.target.value;

    if (route === 'countries') {
      if (dynamicSelect) dynamicSelect.style.display = 'none';
      countriesSelect.style.display = '';
      return;
    }

    countriesSelect.style.display = 'none';
    const ds = ensureDynamicSelect();
    ds.style.display = '';
    ds.disabled = true;
    ds.innerHTML = '<option>Loading...</option>';

    try {
      const data = await fetchJson(`/api/${route}`);
      const items = data.results || data;
      if (route === 'instruments') {
        populateSelect(ds, items, i => i.name || i.model, i => i.id);
      } else if (route === 'manufacturers') {
        populateSelect(ds, items, i => i.name, i => i.id);
      }
      ds.disabled = false;
    } catch (err) {
      console.error(err);
      ds.innerHTML = '<option>Failed to load</option>';
    }

    ds.addEventListener('change', () => {
      const opt = ds.selectedOptions[0];
      if (!opt || !opt.value) return;

      clearSection(topContent);
      hideImage(topImage);
      showSection(topContent);

      topContent.innerHTML = `
        <h2>${opt.textContent}</h2>
        <p><small>ID: ${opt.value}</small></p>
      `;
    });
  });

  // Handle country selection → Pie section
  countriesSelect.addEventListener('change', (e) => {
    const country = e.target.value;
    if (!country) return;

    clearSection(pieContent);
    hideImage(pieImage);
    showSection(pieContent);

    // Static example data
    const pieValues = { No:{$units}, No2:{$units}, Pm10:{$units}, Pm25:{$units} };
    const total = Object.values(pieValues).reduce((a, b) => a + b, 0);

    const NoPercent = (pieValues.No / total) * 100;
    const No2Percent = (pieValues.No2 / total) * 100;
    const Pm10Percent = (pieValues.Pm10 / total) * 100;
    const Pm25Percent = (pieValues.Pm25 / total) * 100;

    pieContent.innerHTML = `
      <h2>${country}</h2>
      <figure id="pie-data__container">
        <div class="chart-data__container"></div>
      </figure>
      <figcaption class="portions-data__container">
        <div>No: ${pieValues.No}%</div>
        <div>No2: ${pieValues.No2}%</div>
        <div>Pm10: ${pieValues.Pm10}%</div>
        <div>Pm25: ${pieValues.Pm25}%</div>
      </figcaption>
    `;

    const chart = pieContent.querySelector('.chart-data__container');
    chart.style.background = `conic-gradient(
      #0000ff ${NoPercent}%,
      #002966 ${NoPercent}% ${NoPercent + No2Percent}%,
      #377B2B ${NoPercent + No2Percent}% ${NoPercent + No2Percent + Pm10Percent}%,
      #7AC142 ${NoPercent + No2Percent + Pm10Percent + Pm25Percent }% 
    )`;
  });

  // Handle search form → Weather section
  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    searchError.textContent = '';
    const location = searchInput.value.trim();

    if (!location) {
      searchError.textContent = 'Please enter a location';
      return;
    }

    try {
      const WeatherData = await fetchJson(`/api/search/${encodeURIComponent(location)}`);
      const description = WeatherData.weather.description;
      const country = WeatherData.country_code;
      const datetime = WeatherData.ob_time;
      const humidity = WeatherData.rh;
      const wind = WeatherData.wind_spd;
      const temperature = WeatherData.temp;

      clearSection(bottomContent);
      hideImage(bottomImage);
      showSection(bottomContent);

      bottomContent.innerHTML = `
        <h2>Weather in ${location}, ${country} </h2>
        <p><strong>Temperature:</strong> ${temperature}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Humidity:</strong> ${humidity}</p>
        <p><strong>Wind Speed:</strong> ${wind}</p>
        <p><strong>Time:</strong> ${datetime}</p>
      `;
    } catch (err) {
      console.error(err);
      searchError.textContent = 'Failed to fetch weather data';
    }
  });

  // ---------- Initial State ----------
  clearSection(topContent);
  clearSection(bottomContent);
  clearSection(pieContent);
  showImage(topImage);
  showImage(bottomImage);
  showImage(pieImage);
});


// searchForm.addEventListener('submit', (e) => {              // User click on button 
//     e.preventDefault()

//     const searchForm = search.value                         // User location value input 
//     fetch('/search?location=' + encodeURIComponent(''))
//     .then((response) => response.json())
//     .then((data) => {
//         if (value === "") {
//             showError("Require location");
//             return false;
//         } else {
//             const showAQI = document.querySelector('top-data__section');
//             const showWeather = document.querySelector('bottom-data__section');
//             const showPieChart = document.querySelector('pie-data__container');
//             searchContainer.textContent = ''                                    

//             forEach(data => {                               
//                 const topData = document.createElement(showAQI);    
//                 topData.innerHTML = 
//                 `   <h2>Air Quality Index (AQI)</h2>
//                     <p><strong>Status:</strong> ${data.display} </p>
//                     <p><strong>Tree pollen:</strong> ${data.display}</p>
//                     <p><strong>Grass pollen:</strong> ${data.display}</p>`
//                 searchContainer.appendChild(topData);
//             });

//             forEach(data => {                               
//                 const bottomData = document.createElement(showWeather);   
//                 bottomData.innerHTML = 
//                 `   <h2>City Weather Lookup</h2>
//                     <p><strong>Temperature: </strong> ${data.display}</p>
//                     <p><strong>Condition: </strong> ${data.display}</p>
//                     <p><strong>Humidity: </strong> ${data.display}</p>
//                     <p><strong>Wind Speed: </strong> ${data.display}</p>`
//                 searchContainer.appendChild(bottomData);
//             });

//             forEach(data => {     
//                 // Loading page for pie-chart
//                 document.addEventListener("DOMContentLoaded", showPieChart)

//                 // Display the Pie Chart container 
//                 function showPieChart(){
//                     console.log("pie-chart on load")

//                     // Grab the element from the pie chart 
//                     const pie = document.getElementById("pie-data__container");
                        
//                     // Grab values from data attrbuite (return an integer to access data)
//                     const pollution = parseInt(pie.dataset.pollution);
//                     const pollen = parseInt(pie.dataset.pollen);
//                     const aqi = parseInt(pie.dataset.aqi);
//                     const others = parseInt(pie.dataset.others);

//                     // Calculate the angles
//                     const total = pollution + pollen + aqi + others;
//                     let pollutionPercent = (pollution/total) * 100;
//                     let pollenPercent = (pollen/total) * 100;
//                     let aqiPercent = (aqi/total) * 100;
//                     let othersPercent = (others/total) * 100;

//                     // Colors changes based by percenatges 
//                     const chart = pie.querySelector(".chart-data__container");
//                     chart.style.background = `conic-gradient(
//                     #0000ff 0% ${pollutionPercent}%,
//                     #002966 ${pollutionPercent}% ${pollutionPercent + pollenPercent}%,
//                     #377B2B ${pollutionPercent + pollenPercent}% ${pollutionPercent + pollenPercent + aqiPercent}%,
//                     #7AC142 ${pollutionPercent + pollenPercent + aqiPercent}% 100%
//                     )`;

//                 }                          
//                 const pieChart = document.createElement(showPieChart);   
//                 pieChart.innerHTML = 
//                 ` <h2 id="location">Charlotte</h2>
//                   <h3 id="region">North Carolina</h3>
            
//                 // <!-- Pie Chart -->
//                 <figure id ="pie-data__container"
//                         data-pollution="60"
//                         data-pollen="30"
//                         data-aqi="10"
//                         data-other="5">
//                     <div class="chart-data__container">
//                         <div class="chart-label" id="chart-label">100%</div>
//                     </div>
//                 </figure>
            
//                 // <!-- The data/labels items -->
//                 <figcaption class="portions-data__container">
//                     <div class="portion-item"><div class="portion-color"></div>60% Pollution</div>
//                     <div class="portion-item"><div class="portion-color"></div>30% Pollen</div>
//                     <div class="portion-item"><div class="portion-color"></div>10% AQI</div>
//                     <div class="portion-item"><div class="portion-color"></div>5% Other</div>
//                 </figcaption>
                
//                 // <!-- Endpoint of the Chart -->    
            
//                 <h3 id="status">Good</h3>
//                 <p id="message">You can breathe easily in this area</p>`
//                 searchContainer.appendChild(pieChart);
//             });
//         }
//     })

//     .catch((error) => {
//         console.log('Fetch failed:', error);
//     });
// });
