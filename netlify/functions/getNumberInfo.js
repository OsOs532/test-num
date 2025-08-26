export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);
    const number = body.number;

    if (!number) {
      return { statusCode: 400, body: JSON.stringify({ error: "رقم الهاتف مفقود" }) };
    }

    // استدعاء الـ API الخارجي من هنا
    const res = await fetch(`https://ebnelnegm.com/h.php?num=${number}`);
    const data = await res.json();

    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "حدث خطأ", details: err.message }) };
  }
}
