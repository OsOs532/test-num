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

  // Show loading
  loading.style.display = "block";
  resultSection.style.display = "none";
  noResults.style.display = "none";

  setTimeout(() => {
    loading.style.display = "none";

    // Demo response
    if (nu === "123456789") {
      resultCard.innerHTML = `
        <div class="result-header">
          <div class="result-avatar">OS</div>
          <div class="result-info">
            <h2>Mohamed Osama</h2>
            <div class="result-phone">${nu}</div>
          </div>
        </div>
        <div class="result-details">
          <div class="detail-item">
            <div class="detail-icon"><i class="fa fa-user"></i></div>
            <div class="detail-text">
              <div class="detail-label">الوظيفة</div>
              <div class="detail-value">Cyber Security</div>
            </div>
          </div>
        </div>`;
      resultSection.style.display = "block";
    } else {
      noResults.style.display = "block";
    }
  }, 2000);
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("phoneInput").addEventListener("keypress", handleKeyPress);
  document.getElementById("searchBtn").addEventListener("click", getInfo);
});
