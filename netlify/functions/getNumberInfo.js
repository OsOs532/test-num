exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { number } = JSON.parse(event.body);
        
        // تنظيف الرقم: بنشيل الـ 0 اللي في الأول أو الـ +20 لو موجودة
        // عشان نبعت الرقم لوحده وكود الدولة لوحده زي ما الصورة طالبة
        let cleanNumber = number.replace(/^\+20|^20|^0/, ''); 
        let countryCode = "20"; // لمصر

        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '3a745ccb10msh93d34609a092a15p10c4bbjsnf0e891e5d920',
                'x-rapidapi-host': 'syncme.p.rapidapi.com'
            }
        };

        // الربط الجديد باستخدام المفتاحين number و code
        const response = await fetch(`https://syncme.p.rapidapi.com/api/v1/search?number=${cleanNumber}&code=${countryCode}`, options);
        const data = await response.json();

        console.log("API Result:", data);

        // محاولة استخراج الاسم بناءً على رد SyncMe
        let resultName = "غير مسجل";
        if (data.name) resultName = data.name;
        else if (data.result && data.result.name) resultName = data.result.name;

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
            body: JSON.stringify({ error: "Server Error" }),
        };
    }
};
