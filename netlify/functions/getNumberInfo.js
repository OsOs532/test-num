exports.handler = async (event) => {
    if (event.httpMethod !== "POST") return { statusCode: 405 };

    try {
        const { number } = JSON.parse(event.body);
        let cleanNumber = number.replace(/^0|^20|^\+20/, ''); 

        // ده API بديل (مسرب ومفتوح) بيجيب بيانات الأرقام
        const response = await fetch(`https://api.numverify.com/validate?access_key=YOUR_ACCESS_KEY&number=20${cleanNumber}`);
        // ملاحظة: لو مفيش Key، هنستخدم Proxy سريع لمصر
        
        const response2 = await fetch(`https://search.mishal.site/api/v1/search?number=20${cleanNumber}`);
        const data = await response2.json();

        let resultName = data.name || (data.result && data.result.name) || "غير مسجل";

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: resultName, number: number }),
        };
    } catch (error) {
        return {
            statusCode: 200,
            body: JSON.stringify({ name: "⚠️ عذراً، جاري تحديث السيرفر", number: number }),
        };
    }
};
