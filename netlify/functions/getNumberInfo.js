async function getInfo() {
  const nu = document.getElementById("phoneInput").value.trim();
  const resultCard = document.getElementById("resultCard");
  const resultSection = document.getElementById("resultSection");
  const loading = document.getElementById("loading");
  const noResults = document.getElementById("noResults");

  if (!nu) {
    resultSection.style.display = "none";
    noResults.style.display = "block";
    return;
  }

  loading.style.display = "block";
  resultSection.style.display = "none";
  noResults.style.display = "none";

  try {
    const response = await fetch("/.netlify/functions/getNumberInfo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: nu })
    });

    const data = await response.json();
    loading.style.display = "none";

    if (data && data.valid) {
      resultCard.innerHTML = `
        <div class="result-header">
          <div class="result-avatar">OS</div>
          <div class="result-info">
            <h2>${data.name || "غير معروف"}</h2>
            <div class="result-phone">${data.internationalFormat || data.number}</div>
          </div>
        </div>
        <div class="result-details">
          <div class="detail-item">
            <div class="detail-icon"><i class="fa fa-globe"></i></div>
            <div class="detail-text">
              <div class="detail-label">الدولة</div>
              <div class="detail-value">${data.country || "غير متاح"}</div>
            </div>
          </div>
          <div class="detail-item">
            <div class="detail-icon"><i class="fa fa-sim-card"></i></div>
            <div class="detail-text">
              <div class="detail-label">الشركة</div>
              <div class="detail-value">${data.carrier}</div>
            </div>
          </div>
          <div class="detail-item">
            <div class="detail-icon"><i class="fa fa-map-marker-alt"></i></div>
            <div class="detail-text">
              <div class="detail-label">الموقع</div>
              <div class="detail-value">${data.location}</div>
            </div>
          </div>
        </div>`;
      resultSection.style.display = "block";
    } else {
      noResults.style.display = "block";
    }

  } catch (err) {
    console.error("Error fetching number info:", err);
    loading.style.display = "none";
    noResults.style.display = "block";
  }
}
