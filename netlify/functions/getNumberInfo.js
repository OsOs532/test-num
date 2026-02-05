exports.handler = async (event) => {
    try {
        const { number } = JSON.parse(event.body);
        let cleanNumber = number.replace(/^0|^20|^\+20/, ''); 
        
        // ده API "جسر" مسرب بيسحب من تروكولر عبر سيرفرات تانية
        // الرابط ده بيستخدمه مبرمجين الـ OSINT
        const response = await fetch(`https://truecaller-api.mishal.workers.dev/search?number=20${cleanNumber}`);
        const data = await response.json();

        // لو الـ API المسرب ده رد بداتا
        let resultName = data.name || (data.data && data.data[0] && data.data[0].name) || "غير مسجل";

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: resultName, number: number }),
        };
    } catch (error) {
        // لو الـ API المسرب وقع (وده وارد جداً)
        return {
            statusCode: 200,
            body: JSON.stringify({ name: "redirect", number: number.replace(/^0|^20|^\+20/, '') }),
        };
    }
};
