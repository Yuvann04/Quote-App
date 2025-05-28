const quoteDiv = document.getElementById('quote');
const newQuoteBtn = document.getElementById('new-quote');
const themeToggleBtn = document.getElementById('toggle-theme');

async function fetchQuote() {
  try {
    const res = await fetch('https://api.quotable.io/random');
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    quoteDiv.textContent = `"${data.content}" — ${data.author}`;
    localStorage.setItem('latestQuote', quoteDiv.textContent);
  } catch (e) {
    const cachedQuote = localStorage.getItem('latestQuote');
    if (cachedQuote) {
      quoteDiv.textContent = cachedQuote + ' (Offline)';
    } else {
      quoteDiv.textContent = 'Failed to fetch quote and no cached version found.';
    }
  }
}

newQuoteBtn.addEventListener('click', fetchQuote);

themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
});

window.addEventListener('load', () => {
  fetchQuote();
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
  }
});
