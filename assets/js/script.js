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