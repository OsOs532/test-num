const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    // التأكد من استلام الرقم من الفرونت إند
    const body = JSON.parse(event.body || "{}");
    const number = body.number;

    if (!number) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: "الرقم مطلوب" }) 
      };
    }

    // الرابط اللي كان شغال في كودك الأصلي
    const apiUrl = `https://ebnelnegm.com/XX/index.php?num=${encodeURIComponent(number)}`;

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://ebnelnegm.com/'
      }
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Server Error", details: err.message }) 
    };
  }
};
