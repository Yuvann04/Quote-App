const quoteEl = document.getElementById('quote');
const authorEl = document.getElementById('author');
const newQuoteBtn = document.getElementById('new-quote');
const themeToggleBtn = document.getElementById('theme-toggle');

const QUOTE_API = 'https://zenquotes.io/api/random';
const LOCAL_QUOTES_KEY = 'quotes_cache';

// Display a loading message
function displayLoading() {
  quoteEl.textContent = 'Loading...';
  authorEl.textContent = '';
}

// Load and display a quote
async function fetchAndDisplayQuote() {
  displayLoading();

  try {
    const proxyURL = 'https://api.allorigins.win/get?url=' + encodeURIComponent(QUOTE_API);
    const res = await fetch(proxyURL);
    if (!res.ok) throw new Error('Proxy/API error');

    const data = await res.json();
    const parsed = JSON.parse(data.contents);

    displayQuote(parsed[0].q, parsed[0].a);
    saveQuoteToLocal(parsed[0].q, parsed[0].a);
  } catch (err) {
    console.error('Fetch failed:', err.message);
    const cached = getRandomCachedQuote();
    if (cached) {
      displayQuote(cached.content, cached.author + ' (offline)');
    } else {
      displayQuote('No quote available offline.', '');
    }
  }
}

function displayQuote(quote, author) {
  quoteEl.textContent = quote;
  authorEl.textContent = author ? `— ${author}` : '';
}

function saveQuoteToLocal(content, author) {
  let quotes = JSON.parse(localStorage.getItem(LOCAL_QUOTES_KEY)) || [];
  quotes.push({ content, author });
  if (quotes.length > 20) quotes = quotes.slice(-20);
  localStorage.setItem(LOCAL_QUOTES_KEY, JSON.stringify(quotes));
}

function getRandomCachedQuote() {
  const quotes = JSON.parse(localStorage.getItem(LOCAL_QUOTES_KEY)) || [];
  if (quotes.length === 0) return null;
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// Theme toggle
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Load theme preference
(function () {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') document.body.classList.add('dark-mode');
})();

// Event listeners
newQuoteBtn.addEventListener('click', fetchAndDisplayQuote);

// On load
window.addEventListener('load', () => {
  fetchAndDisplayQuote();

  // Register service worker only on http(s) origins
  if ('serviceWorker' in navigator &&
      (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
    navigator.serviceWorker.register('service-worker.js');
  }
});
