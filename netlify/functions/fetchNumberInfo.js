export async function handler(event, context) {
  try {
    const number = event.queryStringParameters?.num;

    if (!number) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Phone number is missing" }),
      };
    }

    const res = await fetch(`https://ebnelnegm.com/h.php?num=${number}`);
    
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to get data from external source", details: text }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Unexpected error", details: err.message }),
    };
  }
}
