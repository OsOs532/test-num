document.getElementById("searchBtn").addEventListener("click", getInfo);
document.getElementById("phoneInput").addEventListener("keypress", function (event) {
  if (event.key === "Enter") getInfo();
});

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

  // إظهار اللودينج
  loading.style.display = "block";
  resultSection.style.display = "none";
  noResults.style.display = "none";

  try {
    const res = await fetch(`https://os-api-lyart.vercel.app/lookup/${nu}`);
    if (!res.ok) throw new Error("فشل الاتصال بالسيرفر");

    const data = await res.json();
    loading.style.display = "none";

    if (data && data.length > 0) {
      const person = data[0];
      const name = person.name || "غير معروف";

      // أول حرفين من الاسم
      const initials = name.substring(0, 2);

      resultCard.innerHTML = `
        <div class="result-header">
          <div class="result-avatar">${initials}</div>
          <div class="result-info">
            <h2>${name}</h2>
            <div class="result-phone">${nu}</div>
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

  // تفريغ الحقل بعد البحث (اختياري)
  document.getElementById("phoneInput").value = "";
}
