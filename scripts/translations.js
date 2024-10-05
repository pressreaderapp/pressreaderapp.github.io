// Get the script element
const script = document.getElementById('translationsScript');

// Get the base URL of the script
const baseUrl = new URL(script.src).pathname.split('/').slice(0, -1).join('/');

// Construct the URL for the translations file
const translationsUrl = `${baseUrl}/../resources/translations.json`;

fetch(translationsUrl)
  .then(response => response.json())
  .then(data => {
    window.translations = data;
    initializeLanguageSwitcher();
  })
  .catch(error => console.error('Error loading translations:', error));

function getCurrentLanguage() {
  return localStorage.getItem('language') || 'en';
}

function setLanguage(lang) {
  localStorage.setItem('language', lang);
  updateLanguage(lang);
  updateActiveLanguage();
  document.dispatchEvent(new Event('languageChanged'));
}

function updateLanguage(lang) {
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    if (window.translations[key] && window.translations[key][lang]) {
      element.textContent = window.translations[key][lang];
    }
  });
  document.querySelectorAll('[data-translate-src]').forEach(img => {
    const key = img.getAttribute('data-translate-src');
    if (translations[key] && translations[key][lang]) {
    img.src = translations[key][lang];
    }
  });
  document.querySelectorAll('[data-translate-alt]').forEach(img => {
    const key = img.getAttribute('data-translate-alt');
    if (translations[key] && translations[key][lang]) {
    img.alt = translations[key][lang];
    }
  });
  document.documentElement.lang = lang;
}

function updateActiveLanguage() {
  const currentLang = getCurrentLanguage();
  document.querySelectorAll('.language-option').forEach(option => {
    option.classList.toggle('active', option.getAttribute('data-lang') === currentLang);
  });
}

function initializeLanguageSwitcher() {
  document.querySelectorAll('.language-option').forEach(option => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      setLanguage(option.getAttribute('data-lang'));
    });
  });

  updateLanguage(getCurrentLanguage());
  updateActiveLanguage();
}

function translate(key) {
  const lang = getCurrentLanguage();
  if (translations[key] && translations[key][lang]) {
    return translations[key][lang];
  }
  console.warn(`Translation not found for key: ${key} in language: ${lang}`);
  return key; // Return the key itself if translation is not found
}