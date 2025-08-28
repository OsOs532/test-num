export async function handler(event, context) {
  try {
    // رقم الهاتف يُرسل كـ query string
    const number = event.queryStringParameters?.num;

    if (!number) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "رقم الهاتف مفقود" }),
      };
    }

    // طلب GET مباشر للمصدر الخارجي
    const res = await fetch(`https://ebnelnegm.com/h.php?num=${number}`);
    
    // التحقق من الرد كنص أولًا
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "فشل الحصول على البيانات من المصدر الخارجي",
          details: text.trim()
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "حدث خطأ غير متوقع",
        details: err.message
      }),
    };
  }
}
