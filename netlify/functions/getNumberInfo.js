exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { number } = JSON.parse(event.body);
        // تنظيف الرقم من أي إضافات (0، 20، +20)
        let cleanNumber = number.replace(/^0|^20|^\+20/, ''); 
        
        // --- المصدر المسرب الأول (Truecaller Node Bridge) ---
        // هذا الرابط عبارة عن سيرفر Proxy يسحب البيانات مباشرة
        const apiUrl = `https://truecaller-api-v2.vercel.app/search?number=20${cleanNumber}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Android 12; Mobile; rv:94.0) Gecko/94.0 Firefox/94.0'
            }
        });

        const data = await response.json();

        // محاولة استخراج الاسم من هيكل البيانات المسرب
        let resultName = data.name || (data.data && data.data[0] && data.data[0].name);

        if (resultName && resultName !== "Not Found") {
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: resultName, number: number }),
            };
        } else {
            // لو الـ API المسرب ملقاش نتيجة، نبعت إشارة للفرونت إند للتحويل
            return {
                statusCode: 200,
                body: JSON.stringify({ name: "redirect", number: cleanNumber }),
            };
        }

    } catch (error) {
        // في حالة وقوع السيرفر المسرب تماماً
        return {
            statusCode: 200,
            body: JSON.stringify({ name: "redirect", number: number.replace(/^0|^20|^\+20/, '') }),
        };
    }
};
