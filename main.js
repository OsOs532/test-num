// main.js

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
    const res = await fetch("/.netlify/functions/getNumberInfo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: nu })
    });

    if (!res.ok) throw new Error("خطأ في الخادم");

    const person = await res.json();
    loading.style.display = "none";

    let initials = "--";
    if (person.name) {
      const words = person.name.trim().split(" ");
      initials = words[0].charAt(0).toUpperCase();
      if (words.length > 1) initials += words[1].charAt(0).toUpperCase();
    }

    resultCard.innerHTML = `
      <div class="result-header">
        <div class="result-avatar">${initials}</div>
        <div class="result-info">
          <h2>${person.name || "غير معروف"}</h2>
          <div class="result-phone">${person.number}</div>
          ${person.type ? `<div class="result-type">النوع: ${person.type}</div>` : ""}
          <div class="result-carrier">الشركة: ${person.carrier || "غير متاح"}</div>
          <div class="result-country">الدولة: ${person.country || "غير متاح"}</div>
          <div class="result-location">الموقع: ${person.location || "غير متاح"}</div>
        </div>
      </div>
    `;
    resultSection.style.display = "block";

  } catch (err) {
    console.error(err);
    loading.style.display = "none";
    noResults.style.display = "block";
  }

  document.getElementById("phoneInput").value = "";
  document.getElementById("phoneInput").focus();
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("phoneInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") getInfo();
  });

  document.getElementById("searchBtn").addEventListener("click", getInfo);
});
