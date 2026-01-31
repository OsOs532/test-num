async function getInfo() {
  const phoneInput = document.getElementById("phoneInput");
  const resultSection = document.getElementById("resultSection");
  const resultCard = document.getElementById("resultCard");
  const loading = document.getElementById("loading");
  const noResults = document.getElementById("noResults");

  const nu = phoneInput.value.trim();

  if (!nu) {
    alert("برجاء إدخال رقم هاتف");
    return;
  }

  // إظهار اللودينج وإخفاء الباقي
  loading.style.display = "block";
  resultSection.style.display = "none";
  noResults.style.display = "none";

  try {
    const res = await fetch("/.netlify/functions/getNumberInfo", {
      method: "POST",
      body: JSON.stringify({ number: nu })
    });

    const data = await res.json();
    loading.style.display = "none";

    // معالجة البيانات (لو مصفوفة أو كائن)
    const person = Array.isArray(data) ? data[0] : data;

    // التأكد من وجود اسم في الرد
    if (person && (person.name || person.FullName)) {
      const name = person.name || person.FullName;
      
      // حساب الحروف الأولى للاسم
      const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);

      resultCard.innerHTML = `
        <div class="result-header">
          <div class="result-avatar" style="background: #007bff; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 15px;">
            ${initials}
          </div>
          <div class="result-info">
            <h2 style="margin: 0; color: #333;">${name}</h2>
            <p style="color: #666; font-size: 18px;">${person.number || nu}</p>
          </div>
        </div>
      `;
      resultSection.style.display = "block";
    } else {
      noResults.style.display = "block";
    }

  } catch (err) {
    console.error("Fetch error:", err);
    loading.style.display = "none";
    noResults.style.display = "block";
  }
}

// ربط الزرار بالدالة
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) {
    searchBtn.onclick = getInfo;
  }

  // البحث عند الضغط على Enter
  document.getElementById("phoneInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") getInfo();
  });
});
