// Clean results.js - single-file implementation
// Maps: countries -> pie, search -> weather (bottom), instruments/manufacturers -> top

function showSidebar() { const s = document.querySelector('.sidebar'); if (s) s.style.display = 'flex'; }
function hideSidebar() { const s = document.querySelector('.sidebar'); if (s) s.style.display = 'none'; }

document.addEventListener('DOMContentLoaded', () => {
  const routesSelect = document.getElementById('routes');
  const countriesSelect = document.getElementById('countries');
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('search-bar');
  const searchError = document.getElementById('search-error');
  const filterDetails = document.getElementById('filter-details');

  const topContent = document.getElementById('top-content');
  const bottomContent = document.getElementById('bottom-content');
  const pieContent = document.getElementById('pie-content');
  const topImage = document.querySelector('#top-data__section .clipart-Icon');
  const bottomImage = document.querySelector('#bottom-data__section .clipart-Icon');
  const pieImage = document.getElementById('clipart-pie');

  let dynamicSelect = null;

  function clearSection(el) { if (!el) return; el.innerHTML = ''; el.style.display = 'none'; }
  function showSection(el) { if (el) el.style.display = ''; }
  function showImage(img) { if (img) img.style.display = ''; }
  function hideImage(img) { if (img) img.style.display = 'none'; }

  function ensureDynamicSelect() {
    if (dynamicSelect) return dynamicSelect;
    dynamicSelect = document.createElement('select');
    dynamicSelect.id = 'dynamic-select';
    dynamicSelect.innerHTML = '<option value="">-- choose an option --</option>';
    if (routesSelect && routesSelect.parentNode) routesSelect.parentNode.insertBefore(dynamicSelect, routesSelect.nextSibling);
    dynamicSelect.addEventListener('change', () => {
      const opt = dynamicSelect.selectedOptions[0];
      if (!opt || !opt.value) return;
      if (filterDetails) filterDetails.innerHTML = `<strong>Selected:</strong> ${opt.textContent}` + (opt.dataset.id ? ` <small>(id: ${opt.dataset.id})</small>` : '');
    });
    return dynamicSelect;
  }

  function populateSelect(selectEl, items, labelFn, valueFn, dataAttrsFn) {
    selectEl.innerHTML = '<option value="">-- choose an option --</option>';
    items.forEach(it => {
      const opt = document.createElement('option');
      opt.value = valueFn(it);
      opt.textContent = labelFn(it);
      const attrs = dataAttrsFn ? dataAttrsFn(it) : {};
      Object.keys(attrs).forEach(k => { opt.dataset[k] = attrs[k]; });
      selectEl.appendChild(opt);
    });
  }

  async function fetchJson(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error('Network response not ok: ' + res.status);
    return res.json();
  }

  // Countries -> pie
  if (countriesSelect) {
    countriesSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (!val) return;
      searchInput.value = val;
      clearSection(pieContent);
      hideImage(pieImage);
      showSection(pieContent);

      const locationName = val;
      const region = e.target.selectedOptions[0]?.textContent || '';
      const pieValues = { pollution: 60, pollen: 30, aqi: 10, other: 5 };

      pieContent.innerHTML = `
        <h2 id="location">${locationName}</h2>
        <h3 id="region">${region}</h3>
        <figure id="pie-data__container" data-pollution="${pieValues.pollution}" data-pollen="${pieValues.pollen}" data-aqi="${pieValues.aqi}" data-other="${pieValues.other}">
          <div class="chart-data__container"><div class="chart-label">100%</div></div>
        </figure>
        <figcaption class="portions-data__container"></figcaption>
        <h3 id="status">Good</h3>
        <p id="message">You can breathe easily in this area</p>
      `;

      const fig = pieContent.querySelector('#pie-data__container');
      const figcap = pieContent.querySelector('.portions-data__container');
      if (fig && figcap) {
        const portions = [
          { label: 'Pollution', value: +fig.dataset.pollution || 0 },
          { label: 'Pollen', value: +fig.dataset.pollen || 0 },
          { label: 'AQI', value: +fig.dataset.aqi || 0 },
          { label: 'Other', value: +fig.dataset.other || 0 }
        ];
        const total = portions.reduce((s,p) => s + p.value, 0) || 1;
        portions.forEach(p => {
          const item = document.createElement('div');
          item.className = 'portion-item';
          const percent = Math.round((p.value/total) * 100);
          item.innerHTML = `<div class="portion-color"></div>${percent}% ${p.label}`;
          figcap.appendChild(item);
        });
        const pollutionPercent = (portions[0].value/total) * 100;
        const pollenPercent = (portions[1].value/total) * 100;
        const aqiPercent = (portions[2].value/total) * 100;
        const chart = fig.querySelector('.chart-data__container');
        chart.style.background = `conic-gradient(#0000ff 0% ${pollutionPercent}%, #002966 ${pollutionPercent}% ${pollutionPercent + pollenPercent}%, #377B2B ${pollutionPercent + pollenPercent}% ${pollutionPercent + pollenPercent + aqiPercent}%, #7AC142 ${pollutionPercent + pollenPercent + aqiPercent}% 100%)`;
      }
    });
  }

  // routesSelect -> instruments/manufacturers -> top
  if (routesSelect) {
    routesSelect.addEventListener('change', async (e) => {
      const route = e.target.value;
      if (route === 'countries') {
        if (dynamicSelect) dynamicSelect.style.display = 'none';
        countriesSelect.style.display = '';
        return;
      }
      countriesSelect.style.display = 'none';
      const ds = ensureDynamicSelect();
      ds.disabled = true;
      ds.style.display = '';
      ds.innerHTML = '<option>Loading...</option>';
      try {
        const json = await fetchJson('/api/' + route);
        const items = json.results || json || [];
        if (route === 'instruments') {
          populateSelect(ds, items, i => i.name || i.model || `Instrument ${i.id || ''}`, i => i.id ?? i.name ?? '', i => ({ id: i.id }));
        } else if (route === 'manufacturers') {
          populateSelect(ds, items, i => i.name || `Manufacturer ${i.id || ''}`, i => i.id ?? i.name ?? '', i => ({ id: i.id }));
        } else {
          populateSelect(ds, items, i => i.name || i.code || JSON.stringify(i), i => i.id ?? i.name ?? '');
        }
        ds.disabled = false;
        ds.addEventListener('change', () => {
          const opt = ds.selectedOptions[0];
          if (!opt || !opt.value) return;
          clearSection(topContent);
          hideImage(topImage);
          showSection(topContent);
          topContent.innerHTML = `<h2>${opt.textContent}</h2><p><small>id: ${opt.dataset.id || 'n/a'}</small></p>`;
        });
      } catch (err) {
        ds.innerHTML = '<option value="">Failed to load</option>';
        ds.disabled = true;
        console.error('fetch failed', err);
      }
    });
  }

  // Search form -> bottom weather
  if (searchForm) {
    searchForm.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const location = (searchInput.value || '').trim();
      if (!location) { if (searchError) searchError.textContent = 'Require location'; searchInput.classList.add('error'); return; }
      try {
        const res = await fetch('/api/search/' + encodeURIComponent(location));
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        clearSection(bottomContent);
        hideImage(bottomImage);
        showSection(bottomContent);
        const temperature = data.temperature ?? data.temp ?? '25.6 C';
        const condition = data.description ?? data.condition ?? 'Few clouds';
        const humidity = data.humidity ?? data.rh ?? '49%';
        const windSpeed = data.wind_speed ?? data.windSpeed ?? '4 m/s';
        bottomContent.innerHTML = `
          <h2>City Weather Lookup</h2>
          <p><strong>Temperature: </strong>${temperature}</p>
          <p><strong>Condition: </strong>${condition}</p>
          <p><strong>Humidity: </strong>${humidity}</p>
          <p><strong>Wind Speed: </strong>${windSpeed}</p>
        `;
      } catch (err) {
        console.error(err);
        if (searchError) searchError.textContent = 'Failed to fetch weather';
      }
    });
  }

  // initial state
  clearSection(topContent);
  clearSection(bottomContent);
  clearSection(pieContent);
  showImage(topImage);
  showImage(bottomImage);
  showImage(pieImage);
});
