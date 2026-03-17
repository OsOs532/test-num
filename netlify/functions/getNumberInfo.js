const https = require('https');

exports.handler = async (event) => {
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

    // 1. رابط ابن النجم الأصلي
    const targetUrl = `https://ebnelnegm.com/XX/index.php?num=${encodeURIComponent(number)}`;
    
    // 2. رابط الكوبري (Proxy) اللي هيخفي الـ IP بتاع Netlify
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

    return new Promise((resolve) => {
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            }
        };

        https.get(proxyUrl, options, (res) => {
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                resolve({
                    statusCode: 200,
                    headers: { 
                        "Content-Type": "application/json", 
                        "Access-Control-Allow-Origin": "*" 
                    },
                    body: rawData 
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
