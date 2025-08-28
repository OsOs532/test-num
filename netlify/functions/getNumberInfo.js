// getNumberInfo.js - مع APIs بديلة
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

    // قائمة بـ APIs بديلة مجانية
    const apiEndpoints = [
      // AbstractAPI (يتطلب API key مجاني)
      `https://phonevalidation.abstractapi.com/v1/?api_key=TEST&phone=${number}`,
      
      // NumVerify (يتطلب API key مجاني)  
      `http://apilayer.net/api/validate?access_key=TEST&number=${number}`,
      
      // API مجاني آخر
      `https://numverify.com/php_helper_scripts/phone_api.php?number=${number}`,
      
      // OpenCNAM (للمعلومات الأساسية)
      `https://api.opencnam.com/v3/phone/${number}?account_sid=TEST&auth_token=TEST`
    ];

    let apiData = null;
    
    // جرب APIs البديلة
    for (const endpoint of apiEndpoints) {
      try {
        console.log('Trying API:', endpoint);
        const response = await fetch(endpoint, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            apiData = await response.json();
            console.log('API success:', apiData);
            break;
          }
        }
      } catch (error) {
        console.log('API failed:', endpoint, error.message);
        continue;
      }
    }

    // إذا لم تعمل أي API، استخدم البيانات المحسنة
    if (!apiData) {
      console.log('All APIs failed, using enhanced mock data');
      
      // بيانات تجريبية أكثر واقعية بناء على رقم الهاتف
      const carriers = ["Vodafone EG", "Orange EG", "Etisalat EG", "WE"];
      const types = ["mobile", "landline", "voip"];
      
      apiData = {
        number: number,
        carrier: carriers[Math.floor(Math.random() * carriers.length)],
        country: "Egypt",
        countryCode: "20",
        valid: Math.random() > 0.2, // 80% chance valid
        type: types[Math.floor(Math.random() * types.length)],
        location: "Cairo",
        message: "بيانات تجريبية محسنة",
        timestamp: new Date().toISOString()
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(apiData)
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
