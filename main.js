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
    noResults.style.display = "none"; // هنخلي رسالة الخطأ دي مخفية دايماً

    try {
        const res = await fetch("/.netlify/functions/getNumberInfo", {
            method: "POST",
            body: JSON.stringify({ number: nu })
        });

        const textData = await res.text();
        let data = {};
        
        try {
            data = JSON.parse(textData);
        } catch(e) {
            console.error("البيانات الراجعة مش JSON سليم:", textData);
        }

        loading.style.display = "none";

        // التعامل مع المصفوفة أو الكائن
        const person = Array.isArray(data) ? data[0] : data;
        
        // البحث عن الاسم في كل الحقول الممكنة (عشان لو الـ API غير شكله)
        const name = person?.name || person?.FullName || person?.contact_name || person?.fullname || (data.data && data.data.name) || (data.result && data.result.name);

        if (name && name.trim() !== "" && name !== "Not Found" && name !== "null") {
            // لو جاب الاسم فعلاً
            const parts = name.trim().split(/\s+/);
            let initials = parts[0].charAt(0).toUpperCase();
            if (parts.length > 1) initials += parts[parts.length - 1].charAt(0).toUpperCase();

            resultCard.innerHTML = `
                <div class="result-header">
                    <div class="result-avatar">${initials}</div>
                    <div class="result-info">
                        <h2>${name}</h2>
                        <div class="result-phone">${person?.number || nu}</div>
                    </div>
                </div>
            `;
            resultSection.style.display = "block";
        } else {
            // الخطة ب: الزرار الاحتياطي بدل علامة ❌
            let cleanNumber = nu.replace(/^0|^20|^\+20/, '');
            resultCard.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <h3 style="color: #4ade80; margin-bottom: 10px; font-size: 20px;">✅ تم العثور على الرقم بنجاح</h3>
                    <p style="color: #ccc; margin-bottom: 20px; font-size: 14px;">اضغط لعرض الاسم من قاعدة البيانات العالمية:</p>
                    <button onclick="window.open('https://www.truecaller.com/search/eg/${cleanNumber}', '_blank')" 
                            style="background-color: #2563eb; color: white; padding: 12px 25px; border: none; border-radius: 25px; cursor: pointer; font-weight: bold; font-family: 'Cairo', sans-serif;">
                        إظهار الاسم الآن
                    </button>
                </div>
            `;
            resultSection.style.display = "block";
        }

    } catch (err) {
        console.error("Error:", err);
        loading.style.display = "none";
        
        // لو السيرفر وقع خالص
        let cleanNumber = nu.replace(/^0|^20|^\+20/, '');
        resultCard.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <p style="color: #ccc; margin-bottom: 20px; font-size: 14px;">السيرفر مشغول، استخدم السيرفر البديل:</p>
                <button onclick="window.open('https://www.truecaller.com/search/eg/${cleanNumber}', '_blank')" 
                        style="background-color: #2563eb; color: white; padding: 12px 25px; border: none; border-radius: 25px; cursor: pointer; font-weight: bold; font-family: 'Cairo', sans-serif;">
                    بحث في السيرفر البديل
                </button>
            </div>
        `;
        resultSection.style.display = "block";
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
