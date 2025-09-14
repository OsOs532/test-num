async function getInfo() {
  const nu = document.getElementById("phoneInput").value.trim();
  const resultCard = document.getElementById("resultCard");
  const resultSection = document.getElementById("resultSection");
  const loading = document.getElementById("loading");
  const noResults = document.getElementById("noResults");
  const mainContent = document.getElementById("mainContent"); // كل المحتوى غير النتيجة هنا

  if (!nu) {
    resultSection.style.display = "none";
    noResults.style.display = "block";
    return;
  }

  // عرض التحميل
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

    // إعداد الأحرف الأولى من الاسم
    let initials = "--";
    if (person.name) {
      const words = person.name.trim().split(" ");
      initials = words[0].charAt(0).toUpperCase();
      if (words.length > 1) initials += words[1].charAt(0).toUpperCase();
    }

    // عرض الاسم والرقم فقط
    resultCard.innerHTML = `
      <div class="result-header">
        <div class="result-avatar">${initials}</div>
        <div class="result-info">
          <h2>${person.name || "غير معروف"}</h2>
          <div class="result-phone">${person.number || nu}</div>
        </div>
      </div>
    `;

    // إخفاء باقي الصفحة
    mainContent.style.display = "none";

    // عرض النتيجة
    resultSection.style.display = "block";

  } catch (err) {
    console.error(err);
    loading.style.display = "none";
    noResults.style.display = "block";
  }

  document.getElementById("phoneInput").value = "";
  document.getElementById("phoneInput").focus();
}

// إضافة الأحداث للبحث
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("phoneInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") getInfo();
  });

  document.getElementById("searchBtn").addEventListener("click", getInfo);
});
