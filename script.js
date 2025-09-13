// Matrix animation
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

function initMatrix() {
  if (!canvas) return; // لو canvas مش موجود
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  const letters = "01";
  const fontSize = 14;
  const columns = canvas.width / fontSize;
  const drops = [];

  for (let x = 0; x < columns; x++) drops[x] = 1;

  function draw() {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0f0";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const text = letters.charAt(Math.floor(Math.random() * letters.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  setInterval(draw, 35);
}

// Handle Enter key press
function handleKeyPress(event) {
  if (event.key === "Enter") getInfo();
}

// Get number info via Netlify Function
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
      body: JSON.stringify({ number: nu }),
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
              <div class="detail-value">${data.carrier || "غير معروف"}</div>
            </div>
          </div>
          <div class="detail-item">
            <div class="detail-icon"><i class="fa fa-map-marker-alt"></i></div>
            <div class="detail-text">
              <div class="detail-label">الموقع</div>
              <div class="detail-value">${data.location || "غير متاح"}</div>
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

// Initialize application
document.addEventListener("DOMContentLoaded", function () {
  initMatrix();

  const phoneInput = document.getElementById("phoneInput");
  const searchBtn = document.getElementById("searchBtn");

  if (phoneInput) phoneInput.addEventListener("keypress", handleKeyPress);
  if (searchBtn) searchBtn.addEventListener("click", getInfo);

  window.addEventListener("resize", function () {
    if (canvas) {
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
    }
  });
});
