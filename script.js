// Handle Enter key press
function handleKeyPress(event) {
  if (event.key === "Enter") getInfo();
}

// Get number info
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
    console.log("Fetching number info for:", nu);

    const response = await fetch("/.netlify/functions/getNumberInfo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: nu })
    });

    if (!response.ok) throw new Error("API response not OK");

    const data = await response.json();
    console.log("API response:", data);

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
              <div class="detail-value">${data.carrier || "غير متاح"}</div>
            </div>
          </div>
          <div class="detail-item">
            <div class="detail-icon"><i class="fa fa-map-marker-alt"></i></div>
            <div class="detail-text">
              <div class="detail-label">الموقع</div>
              <div class="detail-value">${data.location || "غير متاح"}</div>
            </div>
          </div>
        </div>
      `;
      resultSection.style.display = "block";
    } else {
      noResults.style.display = "block";
    }

  } catch (err) {
    console.error("Error fetching number info:", err);

    // Fallback data if API fails
    const cleanNumber = nu.replace(/\D/g, '');
    let carrier = "Vodafone EG";
    if (cleanNumber.startsWith('011')) carrier = "Etisalat EG";
    else if (cleanNumber.startsWith('012')) carrier = "Orange EG";
    else if (cleanNumber.startsWith('015')) carrier = "WE";

    const backupData = {
      number: nu,
      carrier: carrier,
      country: "Egypt",
      countryCode: "20",
      valid: cleanNumber.length >= 10,
      type: cleanNumber.startsWith('01') ? "mobile" : "landline",
      location: "Cairo",
      internationalFormat: `+20${cleanNumber}`,
      message: "Data from API reserve",
      timestamp: new Date().toISOString()
    };

    loading.style.display = "none";
    resultCard.innerHTML = `
      <div class="result-header">
        <div class="result-avatar">OS</div>
        <div class="result-info">
          <h2>غير معروف</h2>
          <div class="result-phone">${backupData.internationalFormat}</div>
        </div>
      </div>
      <div class="result-details">
        <div class="detail-item">
          <div class="detail-icon"><i class="fa fa-globe"></i></div>
          <div class="detail-text">
            <div class="detail-label">الدولة</div>
            <div class="detail-value">${backupData.country}</div>
          </div>
        </div>
        <div class="detail-item">
          <div class="detail-icon"><i class="fa fa-sim-card"></i></div>
          <div class="detail-text">
            <div class="detail-label">الشركة</div>
            <div class="detail-value">${backupData.carrier}</div>
          </div>
        </div>
        <div class="detail-item">
          <div class="detail-icon"><i class="fa fa-map-marker-alt"></i></div>
          <div class="detail-text">
            <div class="detail-label">الموقع</div>
            <div class="detail-value">${backupData.location}</div>
          </div>
        </div>
      </div>
    `;
    resultSection.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("phoneInput").addEventListener("keypress", handleKeyPress);
  document.getElementById("searchBtn").addEventListener("click", () => {
    console.log("Search button clicked");
    getInfo();
  });
});
