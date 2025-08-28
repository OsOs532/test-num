    // Matrix Effect
    const canvas = document.getElementById("matrix");
    const ctx = canvas.getContext("2d");
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

    // Fetch API
    async function getInfo() {
      const nu = document.getElementById("numberInput").value.trim();
      if(!nu) {
        document.getElementById("result").innerHTML = "⚠️ اكتب رقم صحيح!";
        return;
      }
      try {
        const res = await fetch(`https://ebnelnegm.com/HH/index.php?num=${nu}`);
        const data = await res.json();
        document.getElementById("result").innerHTML = JSON.stringify(data, null, 2);
        
        // مسح الرقم من صندوق الإدخال بعد نجاح البحث
        document.getElementById("numberInput").value = "";
      } catch (e) {
        document.getElementById("result").innerHTML = "❌ خطأ: لم يتم جلب البيانات.";
      }
    }
