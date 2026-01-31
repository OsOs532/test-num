async function getInfo() {
    const phoneInput = document.getElementById("phoneInput");
    const resultSection = document.getElementById("resultSection");
    const resultCard = document.getElementById("resultCard");
    const loading = document.getElementById("loading");
    const noResults = document.getElementById("noResults");

    const nu = phoneInput.value.trim();
    if (!nu) return;

    // تجهيز الواجهة
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

        // التعامل مع المصفوفة أو الكائن
        const person = Array.isArray(data) ? data[0] : data;
        
        // البحث عن الاسم في كل الحقول الممكنة
        const name = person?.name || person?.FullName || person?.contact_name;

        if (name && name.trim() !== "") {
            // حساب الـ Initials (أول حرف من أول اسم وآخر اسم)
            const parts = name.trim().split(/\s+/);
            let initials = parts[0].charAt(0).toUpperCase();
            if (parts.length > 1) initials += parts[parts.length - 1].charAt(0).toUpperCase();

            resultCard.innerHTML = `
                <div class="result-header">
                    <div class="result-avatar">${initials}</div>
                    <div class="result-info">
                        <h2>${name}</h2>
                        <div class="result-phone">${person.number || nu}</div>
                    </div>
                </div>
            `;
            resultSection.style.display = "block";
        } else {
            noResults.style.display = "block";
        }

    } catch (err) {
        console.error("Error:", err);
        loading.style.display = "none";
        noResults.style.display = "block";
    }

    phoneInput.value = "";
}

// تشغيل الزرار والإنتر
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("searchBtn");
    if (btn) btn.onclick = getInfo;

    document.getElementById("phoneInput").addEventListener("keypress", (e) => {
        if (e.key === "Enter") getInfo();
    });
});
