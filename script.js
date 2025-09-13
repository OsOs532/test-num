// Handle Enter key press
function handleKeyPress(event) {
  if (event.key === "Enter") getInfo();
}

// Show/Hide Loader
function toggleLoader(show) {
  const loader = document.getElementById("loading");
  loader.style.display = show ? "block" : "none";
}

// Get number info via Netlify Function
async function getInfo() {
  const number = document.getElementById("numberInput").value.trim();
  const resultSection = document.getElementById("resultSection");
  const resultCard = document.getElementById("resultCard");
  const noResults = document.getElementById("noResults");

  if (!number) {
    resultSection.style.display = "none";
    noResults.style.display = "block";
    return;
  }

  toggleLoader(true);
  resultSection.style.display = "none";
  noResults.style.display = "none";

  try {
    const res = await fetch("/.netlify/functions/getNumberInfo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number })
    });

    const data = await res.json();
    toggleLoader(false);

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
    console.error(err);
    toggleLoader(false);
    noResults.style.display = "block";
  }
}

// Initialize event listeners
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("searchButton").addEventListener("click", getInfo);
  document.getElementById("numberInput").addEventListener("keypress", handleKeyPress);
});
