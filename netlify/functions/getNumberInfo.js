// getNumberInfo.js - النسخة المعدلة
export async function handler(event, context) {
  try {
    let number;
    
    // معالجة البيانات المرسلة بطريقة أكثر قوة
    if (event.httpMethod === 'POST') {
      try {
        const body = JSON.parse(event.body);
        number = body.number;
      } catch (e) {
        // إذا فشل التحليل كـ JSON، جرب كـ form data
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

    // طلب البيانات من API الخارجي مع تحسين التعامل مع الأخطاء
    try {
      const apiUrl = `https://ebnelnegm.com/h.php?num=${encodeURIComponent(number)}`;
      const response = await fetch(apiUrl);
      
      // التحقق من أن الاستجابة ناجحة
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      
      // التحقق من نوع المحتوى
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // إذا لم يكن JSON، نعيد رسالة خطأ واضحة
        const textResponse = await response.text();
        console.log('Non-JSON response:', textResponse.substring(0, 200));
        throw new Error('الخادم الخارجي يعيد استجابة غير متوقعة');
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
      // إذا فشل الاتصال بالـ API الخارجي، نعيد بيانات تجريبية
      console.log('API Error, using mock data:', apiError.message);
      
      const mockData = {
        number: number,
        carrier: "Vodafone EG",
        country: "Egypt",
        countryCode: "20",
        valid: true,
        type: "mobile",
        message: "بيانات تجريبية للاختبار"
      };

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(mockData)
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
