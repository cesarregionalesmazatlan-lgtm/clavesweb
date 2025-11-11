let allSchools = [];

async function loadData() {
  const response = await fetch("centros_trabajo.json");
  allSchools = await response.json();
  populateMunicipios();
}

function populateMunicipios() {
  const municipios = [...new Set(allSchools.map(s => s.municipio))].sort();
  const select = document.getElementById("municipioFilter");
  municipios.forEach(m => {
    const option = document.createElement("option");
    option.value = m;
    option.textContent = m;
    select.appendChild(option);
  });
}

function highlightText(text, searchTerm) {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(regex, '<span class="highlight">$1</span>');
}

function searchSchools(searchTerm, municipioFiltro) {
  let results = allSchools;
  if (municipioFiltro) {
    results = results.filter(s => s.municipio.toLowerCase() === municipioFiltro.toLowerCase());
  }
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    results = results.filter(school =>
      school.clave.toLowerCase().includes(term) ||
      school.centro.toLowerCase().includes(term) ||
      school.turno.toLowerCase().includes(term) ||
      school.sostenimiento.toLowerCase().includes(term) ||
      school.municipio.toLowerCase().includes(term) ||
      school.localidad.toLowerCase().includes(term) ||
      school.colonia.toLowerCase().includes(term)
    );
  }
  return results;
}

function displayResults(schools, searchTerm, municipioFiltro) {
  const container = document.getElementById("resultsContainer");
  const resultsInfo = document.getElementById("resultsInfo");

  if (!searchTerm && !municipioFiltro) {
    container.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">📝</div>
        <div class="no-results-text">Empieza a escribir para buscar una escuela</div>
      </div>`;
    resultsInfo.textContent = "Esperando búsqueda...";
    return;
  }

  if (schools.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <div class="no-results-text">No se encontraron resultados</div>
        <div>Intenta con otros términos de búsqueda</div>
      </div>`;
    resultsInfo.textContent = "No se encontraron resultados";
    return;
  }

  resultsInfo.textContent = `Mostrando ${schools.length} resultado${schools.length !== 1 ? "s" : ""}`;
  container.innerHTML = schools
    .map(
      s => `
      <div class="school-card">
        <div class="school-name">${highlightText(s.centro, searchTerm)}</div>
        <div><b>Clave CT:</b> ${highlightText(s.clave, searchTerm)}</div>
        <div><b>Turno:</b> ${highlightText(s.turno, searchTerm)}</div>
        <div><b>Sostenimiento:</b> ${highlightText(s.sostenimiento, searchTerm)}</div>
        <div><b>Municipio:</b> ${highlightText(s.municipio, searchTerm)}</div>
        <div><b>Localidad:</b> ${highlightText(s.localidad, searchTerm)}</div>
        <div><b>Colonia:</b> ${highlightText(s.colonia, searchTerm)}</div>
      </div>`
    )
    .join("");
}

document.getElementById("searchInput").addEventListener("input", () => {
  const searchTerm = document.getElementById("searchInput").value.trim();
  const municipioFiltro = document.getElementById("municipioFilter").value.trim();
  const results = searchSchools(searchTerm, municipioFiltro);
  displayResults(results, searchTerm, municipioFiltro);
});

document.getElementById("municipioFilter").addEventListener("change", () => {
  const searchTerm = document.getElementById("searchInput").value.trim();
  const municipioFiltro = document.getElementById("municipioFilter").value.trim();
  const results = searchSchools(searchTerm, municipioFiltro);
  displayResults(results, searchTerm, municipioFiltro);
});

window.onload = loadData;
