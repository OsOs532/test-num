// getNumberInfo.js - جرب هذه الـ endpoints المختلفة
export async function handler(event, context) {
  try {
    let number;
    
    if (event.httpMethod === 'POST') {
      try {
        const body = JSON.parse(event.body);
        number = body.number;
      } catch (e) {
        const params = new URLSearchParams(event.body);
        number = params.get('number');
      }
    }

    if (!number) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: "رقم الهاتف مطلوب" })
      };
    }

    // جرب هذه الـ endpoints المختلفة:
    const endpoints = [
      `https://ebnelnegm.com/api?num=${number}`,
      `https://ebnelnegm.com/data.php?num=${number}`,
      `https://ebnelnegm.com/info?number=${number}`,
      `https://ebnelnegm.com/check?phone=${number}`,
      `https://api.ebnelnegm.com/h.php?num=${number}`,
      `https://ebnelnegm.com/phone/${number}`
    ];

    let data;
    let lastError;

    // جرب كل endpoint حتى يعمل واحد
    for (const endpoint of endpoints) {
      try {
        console.log('Trying endpoint:', endpoint);
        const response = await fetch(endpoint);
        
        if (!response.ok) continue;
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
          break;
        }
      } catch (error) {
        lastError = error;
        continue;
      }
    }

    // إذا لم يعمل أي endpoint، استخدم البيانات التجريبية
    if (!data) {
      console.log('All endpoints failed, using mock data');
      data = {
        number: number,
        carrier: "Vodafone EG",
        country: "Egypt",
        countryCode: "20",
        valid: true,
        type: "mobile",
        message: "بيانات تجريبية - API غير متاح"
      };
    }

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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: "حدث خطأ غير متوقع", 
        details: err.message 
      })
    };
  }
}
