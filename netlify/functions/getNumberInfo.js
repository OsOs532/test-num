exports.handler = async (event) => {
    if (event.httpMethod !== "POST") return { statusCode: 405 };

    try {
        const { number } = JSON.parse(event.body);
        let cleanNumber = number.replace(/^0|^20|^\+20/, ''); 
        const formattedNumber = "20" + cleanNumber;

        const options = {
            method: 'GET',
            headers: {
                // حط المفتاح اللي نسخته من الـ Dashboard هنا
                'x-rapidapi-key': '3a745ccb10msh93d34609a092a15p10c4bbjsnf0e891e5d920', 
                'x-rapidapi-host': 'caller-id-social-search-eyecon.p.rapidapi.com'
            }
        };

        const response = await fetch(`https://caller-id-social-search-eyecon.p.rapidapi.com/get_info?number=${formattedNumber}`, options);
        const data = await response.json();

        // لو الـ API رد باسم فعلاً
        if (data && data.name) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: data.name, number: number }),
            };
        } else {
            // لو الرقم مش موجود أو الـ Key فيه مشكلة، هنستخدم "خطة الإنقاذ"
            return {
                statusCode: 200,
                body: JSON.stringify({ name: "تحويل للبحث المباشر...", isRedirect: true }),
            };
        }
    } catch (error) {
        return { statusCode: 200, body: JSON.stringify({ name: "جاري التحديث...", isRedirect: true }) };
    }
};
