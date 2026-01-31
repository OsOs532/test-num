async function getInfo() {
  const phoneInput = document.getElementById("phoneInput");
  const resultSection = document.getElementById("resultSection");
  const resultCard = document.getElementById("resultCard");
  const loading = document.getElementById("loading");
  const noResults = document.getElementById("noResults");

  const nu = phoneInput.value.trim();

  if (!nu) {
    alert("دخل الرقم يا هندسة!");
    return;
  }

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

    // 1. استخراج الكائن (سواء مصفوفة أو كائن مباشر)
    const person = Array.isArray(data) ? data[0] : data;

    // 2. تفتيش عن الاسم في كل الحقول الممكنة (عشان نضمن ميبقاش "غير معروف")
    // جربنا هنا: name و FullName و contact_name
    const name = person?.name || person?.FullName || person?.contact_name || "";

    if (name && name.trim() !== "") {
      // حساب الحروف الأولى للاسم بشكل احترافي
      const nameParts = name.trim().split(/\s+/);
      let initials = nameParts[0].charAt(0).toUpperCase();
      if (nameParts.length > 1) {
        initials += nameParts[nameParts.length - 1].charAt(0).toUpperCase();
      }

      resultCard.innerHTML = `
        <div class="result-header">
          <div class="result-avatar">${initials}</div>
          <div class="result-info">
            <h2>${name}</h2>
            <p class="result-phone">${person.number || nu}</p>
          </div>
        </div>
      `;
      resultSection.style.display = "block";
    } else {
      // لو الاسم فعلاً مش موجود في الـ API خالص
      noResults.style.display = "block";
    }

  } catch (err) {
    console.error("Error:", err);
    loading.style.display = "none";
    noResults.style.display = "block";
  }

  phoneInput.value = "";
}

// ربط الأحداث
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("searchBtn");
  if (btn) btn.onclick = getInfo;

  document.getElementById("phoneInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") getInfo();
  });
});
