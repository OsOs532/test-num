exports.handler = async (event) => {
    try {
        const { number } = JSON.parse(event.body);
        let cleanNumber = number.replace(/^0|^20|^\+20/, ''); 
        
        // المحاولة الأولى: API مسرب من سكريبت PHP قديم
        const response = await fetch(`https://truecaller-api.mishal.workers.dev/search?number=20${cleanNumber}`);
        const data = await response.json();

        if (data.name) {
            return {
                statusCode: 200,
                body: JSON.stringify({ name: data.name, number: number })
            };
        }

        // المحاولة الثانية (لو الأول فشل): الـ API البديل المسرب
        const backup = await fetch(`https://api.anyapi.io/number/validate?number=20${cleanNumber}&apiKey=YOUR_FREE_KEY`);
        // ... (تكملة الكود)
    } catch (e) {
        // الـ Redirect اللي بيحمي برستيجك
        return { statusCode: 200, body: JSON.stringify({ name: "redirect", number: number }) };
    }
};
