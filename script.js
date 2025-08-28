// Matrix animation
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

function initMatrix() {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  const letters = "01";
  const fontSize = 14;
  const columns = canvas.width / fontSize;
  const drops = [];

  for (let x = 0; x < columns; x++) drops[x] = 1;

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
}

// Handle Enter key press
function handleKeyPress(event) {
  if (event.key === "Enter") getInfo();
}

// Country codes mapping
const countryCodes = {
  "20": "eg", "966": "sa", "971": "ae", "962": "jo", "973": "bh",
  "964": "iq", "965": "kw", "968": "om", "974": "qa", "963": "sy",
  "216": "tn", "213": "dz", "212": "ma", "218": "ly", "967": "ye",
  "249": "sd", "253": "dj", "252": "so", "222": "mr"
};

// Extract country code from phone number
function extractCountryCode(phoneNumber) {
  const cleanedNumber = phoneNumber.replace(/\D/g, "");
  for (const code in countryCodes) {
    if (cleanedNumber.startsWith(code)) return code;
  }
  return null;
}

// Display country flag
function displayCountryFlag(countryCode) {
  const flagElement = document.getElementById("countryFlag");
  if (countryCode && countryCodes[countryCode]) {
    const country = countryCodes[countryCode];
    flagElement.style.display = "block";
    flagElement.style.backgroundImage = `url(https://flagcdn.com/w40/${country}.png)`;
    flagElement.style.backgroundSize = "cover";
    flagElement.title = `Number from: ${country}`;
  } else flagElement.style.display = "none";
}

// Loading bar control
function toggleLoader(show) {
  const loaderContainer = document.getElementById("loaderContainer");
  const resultDiv = document.getElementById("result");
  if (show) {
    loaderContainer.style.display = "block";
    resultDiv.innerHTML = "";
  } else loaderContainer.style.display = "none";
}

// Get number info directly from external API
async function getInfo() {
  const nu = document.getElementById("numberInput").value.trim();
  if (!nu) {
    document.getElementById("result").innerHTML = "⚠️ Please enter a number";
    return;
  }

  const countryCode = extractCountryCode(nu);
  displayCountryFlag(countryCode);

  try {
    toggleLoader(true);

    const res = await fetch(`https://ebnelnegm.com/h.php?num=${nu}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    toggleLoader(false);
    document.getElementById("result").innerHTML = JSON.stringify(data, null, 2);
    document.getElementById("numberInput").value = "";
  } catch (e) {
    toggleLoader(false);
    console.error(e);
    document.getElementById("result").innerHTML = "❌ Error fetching data! The external source is unavailable or the number does not exist.";
  }
}

// Initialize application
document.addEventListener("DOMContentLoaded", function () {
  initMatrix();
  document.getElementById("numberInput").addEventListener("keypress", handleKeyPress);
  document.getElementById("searchButton").addEventListener("click", getInfo);

  window.addEventListener("resize", function () {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  });
});
