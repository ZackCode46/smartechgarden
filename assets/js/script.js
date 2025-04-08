// Language Switcher
const langSwitcher = document.getElementById("langSwitcher");
const translations = {
  en: {
    welcome: "Welcome to Smartech Garden",
    subtitle: "Smart Farming for Modern Living",
    explore: "Explore Features",
    scroll: "Scroll to discover more ↓",
    aboutTitle: "About the App",
    aboutDesc: "Smartech Garden helps you automate your garden with real-time monitoring and smart features to ensure your plants stay healthy.",
    featuresTitle: "Features",
    feature1: "Soil Moisture Monitoring",
    featureDesc1: "Real-time soil moisture detection with smart alerts.",
    feature2: "Manual Pump Control",
    featureDesc2: "Turn on the water pump remotely with one tap.",
    feature3: "Automatic Watering",
    featureDesc3: "Schedule watering times or let the system decide when your plants need it.",
    feature4: "Interactive Dashboard",
    featureDesc4: "Visualize your garden's condition with clean and clear UI.",
    mockupTitle: "App Interface Preview"
  },
  id: {
    welcome: "Selamat datang di Smartech Garden",
    subtitle: "Pertanian Pintar untuk Kehidupan Modern",
    explore: "Jelajahi Fitur",
    scroll: "Gulir untuk temukan lebih banyak ↓",
    aboutTitle: "Tentang Aplikasi",
    aboutDesc: "Smartech Garden membantu mengotomatiskan kebun Anda dengan pemantauan waktu nyata dan fitur pintar agar tanaman Anda tetap sehat.",
    featuresTitle: "Fitur",
    feature1: "Pemantauan Kelembaban Tanah",
    featureDesc1: "Deteksi kelembaban tanah secara real-time dengan peringatan pintar.",
    feature2: "Kontrol Pompa Manual",
    featureDesc2: "Nyalakan pompa air dari jarak jauh dengan satu ketukan.",
    feature3: "Penyiraman Otomatis",
    featureDesc3: "Jadwalkan waktu penyiraman atau biarkan sistem memutuskan kapan tanaman Anda membutuhkannya.",
    feature4: "Dasbor Interaktif",
    featureDesc4: "Visualisasikan kondisi kebun Anda dengan antarmuka yang bersih dan jelas.",
    mockupTitle: "Pratinjau Antarmuka Aplikasi"
  }
};

langSwitcher.addEventListener("change", (e) => {
  const lang = e.target.value;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
});

// Chart.js Setup
const moistureCtx = document.getElementById('moistureChart').getContext('2d');
const tempCtx = document.getElementById('tempChart').getContext('2d');

const moistureChart = new Chart(moistureCtx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Soil Moisture (%)',
      data: [],
      borderColor: '#27ae60',
      backgroundColor: 'rgba(39, 174, 96, 0.2)',
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  }
});

const tempChart = new Chart(tempCtx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Temperature (°C)',
      data: [],
      borderColor: '#2980b9',
      backgroundColor: 'rgba(52, 152, 219, 0.2)',
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 50
      }
    }
  }
});

// Lightbox Image Script
const lightbox = document.createElement('div');
lightbox.classList.add('lightbox', 'hidden');
document.body.appendChild(lightbox);

const img = document.createElement('img');
img.classList.add('lightbox-img');
lightbox.appendChild(img);

const closeBtn = document.createElement('div');
closeBtn.classList.add('close-btn');
closeBtn.innerHTML = '&times;';
lightbox.appendChild(closeBtn);

const mockupImgs = document.querySelectorAll('.mockup-images img');
mockupImgs.forEach(image => {
  image.addEventListener('click', () => {
    img.src = image.src;
    lightbox.classList.remove('hidden');
  });
});

closeBtn.addEventListener('click', () => {
  lightbox.classList.add('hidden');
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target === closeBtn) {
    lightbox.classList.add('hidden');
  }
});

// ESP Integration: Fetch Sensor Data
const moistureEl = document.getElementById("moisture");
const tempEl = document.getElementById("temperature");
const pumpStatusEl = document.getElementById("pump-status");

function updateSensor(el, value) {
  el.textContent = value;
  el.classList.add("blink");
  setTimeout(() => el.classList.remove("blink"), 500);
}

function addChartData(chart, value) {
  const now = new Date();
  const timeLabel = now.toLocaleTimeString();
  chart.data.labels.push(timeLabel);
  chart.data.datasets[0].data.push(value);
  if (chart.data.labels.length > 10) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }
  chart.update();
}

async function fetchSensorData() {
  try {
    const res = await fetch("http://192.168.4.1/data"); // Ganti IP sesuai ESP
    const data = await res.json();

    updateSensor(moistureEl, data.moisture + "%");
    updateSensor(tempEl, data.temperature + "°C");
    pumpStatusEl.textContent = data.pump === "on" ? "ON" : "OFF";
    pumpStatusEl.style.color = data.pump === "on" ? "#27ae60" : "#c0392b";

    addChartData(moistureChart, data.moisture);
    addChartData(tempChart, data.temperature);
  } catch (err) {
    console.error("Fetch failed:", err);
    moistureEl.textContent = "-- %";
    tempEl.textContent = "-- °C";
    pumpStatusEl.textContent = "--";
  }
}

setInterval(fetchSensorData, 3000);

window.controlPump = async (action) => {
  try {
    const res = await fetch(`http://192.168.4.1/pump/${action}`);
    const result = await res.text();
    alert(result);
    fetchSensorData();
  } catch (err) {
    alert("Command failed");
  }
};
