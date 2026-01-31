async function getInfo() {
    const phoneInput = document.getElementById("phoneInput");
    const resultSection = document.getElementById("resultSection");
    const resultCard = document.getElementById("resultCard");
    const loading = document.getElementById("loading");
    const noResults = document.getElementById("noResults");

    const nu = phoneInput.value.trim();
    if (!nu) return;

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

        const person = Array.isArray(data) ? data[0] : data;
        const name = person?.name || person?.FullName || person?.contact_name;

        if (name && name.trim() !== "") {
            const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);

            resultCard.innerHTML = `
                <div class="result-header" style="text-align: center; display: flex; flex-direction: column; align-items: center;">
                    <div class="result-avatar">${initials}</div>
                    <h2 style="margin: 10px 0; color: #1e293b;">${name}</h2>
                    <p style="color: var(--primary-color); font-weight: bold; font-size: 1.2rem;">${person.number || nu}</p>
                </div>
            `;
            resultSection.style.display = "block";
            resultCard.animate([{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 500 });
        } else {
            noResults.style.display = "block";
        }
    } catch (err) {
        loading.style.display = "none";
        noResults.style.display = "block";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("searchBtn").onclick = getInfo;
    document.getElementById("phoneInput").onkeypress = (e) => { if (e.key === "Enter") getInfo(); };
});
