const fetch = require('node-fetch');

exports.handler = async (event) => {
    // 1. التأكد إن الطلب جاي من الموقع بطريقة صحيحة
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { number } = JSON.parse(event.body);
        
        // 2. تنظيف الرقم وتجهيزه بصيغة دولية لمصر (20)
        // لو الرقم بيبدأ بـ 0، بنشيل الصفر ونحط 20
        const formattedNumber = number.startsWith('20') ? number : '20' + number.replace(/^0+/, '');

        // 3. إعدادات الـ API الجديد (SyncMe) من الصورة اللي بعتها
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '3a745ccb10msh93d34609a092a15p10c4bbjsnf0e891e5d920',
                'x-rapidapi-host': 'syncme.p.rapidapi.com'
            }
        };

        // 4. الاتصال بالـ API
        const response = await fetch(`https://syncme.p.rapidapi.com/api/v1/search?number=${formattedNumber}`, options);
        const data = await response.json();

        // 5. استخراج الاسم من رد الـ API وتجهيزه للموقع
        // الـ API بتاع SyncMe غالباً بيرجع الاسم في خانة name أو fullName
        const resultName = data.name || data.fullName || (data.result && data.result.name) || "غير مسجل";

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: resultName,
                number: formattedNumber
            }),
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "فشل في جلب البيانات من السيرفر" }),
        };
    }
};
