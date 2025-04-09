
// ===============================
// Smartech Garden Main Script
// ===============================

const moistureEl = document.getElementById("moisture");
const tempEl = document.getElementById("temperature");
const pumpStatusEl = document.getElementById("pump-status");
const pumpIndicator = document.getElementById("pump-indicator-text");

const moistureChartCtx = document.getElementById("moistureChart").getContext("2d");
const tempChartCtx = document.getElementById("tempChart").getContext("2d");

let moistureData = [];
let tempData = [];
let timeLabels = [];

const maxDataPoints = 10;

// Chart.js Setup
const moistureChart = new Chart(moistureChartCtx, {
  type: "line",
  data: {
    labels: timeLabels,
    datasets: [{
      label: "Soil Moisture (%)",
      data: moistureData,
      borderColor: "#27ae60",
      tension: 0.4,
      fill: false
    }]
  },
  options: {
    scales: {
      y: { beginAtZero: true, max: 100 }
    }
  }
});

const tempChart = new Chart(tempChartCtx, {
  type: "line",
  data: {
    labels: timeLabels,
    datasets: [{
      label: "Temperature (°C)",
      data: tempData,
      borderColor: "#e67e22",
      tension: 0.4,
      fill: false
    }]
  },
  options: {
    scales: {
      y: { beginAtZero: true, max: 60 }
    }
  }
});

// Fetch sensor data
async function fetchSensorData() {
  try {
    const res = await fetch("http://192.168.4.1/sensor");
    const data = await res.json();

    const moisture = data.moisture;
    const temp = data.temperature;
    const pumpStatus = data.pump;

    const time = new Date().toLocaleTimeString();

    updateValue(moistureEl, moisture + " %");
    updateValue(tempEl, temp + " °C");
    updateValue(pumpStatusEl, pumpStatus.toUpperCase());

    updatePumpIndicator(pumpStatus);
    updateCharts(time, moisture, temp);

    // Alerts
    if (moisture < 30) showToast("Soil too dry! 💧", "warn");
    if (temp > 40) showToast("Temp too high! 🔥", "warn");

  } catch (err) {
    showToast("Failed to fetch sensor data", "error");
    console.error(err);
  }
}

// Update DOM element with blink animation
function updateValue(el, newValue) {
  if (el.textContent !== newValue) {
    el.textContent = newValue;
    el.classList.add("blink");
    setTimeout(() => el.classList.remove("blink"), 1000);
  }
}

// Update pump status indicator
function updatePumpIndicator(status) {
  if (!pumpIndicator) return;
  pumpIndicator.textContent = "Pump Status: " + status.toUpperCase();
  pumpIndicator.style.color = status === "on" ? "#27ae60" : "#c0392b";
}

// Update Charts
function updateCharts(time, moisture, temp) {
  timeLabels.push(time);
  moistureData.push(moisture);
  tempData.push(temp);

  if (timeLabels.length > maxDataPoints) {
    timeLabels.shift();
    moistureData.shift();
    tempData.shift();
  }

  moistureChart.update();
  tempChart.update();
}

// Control pump
window.controlPump = async (action) => {
  try {
    const res = await fetch("http://192.168.4.1/pump/" + action);
    const result = await res.text();

    showToast("Pump turned " + action, "success");
    fetchSensorData();
  } catch (err) {
    showToast("Failed to control pump", "error");
  }
};

// Toast notification
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "toast toast-" + type;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Lang switcher
document.getElementById("langSwitcher")?.addEventListener("change", (e) => {
  const lang = e.target.value;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = translations[lang][key] || key;
  });
});

// Simple translation
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
    subtitle: "Berkebun Pintar untuk Hidup Modern",
    explore: "Jelajahi Fitur",
    scroll: "Gulir untuk melihat lebih banyak ↓",
    aboutTitle: "Tentang Aplikasi",
    aboutDesc: "Smartech Garden membantu kamu mengotomatiskan kebun dengan pemantauan waktu nyata dan fitur pintar agar tanaman tetap sehat.",
    featuresTitle: "Fitur",
    feature1: "Pemantauan Kelembaban Tanah",
    featureDesc1: "Deteksi kelembaban tanah secara real-time dengan peringatan pintar.",
    feature2: "Kontrol Pompa Manual",
    featureDesc2: "Nyalakan pompa air dari jarak jauh hanya dengan satu sentuhan.",
    feature3: "Penyiraman Otomatis",
    featureDesc3: "Atur jadwal penyiraman atau biarkan sistem yang menentukan.",
    feature4: "Dasbor Interaktif",
    featureDesc4: "Visualisasikan kondisi kebun kamu dengan UI yang bersih dan jelas.",
    mockupTitle: "Pratinjau Antarmuka Aplikasi"
  }
};

// Fetch data every 3s
setInterval(fetchSensorData, 3000);
fetchSensorData();
