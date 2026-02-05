exports.handler = async (event) => {
    try {
        const { number } = JSON.parse(event.body);
        let cleanNumber = number.replace(/^0|^20|^\+20/, ''); 

        // حط هنا الـ API Key اللي هتاخده من موقعهم
        const apiKey = "YOUR_NUMLOOKUP_API_KEY"; 
        
        const response = await fetch(`https://api.numlookupapi.com/v1/validate/20${cleanNumber}?apikey=${apiKey}`);
        const data = await response.json();

        // الـ API ده بيرجع بيانات زي carrier و location
        // لو ملقاش اسم شخصي (وهو ده المتوقع) هنظهر بيانات الشبكة
        let info = data.carrier || data.location || "رقم مصري";

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: info, number: number }),
        };
    } catch (error) {
        return { statusCode: 200, body: JSON.stringify({ name: "جاري الفحص...", number: "" }) };
    }
};
