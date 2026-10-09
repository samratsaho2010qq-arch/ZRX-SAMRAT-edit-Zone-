const menu = document.querySelector('.hamburger');
const nav = document.querySelector('.header nav');

if (menu && nav) {
  menu.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => nav.classList.remove('open'));
  });
}

const copy = document.querySelector('.copy');

if (copy) {
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copy.dataset.copy);
      const old = copy.textContent;
      copy.textContent = '✓ Copied!';
      setTimeout(() => copy.textContent = old, 1400);
    } catch (e) {
      copy.textContent = 'Copy unavailable';
    }
  });
}

async function loadVNImages() {
  const box = document.getElementById('vn-gallery');
  if (!box) return;

  try {
    const response = await fetch('assets/vn/manifest.json?cache=' + Date.now());
    if (!response.ok) throw new Error('Manifest unavailable');

    const files = await response.json();

    if (!Array.isArray(files) || files.length === 0) {
      box.innerHTML = '<p class="loading">No VN QR images found yet.</p>';
      return;
    }

    box.innerHTML = files.map((file, i) => {
      const imagePath = 'assets/vn/' + file;

      return `<a class="vn-item" href="${imagePath}" target="_blank" rel="noopener">
        <img src="${imagePath}" alt="VN QR code ${i + 1}" loading="lazy">
        <span>Scan / Open →</span>
      </a>`;
    }).join('');

  } catch (error) {
    box.innerHTML = '<p class="loading">VN images could not load. Please refresh later.</p>';
  }
}

loadVNImages();
