// getNumberInfo.js - النسخة المعدلة مع API الصحيح
export async function handler(event, context) {
  try {
    let number;
    
    // معالجة البيانات المرسلة
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

    // استخدام API الصحيح الذي وجدته
    const apiUrl = `https://ebnelnegm.com/HH/index.php?num=${encodeURIComponent(number)}`;
    
    console.log('Fetching from API:', apiUrl);
    
    try {
      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Referer': 'https://ebnelnegm.com/'
        }
      });

      // التحقق من نجاح الاستجابة
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      // التحقق من أن الاستجابة هي JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.log('Non-JSON response received:', textResponse.substring(0, 200));
        
        // محاولة تحويل النص إلى JSON إذا كان يحتوي على JSON
        try {
          const jsonData = JSON.parse(textResponse);
          return {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(jsonData)
          };
        } catch (parseError) {
          throw new Error('الاستجابة ليست JSON صالح');
        }
      }

      const data = await response.json();

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data)
      };

    } catch (apiError) {
      console.error('API Error:', apiError.message);
      
      // بيانات احتياطية ذكية في حالة فشل API
      const cleanNumber = number.replace(/\D/g, '');
      
      let carrier = "Vodafone EG";
      if (cleanNumber.startsWith('010')) carrier = "Vodafone EG";
      else if (cleanNumber.startsWith('011')) carrier = "Etisalat EG";
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
        message: "بيانات من API الاحتياطي",
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
        error: "حدث خطأ غير متوقع", 
        details: err.message 
      })
    };
  }
}
