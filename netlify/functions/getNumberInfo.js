export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);
    const number = body.number;

    if (!number) {
      return { statusCode: 400, body: JSON.stringify({ error: "رقم الهاتف مفقود" }) };
    }

    const res = await fetch(`https://ebnelnegm.com/h.php?num=${number}`);
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return { statusCode: 500, body: JSON.stringify({ error: "فشل الحصول على البيانات من المصدر الخارجي", details: text }) };
    }

    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "حدث خطأ غير متوقع", details: err.message }) };
  }
}
