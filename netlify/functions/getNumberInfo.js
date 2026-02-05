exports.handler = async (event) => {
    try {
        const { number } = JSON.parse(event.body);
        // تنظيف الرقم (بنشيل الصفر)
        let cleanNumber = number.replace(/^0|^20|^\+20/, ''); 
        
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '3a745ccb10msh93d34609a092a15p10c4bbjsnf0e891e5d920',
                'x-rapidapi-host': 'caller-id-social-search-eyecon.p.rapidapi.com'
            }
        };

        // جربنا نبعت الرقم بكود الدولة +20
        const response = await fetch(`https://caller-id-social-search-eyecon.p.rapidapi.com/get_info?number=%2B20${cleanNumber}`, options);
        const data = await response.json();

        // السطر ده هيخلينا نعرف الـ API باعت إيه بالظبط في الـ Logs
        console.log("Full API Response:", data);

        // محاولة ذكية لاستخراج أي اسم موجود
        let resultName = data.name || data.fullName || (data.data && data.data.name) || "غير مسجل";

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: resultName, number: number }),
        };
    } catch (error) {
        return { statusCode: 200, body: JSON.stringify({ name: "خطأ في الاتصال", number: "" }) };
    }
};
