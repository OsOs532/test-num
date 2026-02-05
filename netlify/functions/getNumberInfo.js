exports.handler = async (event) => {
    try {
        const { number } = JSON.parse(event.body);
        let cleanNumber = number.replace(/^0|^20|^\+20/, ''); 
        
        // ده API "جسر" مسرب بيستخدم حسابات تروكولر وهمية (Premium) لجلب البيانات
        // الرابط ده هو اللي شغال بيه أغلب بوتات تليجرام مصر حالياً
        const response = await fetch(`https://is-this-true-caller.vercel.app/api/search?number=20${cleanNumber}`);
        
        if (!response.ok) {
            // لو الجسر المسرب وقع، جرب الجسر البديل
            const backup = await fetch(`https://caller-id-proxy.onrender.com/search?num=${cleanNumber}`);
            const backupData = await backup.json();
            return { statusCode: 200, body: JSON.stringify({ name: backupData.name || "غير مسجل" }) };
        }

        const data = await response.json();
        let resultName = data.name || (data.data && data.data[0] && data.data[0].name) || "غير مسجل";

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: resultName, number: number }),
        };
    } catch (error) {
        return { statusCode: 200, body: JSON.stringify({ name: "⚠️ السيرفر مضغوط - جرب ثانية", number: number }) };
    }
};
