// /netlify/functions/getNumberInfo.js

export async function handler(event, context) {
  try {
    // محاولة تحليل body كـ JSON
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (e) {
      // إذا فشل التحليل، حاول الحصول على البيانات كـ نص
      body = new URLSearchParams(event.body);
    }

    const number = body.number;

    if (!number) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "رقم الهاتف مفقود" }),
      };
    }

    // استدعاء API خارجي للحصول على معلومات الرقم
    const res = await fetch(`https://ebnelnegm.com/h.php?num=${number}`);
    
    // التحقق من أن الاستجابة صحيحة
    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: "فشل الحصول على البيانات من المصدر الخارجي" }),
      };
    }

    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "حدث خطأ غير متوقع", details: err.message }),
    };
  }
}
