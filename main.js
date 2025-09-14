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

  try {
    const res = await fetch(`https://ebnelnegm.com/HH/index.php?num=${encodeURIComponent(nu)}`, {
      method: "GET",
      cache: "no-store"
    });

    if (!res.ok) throw new Error("خطأ في الخادم");

    const data = await res.json();
    loading.style.display = "none";

    if (data && Object.keys(data).length > 0) {
      // ✨ هنا بنعرض البيانات حسب شكل الـ JSON الراجع
      resultCard.innerHTML = `
        <div class="result-header">
          <div class="result-avatar">OS</div>
          <div class="result-info">
            <h2>${data.name || "غير معروف"}</h2>
            <div class="result-phone">${nu}</div>
          </div>
        </div>
        <div class="result-details">
          <div class="detail-item">
            <div class="detail-icon"><i class="fa fa-user"></i></div>
            <div class="detail-text">
              <div class="detail-label">الوظيفة</div>
              <div class="detail-value">${data.job || "غير متوفر"}</div>
            </div>
          </div>
        </div>
      `;
      resultSection.style.display = "block";
    } else {
      noResults.style.display = "block";
    }
  } catch (err) {
    console.error(err);
    loading.style.display = "none";
    noResults.style.display = "block";
  }

  // امسح الحقل بعد البحث (اختياري)
  document.getElementById("phoneInput").value = "";
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("phoneInput").addEventListener("keypress", handleKeyPress);
  document.getElementById("searchBtn").addEventListener("click", getInfo);
});
