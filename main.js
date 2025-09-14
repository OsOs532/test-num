document.getElementById("searchBtn").addEventListener("click", getInfo);

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
    const data = await res.json();

    loading.style.display = "none";

    if (data && data.length > 0) {
      const person = data[0];
      const initials = person.name ? person.name.substring(0, 2) : "";

      resultCard.innerHTML = `
        <div class="result-avatar">${initials}</div>
        <div class="result-info">
          <h3>${person.name || "غير معروف"}</h3>
          <p>${nu}</p>
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
}
