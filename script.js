// Hamburger Navigation
const menu = document.querySelector('.hamburger');
const nav = document.querySelector('.header nav');

if (menu && nav) {
  menu.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
    });
  });
}

// Copy Prompt Button
const copy = document.querySelector('.copy');

if (copy) {
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copy.dataset.copy);
      const old = copy.textContent;
      copy.textContent = '✓ Copied!';
      setTimeout(() => {
        copy.textContent = old;
      }, 1400);
    } catch (error) {
      copy.textContent = 'Copy unavailable';
    }
  });
}

// VN QR Image Gallery
async function loadVNImages() {
  const box = document.getElementById('vn-gallery');
  if (!box) return;

  try {
    const response = await fetch(
      'assets/vn/manifest.json?cache=' + Date.now()
    );

    if (!response.ok) throw new Error('Manifest unavailable');

    const files = await response.json();

    if (!Array.isArray(files) || files.length === 0) {
      box.innerHTML = '<p class="loading">No VN QR images found yet.</p>';
      return;
    }

    box.innerHTML = '';

    files.forEach((file, i) => {
      const imagePath = 'assets/vn/' + file;
      const item = document.createElement('a');
      item.className = 'vn-item';
      item.href = imagePath;
      item.target = '_blank';
      item.rel = 'noopener';

      const img = document.createElement('img');
      img.src = imagePath;
      img.alt = 'VN QR code ' + (i + 1);
      img.loading = 'lazy';

      const label = document.createElement('span');
      label.textContent = 'Scan / Open →';

      item.append(img, label);
      box.appendChild(item);
    });
  } catch (error) {
    box.innerHTML =
      '<p class="loading">VN images could not load. Please refresh later.</p>';
  }
}

// AI Prompt Gallery
async function loadPromptGallery() {
  const section = document.getElementById('prompt-showcase');
  if (!section) return;

  let gallery = document.getElementById('dynamic-prompts');

  if (!gallery) {
    gallery = document.createElement('div');
    gallery.id = 'dynamic-prompts';
    gallery.style.cssText =
      'display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin:24px 0;padding:12px;';

    section.appendChild(gallery);
  }

  gallery.innerHTML = '';

  const heading = document.createElement('h2');
  heading.textContent = '✨ More AI Photo Editing Prompts';
  heading.style.cssText =
    'grid-column:1/-1;text-align:center;';
  gallery.appendChild(heading);

  try {
    const response = await fetch(
      'prompts/manifest.json?cache=' + Date.now()
    );

    if (!response.ok) throw new Error('Manifest not found');

    const prompts = await response.json();

    if (!Array.isArray(prompts) || prompts.length === 0) {
      const message = document.createElement('p');
      message.textContent = 'No prompts added yet.';
      gallery.appendChild(message);
      return;
    }

    prompts.forEach(prompt => {
      if (!prompt.title || !prompt.file) return;

      const card = document.createElement('div');
      card.style.cssText =
        'padding:18px;border-radius:12px;background:#20152b;color:#fff;border:1px solid #e8a64a;';

      // Prompt image
      if (prompt.image) {
        const img = document.createElement('img');
        img.src = prompt.image;
        img.alt = prompt.title;
        img.loading = 'lazy';
        img.style.cssText =
          'display:block;width:100%;height:180px;object-fit:cover;border-radius:8px;margin-bottom:12px;';

        img.onerror = () => {
          img.alt = 'Image could not be loaded';
          img.style.display = 'none';
        };

        card.appendChild(img);
      }

      const title = document.createElement('h3');
      title.textContent = prompt.title;

      const category = document.createElement('p');
      category.textContent = prompt.category || 'AI Photo Editing';

      const description = document.createElement('p');
      description.textContent = prompt.description || '';

      const link = document.createElement('a');
      link.textContent = 'Open Prompt →';
      link.href = 'prompts/' + prompt.file;
      link.style.cssText =
        'display:inline-block;margin-top:10px;padding:10px 14px;background:#e8a64a;color:#20152b;border-radius:7px;text-decoration:none;font-weight:bold;';

      card.append(title, category, description, link);
      gallery.appendChild(card);
    });
  } catch (error) {
    const message = document.createElement('p');
    message.textContent =
      'Prompts could not load. Please refresh later.';
    gallery.appendChild(message);
  }
}

// Start galleries
loadVNImages();
loadPromptGallery();
