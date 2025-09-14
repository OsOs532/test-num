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

    const data = await res.json(); // API بيرجع JSON Array
    loading.style.display = "none";

    if (Array.isArray(data) && data.length > 0) {
      const person = data[0]; // أول عنصر

      resultCard.innerHTML = `
        <div class="result-header">
          <div class="result-avatar">OS</div>
          <div class="result-info">
            <h2>${person.name || "غير معروف"}</h2>
            <div class="result-phone">${nu}</div>
            ${person.type ? `<div class="result-type">النوع: ${person.type}</div>` : ""}
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

  // امسح الحقل وارجع الـ focus عليه عشان تكتب رقم جديد
  document.getElementById("phoneInput").value = "";
  document.getElementById("phoneInput").focus();
}

// ✅ Search button + Enter key
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("phoneInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") getInfo();
  });

  document.getElementById("searchBtn").addEventListener("click", getInfo);
});
