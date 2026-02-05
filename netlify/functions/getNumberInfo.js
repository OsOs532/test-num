exports.handler = async (event) => {
    if (event.httpMethod !== "POST") return { statusCode: 405 };

    try {
        const { number } = JSON.parse(event.body);
        let cleanNumber = number.replace(/^0|^20|^\+20/, ''); 
        
        // استخدام fetch المدمجة (عشان الـ Build ينجح)
        // ده الـ API المسرب اللي بيسحب من تروكولر
        const response = await fetch(`https://truecaller-api.vercel.app/search?number=20${cleanNumber}`);
        
        const data = await response.json();

        // محاولة استخراج الاسم من الرد المسرب
        let resultName = data.name || (data.data && data.data[0] && data.data[0].name) || "غير مسجل";

        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" 
            },
            body: JSON.stringify({
                name: resultName,
                number: number
            }),
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 200,
            body: JSON.stringify({ name: "⚠️ ضغط كبير على السيرفر.. حاول ثانية", number: number }),
        };
    }
};
