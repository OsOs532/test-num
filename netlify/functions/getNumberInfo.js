exports.handler = async (event) => {
    if (event.httpMethod !== "POST") return { statusCode: 405 };

    try {
        const { number } = JSON.parse(event.body);
        
        // تنظيف الرقم: بنشيل الصفر أو الـ 20 من الأول عشان نبعته "صافي"
        let cleanNumber = number.replace(/^0|^20|^\+20/, ''); 
        
        // Eyecon بيحتاج الرقم بكود الدولة بدون علامة + (لمصر 20)
        const fullNumber = "20" + cleanNumber;

        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '3a745ccb10msh93d34609a092a15p10c4bbjsnf0e891e5d920',
                'x-rapidapi-host': 'caller-id-social-search-eyecon.p.rapidapi.com'
            }
        };

        // طلب البيانات من Eyecon (استخدام الـ Endpoint الصح)
        const response = await fetch(`https://caller-id-social-search-eyecon.p.rapidapi.com/get_info?number=${fullNumber}`, options);
        const data = await response.json();

        // Eyecon بيرجع الاسم في خانة اسمها name
        let resultName = data.name || "غير مسجل في قاعدة البيانات";

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: resultName,
                number: number
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "خطأ في الاتصال بالسيرفر" }),
        };
    }
};
