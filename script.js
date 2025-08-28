// Matrix animation
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

function initMatrix() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    const letters = "01";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    function draw() {
        ctx.fillStyle = "rgba(0,0,0,0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#0f0";
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = letters.charAt(Math.floor(Math.random() * letters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }

    setInterval(draw, 35);

    window.addEventListener("resize", () => {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
    });
}

// Handle Enter key press
function handleKeyPress(event) {
    if (event.key === "Enter") getInfo();
}

// Get number info from external API
async function getInfo() {
    const nu = document.getElementById("numberInput").value.trim();
    const resultDiv = document.getElementById("result");

    if (!nu) {
        resultDiv.innerHTML = "⚠️ Type an integer!";
        return;
    }

    // التحقق من أن المدخل رقم صحيح
    if (!/^\d+$/.test(nu)) {
        resultDiv.innerHTML = "⚠️ Please enter a valid integer!";
        return;
    }

    resultDiv.innerHTML = "⏳ Fetching data...";

    try {
        const res = await fetch(`https://ebnelnegm.com/HH/index.php?num=${encodeURIComponent(nu)}`);
        
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const text = await res.text();
        console.log("Raw response:", text); // لأغراض التصحيح
        
        let data;
        try {
            data = JSON.parse(text);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            resultDiv.innerHTML = "❌ Error: Response is not valid JSON.<br>Server response: " + text;
            return;
        }

        // عرض البيانات بشكل منظم
        if (data && typeof data === 'object') {
            let html = '<div class="result-data">';
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    html += `<strong>${key}:</strong> ${data[key]}<br>`;
                }
            }
            html += '</div>';
            resultDiv.innerHTML = html;
        } else {
            resultDiv.innerHTML = "📋 Response: " + JSON.stringify(data, null, 2);
        }
        
        document.getElementById("numberInput").value = "";
    } catch (e) {
        console.error("Fetch Error:", e);
        resultDiv.innerHTML = "❌ Error: Could not fetch data. Check console for details.";
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    if (canvas) {
        initMatrix();
    }
    
    const searchButton = document.getElementById("searchButton");
    const numberInput = document.getElementById("numberInput");
    
    if (searchButton) {
        searchButton.addEventListener("click", getInfo);
    }
    
    if (numberInput) {
        numberInput.addEventListener("keypress", handleKeyPress);
    }
});
