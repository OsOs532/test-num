async function getInfo() {
    const phoneInput = document.getElementById("phoneInput");
    const resultSection = document.getElementById("resultSection");
    const resultCard = document.getElementById("resultCard");
    const loading = document.getElementById("loading");
    const noResults = document.getElementById("noResults");
    const noResultsText = noResults.querySelector('p'); // عشان نغير النص حسب الخطأ

    const nu = phoneInput.value.trim();
    if (!nu) return;

    // تجهيز الواجهة (إخفاء النتيجة وإظهار اللودينج)
    loading.style.display = "block";
    resultSection.style.display = "none";
    noResults.style.display = "none";

    try {
        // الاتصال بالباك إند بتاعك اللي بيكلم ebnelnegm.com
        const res = await fetch("/.netlify/functions/getNumberInfo", {
            method: "POST",
            body: JSON.stringify({ number: nu })
        });

        const textData = await res.text();
        let data = {};
        
        try {
            data = JSON.parse(textData);
        } catch(e) {
            // لو الـ API بعت نص عادي مش JSON
            console.error("Data is not JSON:", textData);
        }

        loading.style.display = "none";

        // التعامل مع البيانات (سواء كانت مصفوفة أو كائن)
        const person = Array.isArray(data) ? data[0] : data;
        
        // استخراج الاسم
        const name = person?.name || person?.FullName || person?.contact_name || person?.fullname;

        // الفحص: لو في اسم، والاسم ده مش كلمة "غير مسجل" أو "Not Found"
        if (name && name.trim() !== "" && !name.includes("غير مسجل") && name !== "Not Found" && name !== "null") {
            
            // حساب أول حرفين للأيقونة
            const parts = name.trim().split(/\s+/);
            let initials = parts[0].charAt(0).toUpperCase();
            if (parts.length > 1) initials += parts[parts.length - 1].charAt(0).toUpperCase();

            // طباعة الكارت الزجاجي بالاسم
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
            // لو الـ API رد بـ "غير مسجل" أو ملقاش حاجة
            noResultsText.innerText = "عذراً، الرقم غير مسجل في قاعدة البيانات الحالية";
            noResults.style.display = "block";
        }

    } catch (err) {
        console.error("Error:", err);
        loading.style.display = "none";
        noResultsText.innerText = "حدث خطأ في الاتصال بالسيرفر، جرب مرة أخرى";
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
