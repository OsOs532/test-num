const https = require('https');

exports.handler = async (event) => {
    // 1. استلام الرقم من الفرونت إند
    let number;
    try {
        const body = JSON.parse(event.body || "{}");
        number = body.number;
    } catch (e) {
        return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
    }

    if (!number) {
        return { statusCode: 400, body: JSON.stringify({ error: "Number is required" }) };
    }

    // 2. رابط الـ API اللي شغال عليه موقعك الأصلي
    const apiUrl = `https://ebnelnegm.com/XX/index.php?num=${encodeURIComponent(number)}`;

    // 3. طلب البيانات باستخدام https (بدون مكتبات خارجية)
    return new Promise((resolve) => {
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://ebnelnegm.com/'
            }
        };

        https.get(apiUrl, options, (res) => {
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                resolve({
                    statusCode: 200,
                    headers: { 
                        "Content-Type": "application/json", 
                        "Access-Control-Allow-Origin": "*" 
                    },
                    body: rawData // بنبعت البيانات زي ما جت
                });
            });
        }).on('error', (e) => {
            resolve({
                statusCode: 500,
                body: JSON.stringify({ error: e.message })
            });
        });
    });
};
