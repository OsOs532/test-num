exports.handler = async (event) => {
    // التأكد أن الطلب من نوع POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { number } = JSON.parse(event.body);
        
        // تنظيف الرقم: إزالة الصفر، الـ 20، أو +20 من البداية
        let cleanNumber = number.replace(/^0|^20|^\+20/, ''); 
        
        // الرابط المسرب (Vercel Proxy) الذي يسحب من تروكولر مباشرة
        // نستخدم كود الدولة 20 لمصر
        const apiUrl = `https://truecaller-api-v2.vercel.app/search?number=20${cleanNumber}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error('API Bridge Failed');
        }

        const data = await response.json();

        // استخراج الاسم (الـ API المسرب غالباً يرجع الاسم في خانة name أو داخل مصفوفة data)
        let resultName = data.name || (data.data && data.data[0] && data.data[0].name) || "غير مسجل";

        // الرد على الفرونت إند
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" // لتجنب مشاكل الـ CORS
            },
            body: JSON.stringify({
                name: resultName,
                number: number
            }),
        };

    } catch (error) {
        console.error("Fetch Error:", error);
        // في حالة فشل السيرفر المسرب تماماً (بسبب الضغط)
        return {
            statusCode: 200, // نرسل 200 حتى لا يظهر خطأ في الكونسول للمستخدم
            body: JSON.stringify({ 
                name: "⚠️ السيرفر مشغول (حاول مجدداً)", 
                number: "" 
            }),
        };
    }
};
