exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { number } = JSON.parse(event.body);
        const formattedNumber = number.startsWith('20') ? number : '20' + number.replace(/^0+/, '');

        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '3a745ccb10msh93d34609a092a15p10c4bbjsnf0e891e5d920',
                'x-rapidapi-host': 'syncme.p.rapidapi.com'
            }
        };

        // استخدام fetch العادية بدون require
        const response = await fetch(`https://syncme.p.rapidapi.com/api/v1/search?number=${formattedNumber}`, options);
        const data = await response.json();

        const resultName = data.name || data.fullName || (data.result && data.result.name) || "غير مسجل";

        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" // عشان يشتغل من أي مكان
            },
            body: JSON.stringify({
                name: resultName,
                number: formattedNumber
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server Error" }),
        };
    }
};
