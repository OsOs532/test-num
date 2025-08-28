// Matrix Effect
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");
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

// Fetch API
async function getInfo() {
  const nu = document.getElementById("numberInput").value.trim();
  if (!nu) {
    document.getElementById("result").innerHTML = "⚠️ اكتب رقم صحيح!";
    return;
  }

  document.getElementById("result").innerHTML = "⏳ جاري جلب البيانات...";

  try {
    const res = await fetch(`https://ebnelnegm.com/HH/index.php?num=${encodeURIComponent(nu)}`);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      document.getElementById("result").innerHTML = "❌ خطأ: الرد ليس JSON.";
      return;
    }

    document.getElementById("result").innerHTML = JSON.stringify(data, null, 2);
    document.getElementById("numberInput").value = "";
  } catch (e) {
    console.error(e);
    document.getElementById("result").innerHTML = "❌ خطأ: لم يتم جلب البيانات.";
  }
}

document.getElementById("searchButton").addEventListener("click", getInfo);
document.getElementById("numberInput").addEventListener("keypress", (event) => {
  if (event.key === "Enter") getInfo();
});
