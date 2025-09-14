// getNumberInfo.js
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
        body: JSON.stringify({ error: "Phone number required" })
      };
    }

    const apiUrl = `https://ebnelnegm.com/HH/index.php?num=${encodeURIComponent(number)}`;

    try {
      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Referer': 'https://ebnelnegm.com/'
        }
      });

      if (!response.ok) throw new Error(`API responded with status ${response.status}`);
      const data = await response.json();

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data[0] || {}) // إرجاع العنصر الأول فقط
      };

    } catch (apiError) {
      console.error('API Error:', apiError.message);

      // بيانات احتياطية لو فشل الـ API
      const cleanNumber = number.replace(/\D/g, '');
      let carrier = "Vodafone EG";
      if (cleanNumber.startsWith('011')) carrier = "Etisalat EG";
      else if (cleanNumber.startsWith('012')) carrier = "Orange EG";
      else if (cleanNumber.startsWith('015')) carrier = "WE";

      let type = cleanNumber.startsWith('01') ? "mobile" : "landline";

      const backupData = {
        number: number,
        carrier: carrier,
        country: "Egypt",
        countryCode: "20",
        valid: cleanNumber.length >= 10,
        type: type,
        location: "Cairo",
        internationalFormat: `+20${cleanNumber}`,
        name: "غير معروف",
        message: "Data from API reserve",
        timestamp: new Date().toISOString()
      };

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(backupData)
      };
    }

  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: "An unexpected error occurred",
        details: err.message
      })
    };
  }
}
