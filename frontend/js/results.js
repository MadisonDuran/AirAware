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

// Get the form from the search bar input
const form = document.getElementById('searchForm')
const searchBtn = document.getElementById('search-btn')

// Click on the Search button 
function clickSearch(){

}


// Display the AQI container 
function showAQI(){

}

// Display the City Weather Lookup container 
function showLookup(){

}

// Loading page for pie-chart
document.addEventListener("DOMContentLoaded", showPieChart)

// Display the Pie Chart container 
function showPieChart(){
    console.log("pie-chart on load")

    // Grab the element from the pie chart 
    const pie = document.getElementById("pie-data__container");
        
    // Grab values from data attrbuite (return an integer to access data)
    const pollution = parseInt(pie.dataset.pollution);
    const pollen = parseInt(pie.dataset.pollen);
    const aqi = parseInt(pie.dataset.aqi);
    const others = parseInt(pie.dataset.others);

    // Calculate the angles
    const total = pollution + pollen + aqi + others;
    let pollutionPercent = (pollution/total) * 100;
    let pollenPercent = (pollen/total) * 100;
    let aqiPercent = (aqi/total) * 100;
    let othersPercent = (others/total) * 100;

    // Colors changes based by percenatges 
    const chart = pie.querySelector(".chart-data__container");
    chart.style.background = `conic-gradient(
    #0000ff 0% ${pollutionPercent}%,
    #002966 ${pollutionPercent}% ${pollutionPercent + pollenPercent}%,
    #377B2B ${pollutionPercent + pollenPercent}% ${pollutionPercent + pollenPercent + aqiPercent}%,
    #7AC142 ${pollutionPercent + pollenPercent + aqiPercent}% 100%
    )`;

}