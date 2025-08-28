// Matrix animation
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

function initMatrix() {
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
    
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
    console.log("Fetching data for number:", nu);

    try {
        const apiUrl = `https://ebnelnegm.com/HH/index.php?num=${encodeURIComponent(nu)}`;
        console.log("API URL:", apiUrl);
        
        const res = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        
        console.log("Response status:", res.status, res.statusText);
        
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status} ${res.statusText}`);
        }

        const text = await res.text();
        console.log("Raw response text:", text);
        
        let data;
        try {
            data = JSON.parse(text);
            console.log("Parsed JSON data:", data);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            resultDiv.innerHTML = "❌ Error: Response is not valid JSON.<br>Server response: " + text;
            return;
        }

        // عرض البيانات بشكل منظم
        if (data && typeof data === 'object') {
            let html = '<div class="result-data" style="text-align: left; padding: 10px; background: #111; border: 1px solid #0f0; border-radius: 5px; margin: 10px 0;">';
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    html += `<strong style="color: #0f0;">${key}:</strong> <span style="color: white;">${data[key]}</span><br>`;
                }
            }
            html += '</div>';
            resultDiv.innerHTML = html;
        } else {
            resultDiv.innerHTML = "📋 Response: " + JSON.stringify(data, null, 2);
        }
        
        document.getElementById("numberInput").value = "";
        
    } catch (e) {
        console.error("Fetch Error Details:", e);
        resultDiv.innerHTML = `
            ❌ Error: Could not fetch data<br>
            <small style="color: #888;">${e.message}</small>
        `;
    }
}

// Test the API directly
async function testAPI() {
    console.log("Testing API directly...");
    try {
        const testResponse = await fetch('https://ebnelnegm.com/HH/index.php?num=123');
        console.log("Test response status:", testResponse.status);
        const testText = await testResponse.text();
        console.log("Test response text:", testText);
    } catch (testError) {
        console.error("API test failed:", testError);
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing...");
    
    if (canvas) {
        initMatrix();
    } else {
        console.error("Canvas element with ID 'matrix' not found!");
    }
    
    const searchButton = document.getElementById("searchButton");
    const numberInput = document.getElementById("numberInput");
    
    if (searchButton) {
        searchButton.addEventListener("click", getInfo);
        console.log("Search button event listener added");
    } else {
        console.error("Search button not found!");
    }
    
    if (numberInput) {
        numberInput.addEventListener("keypress", handleKeyPress);
        console.log("Number input event listener added");
    } else {
        console.error("Number input not found!");
    }
    
    // Test the API on load
    testAPI();
});
