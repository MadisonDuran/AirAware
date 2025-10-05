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

// Get elements from the Search Form
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('search-bar');
const searchError = document.getElementById('search-error');

// Get elements from the Display Content
const topContent = document.getElementById('top-content');
const bottomContent = document.getElementById('bottom-content');
const pieContent = document.getElementById('pie-content');

// Clear out previous results and errors
function clearResults() {
    topContent.innerHTML = '';
    bottomContent.innerHTML = '';
    pieContent.innerHTML = '';
    searchError.textContent = '';
    searchInput.classList.remove('error');
}

// Handle form submit
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearResults();

    const location = searchInput.value.trim();
    if (!location) {
        searchInput.classList.add('error');
        searchError.textContent = 'Require location';
        return;
    }

    fetch('/search?location=' + encodeURIComponent(location))
        .then((response) => {
            if (!response.ok) throw new Error('Network is not responding');
            return response.json();
        })
        .then((data) => {
            // --- TOP SECTION ---
            if (topImage) topImage.style.display = 'none';
            topContent.style.display = '';
            topContent.innerHTML = '';

            const h2Top = document.createElement('h2');
            h2Top.textContent = 'Air Quality Index (AQI)';

            const pStatus = document.createElement('p');
            pStatus.innerHTML = `<strong>Status:</strong> ${data.status}`;

            const pTree = document.createElement('p');
            pTree.innerHTML = `<strong>Tree pollen:</strong> ${data.treePollen}`;

            const pGrass = document.createElement('p');
            pGrass.innerHTML = `<strong>Grass pollen:</strong> ${data.grassPollen}`;
            
            topContent.append(h2Top, pStatus, pTree, pGrass);

            // --- BOTTOM SECTION ---
            if (bottomImage) bottomImage.style.display = 'none';
            bottomContent.style.display = '';
            bottomContent.innerHTML = '';

            const h2Bottom = document.createElement('h2');
            h2Bottom.textContent = 'City Weather Lookup';

            const pTemp = document.createElement('p');
            pTemp.innerHTML = `<strong>Temperature:</strong> ${data.temperature}`;

            const pCond = document.createElement('p');
            pCond.innerHTML = `<strong>Condition:</strong> ${data.condition}`;

            const pHum = document.createElement('p');
            pHum.innerHTML = `<strong>Humidity:</strong> ${data.humidity}`;

            const pWind = document.createElement('p');
            pWind.innerHTML = `<strong>Wind Speed:</strong> ${data.windSpeed}`;

            bottomContent.append(h2Bottom, pTemp, pCond, pHum, pWind);

            // --- PIE SECTION ---
            if (pieImage) pieImage.style.display = 'none';
            pieContent.style.display = '';
            pieContent.innerHTML = '';

            const h2Pie = document.createElement('h2');
            h2Pie.textContent = data.location_name || location;

            const h3Region = document.createElement('h3');
            h3Region.textContent = data.region || '';

            const pStatusMsg = document.createElement('p');
            pStatusMsg.id = 'message';

            pStatusMsg.textContent = data.message || data.summary || '';

            pieContent.append(h2Pie, h3Region, pStatusMsg);

            if (data.pie) {
                const fig = document.createElement('figure');
                fig.id = 'pie-data__container';
                fig.dataset.pollution = data.pie.pollution ?? 0;
                fig.dataset.pollen = data.pie.pollen ?? 0;
                fig.dataset.aqi = data.pie.aqi ?? 0;
                fig.dataset.others = data.pie.others ?? 0;

                const chartDiv = document.createElement('div');
                chartDiv.className = 'chart-data__container';

                const labelDiv = document.createElement('div');
                labelDiv.className = 'chart-label';
                
                labelDiv.textContent = '100%';
                chartDiv.appendChild(labelDiv);
                fig.appendChild(chartDiv);
                pieContent.appendChild(fig);

                const portions = [
                    { label: 'Pollution', value: data.pie.pollution },
                    { label: 'Pollen', value: data.pie.pollen },
                    { label: 'AQI', value: data.pie.aqi },
                    { label: 'Other', value: data.pie.others },
                ];
                const total = portions.reduce((sum, p) => sum + p.value, 0) || 1;
                const figcap = document.createElement('figcaption');
                figcap.className = 'portions-data__container';
                portions.forEach((p) => {
                    const percent = Math.round((p.value / total) * 100);
                    const item = document.createElement('div');
                    item.className = 'portion-item';
                    item.innerHTML = `<div class="portion-color"></div>${percent}% ${p.label}`;
                    figcap.appendChild(item);
                });
                pieContent.appendChild(figcap);

                // Render the conic-gradient
                const pollutionPercent = (data.pie.pollution / total) * 100;
                const pollenPercent = (data.pie.pollen / total) * 100;
                const aqiPercent = (data.pie.aqi / total) * 100;
                const chart = fig.querySelector('.chart-data__container');
                chart.style.background = `conic-gradient(
                    #0000ff 0% ${pollutionPercent}%,
                    #002966 ${pollutionPercent}% ${pollutionPercent + pollenPercent}%,
                    #377B2B ${pollutionPercent + pollenPercent}% ${pollutionPercent + pollenPercent + aqiPercent}%,
                    #7AC142 ${pollutionPercent + pollenPercent + aqiPercent}% 100%
                )`;
            }
        })
        .catch((error) => {
            console.log('Fetch failed:', error);
            searchError.textContent = 'Failed to fetch results. Please try again.';
        });
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
