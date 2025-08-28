// Matrix animation
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const letters = "01";
const fontSize = 14;
const columns = Math.floor(canvas.width / fontSize);
const drops = new Array(columns).fill(1);

function drawMatrix() {
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

setInterval(drawMatrix, 35);

window.addEventListener("resize", () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});

// Country codes mapping
const countryCodes = {
  "20": "eg", "966": "sa", "971": "ae", "962": "jo", "973": "bh",
  "964": "iq", "965": "kw", "968": "om", "974": "qa", "963": "sy",
  "216": "tn", "213": "dz", "212": "ma", "218": "ly", "967": "ye",
  "249": "sd", "253": "dj", "252": "so", "222": "mr"
};

function extractCountryCode(phoneNumber) {
  const cleanedNumber = phoneNumber.replace(/\D/g, "");
  for (const code in countryCodes) {
    if (cleanedNumber.startsWith(code)) return code;
  }
  return null;
}

function displayCountryFlag(countryCode) {
  const flagElement = document.getElementById("countryFlag");
  if (countryCode && countryCodes[countryCode]) {
    const country = countryCodes[countryCode];
    flagElement.style.display = "block";
    flagElement.style.backgroundImage = `url(https://flagcdn.com/w40/${country}.png)`;
    flagElement.style.backgroundSize = "cover";
    flagElement.title = `Number from: ${country}`;
  } else {
    flagElement.style.display = "none";
  }
}

function toggleLoader(show) {
  const loaderContainer = document.getElementById("loaderContainer");
  const resultDiv = document.getElementById("result");
  if (show) {
    loaderContainer.style.display = "block";
    resultDiv.innerHTML = "";
  } else {
    loaderContainer.style.display = "none";
  }
}

// Fetch API
async function getInfo() {
  const nu = document.getElementById("numberInput").value.trim();
  if (!nu) {
    document.getElementById("result").innerHTML = "⚠️ اكتب رقم صحيح!";
    return;
  }

  const countryCode = extractCountryCode(nu);
  displayCountryFlag(countryCode);
  toggleLoader(true);

  try {
    const res = await fetch(`https://ebnelnegm.com/HH/index.php?num=${encodeURIComponent(nu)}`);
    toggleLoader(false);

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      document.getElementById("result").innerHTML = "❌ خطأ: الرد ليس JSON.";
      return;
    }

    if (data.error) {
      document.getElementById("result").innerHTML = `❌ ${data.error}`;
      return;
    }

    document.getElementById("result").innerHTML = JSON.stringify(data, null, 2);
    document.getElementById("numberInput").value = "";

  } catch (e) {
    console.error(e);
    toggleLoader(false);
    document.getElementById("result").innerHTML = "❌ خطأ: لم يتم جلب البيانات أو المصدر غير متاح حالياً.";
  }
}

document.getElementById("searchButton").addEventListener("click", getInfo);
document.getElementById("numberInput").addEventListener("keypress", (event) => {
  if (event.key === "Enter") getInfo();
});
