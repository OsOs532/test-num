const fetch = require('node-fetch');

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") return { statusCode: 405 };

    try {
        const { number } = JSON.parse(event.body);
        let cleanNumber = number.replace(/^0|^20|^\+20/, ''); 
        
        // ده API مسرب (Proxy) بيسحب من تروكولر مباشرة
        // الرابط ده بيستخدمه مبرمجين كتير كـ "Bridge"
        const response = await fetch(`https://truecaller-api.vercel.app/search?number=20${cleanNumber}`);
        
        if (!response.ok) throw new Error('API Failed');

        const data = await response.json();

        // تروكولر بيرجع الاسم في الغالب في خانة data.name أو name
        let resultName = data.name || (data.data && data.data[0] && data.data[0].name) || "غير مسجل";

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: resultName,
                number: number
            }),
        };
    } catch (error) {
        // لو السيرفر المسرب وقع (لأنه عليه ضغط)، هنرجّع رسالة احترافية
        return {
            statusCode: 200,
            body: JSON.stringify({ name: "⚠️ السيرفر مشغول (جرب مرة أخرى)", number: number }),
        };
    }
};
