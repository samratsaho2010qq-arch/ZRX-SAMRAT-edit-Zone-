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
// AI Prompt Gallery - Automatic Loader
async function loadPromptGallery() {
  const section = document.getElementById('prompt-showcase');
  if (!section) return;

  const gallery = document.createElement('div');
  gallery.id = 'dynamic-prompts';
  gallery.style.cssText =
    'display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin:24px 0;padding:12px;';

  const heading = document.createElement('h2');
  heading.textContent = '✨ More AI Photo Editing Prompts';
  heading.style.cssText = 'grid-column:1/-1;text-align:center;';
  gallery.appendChild(heading);

  section.appendChild(gallery);

  try {
    const response = await fetch('prompts/manifest.json?cache=' + Date.now());
    if (!response.ok) throw new Error('Manifest not found');

    const prompts = await response.json();

    if (!Array.isArray(prompts) || prompts.length === 0) {
      gallery.textContent = 'No prompts added yet.';
      return;
    }

    prompts.forEach(prompt => {
      if (!prompt.title || !prompt.file) return;

      const card = document.createElement('div');
      card.style.cssText =
        'padding:18px;border-radius:12px;background:#20152b;color:#fff;border:1px solid #e8a64a;';

      const title = document.createElement('h3');
      title.textContent = prompt.title;

      const category = document.createElement('p');
      category.textContent = prompt.category || 'AI Photo Editing';

      const description = document.createElement('p');
      description.textContent = prompt.description || '';

      const link = document.createElement('a');
      link.textContent = 'Open Prompt →';
      link.href = 'prompts/' + encodeURIComponent(prompt.file);
      link.style.cssText =
        'display:inline-block;margin-top:10px;padding:10px 14px;background:#e8a64a;color:#20152b;border-radius:7px;text-decoration:none;font-weight:bold;';

      card.append(title, category, description, link);
      gallery.appendChild(card);
    });
  } catch (error) {
    gallery.textContent = 'Prompts could not load. Please refresh later.';
  }
}

loadPromptGallery();
