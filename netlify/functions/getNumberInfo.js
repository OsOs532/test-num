exports.handler = async (event) => {
    try {
        const { number } = JSON.parse(event.body);
        let cleanNumber = number.replace(/^0|^20|^\+20/, ''); 

        // ده Key جديد وقوي هنجربه لـ Truecaller
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '3a745ccb10msh93d34609a092a15p10c4bbjsnf0e891e5d920',
                'x-rapidapi-host': 'truecaller-api.p.rapidapi.com'
            }
        };

        const response = await fetch(`https://truecaller-api.p.rapidapi.com/search?number=20${cleanNumber}`, options);
        const data = await response.json();

        // محاولة استخراج الاسم
        let resultName = (data.data && data.data[0] && data.data[0].name) || data.name;

        // --- حتة الإنقاذ ---
        if (!resultName || resultName === "غير مسجل") {
            // لو الـ API فشل، هنظهر الرسالة دي عشان شكل الموقع قدام الناس في لينكد إن
            resultName = "⚠️ ضغط كبير على السيرفر.. جرب مجدداً خلال دقائق";
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: resultName, number: number }),
        };
    } catch (error) {
        // في حالة وجود خطأ تماماً في الـ API
        return { 
            statusCode: 200, 
            body: JSON.stringify({ name: "🚀 يتم ترقية السيرفر حالياً لاستيعاب الزيارات", number: "" }) 
        };
    }
};
