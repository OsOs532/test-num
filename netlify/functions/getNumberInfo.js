exports.handler = async (event) => {
    try {
        const { number } = JSON.parse(event.body);
        let cleanNumber = number.replace(/^0|^20|^\+20/, ''); 
        
        // دي الـ Endpoints المسربة اللي بتستخدمها مكتبة TruecallerJS
        const url = `https://search5-noneu.truecaller.com/v2/search?q=20${cleanNumber}&countryCode=EG&type=4&locAddr=&placement=SEARCHRESULTS,HISTORY,DETAILS&encoding=json`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                // السر كله في الـ Token ده اللي بتطلعه المكتبة
                'Authorization': 'Bearer YOUR_TOKEN_FROM_TRUECALLERJS',
                'User-Agent': 'Truecaller/11.75.5 (Android;10)',
                'Host': 'search5-noneu.truecaller.com'
            }
        });

        const data = await response.json();
        let resultName = (data.data && data.data[0]) ? data.data[0].name : "غير مسجل";

        return {
            statusCode: 200,
            body: JSON.stringify({ name: resultName, number: number })
        };
    } catch (error) {
        return { statusCode: 200, body: JSON.stringify({ name: "redirect", number: number }) };
    }
};
