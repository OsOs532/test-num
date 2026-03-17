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

    const apiUrl = `https://ebnelnegm.com/XX/index.php?num=${encodeURIComponent(number)}`;

    return new Promise((resolve) => {
        // 🔥 السر كله هنا: تزييف الـ Headers عشان نعدي من الحماية
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Accept-Language': 'ar,en-US;q=0.9,en;q=0.8',
                'Referer': 'https://ebnelnegm.com/',
                'Origin': 'https://ebnelnegm.com',
                'Connection': 'keep-alive',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin'
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
