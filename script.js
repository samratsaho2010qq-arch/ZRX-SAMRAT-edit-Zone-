// =====================================
// ZRX SAMRAT Edit Zone - script.js
// Latest 3 Items on Homepage
// =====================================


// 1. Hamburger Navigation
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


// 2. Copy Prompt Button
const copy = document.querySelector('.copy');

if (copy) {
  copy.addEventListener('click', async () => {
    const text = copy.dataset.copy || '';

    try {
      await navigator.clipboard.writeText(text);
      const old = copy.textContent;
      copy.textContent = '✓ Copied!';
      setTimeout(() => copy.textContent = old, 1400);
    } catch (error) {
      copy.textContent = 'Copy unavailable';
    }
  });
}


// Common Image Path Helper
function imagePath(path, folder = '') {
  if (!path) return '';

  if (/^(https?:)?\/\//i.test(path) || path.startsWith('/')) {
    return path;
  }

  if (path.startsWith('prompts/') || path.startsWith('assets/')) {
    return './' + path;
  }

  return './' + folder + path;
}


// Common Card Style
function makeCard() {
  const card = document.createElement('article');

  card.style.cssText = `
    padding:14px;
    border-radius:14px;
    background:#20152b;
    color:#fff;
    border:1px solid #e8a64a;
    overflow:hidden;
  `;

  return card;
}


// Common Image Style
function makeImage(src, alt, height = '190px') {
  const img = document.createElement('img');

  img.src = src;
  img.alt = alt;
  img.loading = 'lazy';

  img.style.cssText = `
    display:block;
    width:100%;
    height:${height};
    object-fit:contain;
    border-radius:9px;
    background:#111;
    margin-bottom:12px;
  `;

  img.onerror = () => {
    img.style.display = 'none';
  };

  return img;
}


// 3. Photo Editing Gallery - Latest 3
async function loadPhotoGallery() {
  const box = document.getElementById('home-photo-gallery');
  if (!box) return;

  try {
    const response = await fetch(
      './prompts/gallery-manifest.json?cache=' + Date.now()
    );

    if (!response.ok) throw new Error('Gallery manifest unavailable');

    const items = await response.json();

    box.innerHTML = '';

    if (!Array.isArray(items) || items.length === 0) {
      box.textContent = 'No photo edits uploaded yet.';
      return;
    }

    items.slice().reverse().slice(0, 3).forEach(item => {
      if (!item || !item.image) return;

      const card = makeCard();

      const img = makeImage(
        imagePath(item.image, 'prompts/'),
        item.title || 'Photo Editing',
        '210px'
      );

      const title = document.createElement('h3');
      title.textContent = item.title || 'Photo Editing';

      card.append(img, title);
      box.appendChild(card);
    });

  } catch (error) {
    console.error('Photo Gallery Error:', error);
    box.textContent = 'Photo gallery could not load.';
  }
}


// 4. AI Photo Editing Prompts - Latest 3
async function loadPromptGallery() {
  const box = document.getElementById('home-prompts');
  if (!box) return;

  try {
    const response = await fetch(
      './prompts/manifest.json?cache=' + Date.now()
    );

    if (!response.ok) throw new Error('Prompt manifest unavailable');

    const prompts = await response.json();

    box.innerHTML = '';

    if (!Array.isArray(prompts) || prompts.length === 0) {
      box.textContent = 'No prompts added yet.';
      return;
    }

    prompts.slice().reverse().slice(0, 3).forEach(prompt => {
      if (!prompt || !prompt.title || !prompt.file) return;

      const card = makeCard();

      if (prompt.image) {
        card.appendChild(
          makeImage(
            imagePath(prompt.image, 'prompts/'),
            prompt.title,
            '180px'
          )
        );
      }

      const title = document.createElement('h3');
      title.textContent = prompt.title;

      const description = document.createElement('p');
      description.textContent = prompt.description || '';

      const link = document.createElement('a');
      link.href = './prompts/' + prompt.file;
      link.textContent = 'Open Prompt →';

      link.style.cssText = `
        display:inline-block;
        margin-top:10px;
        padding:10px 14px;
        background:#e8a64a;
        color:#20152b;
        border-radius:7px;
        text-decoration:none;
        font-weight:bold;
      `;

      card.append(title, description, link);
      box.appendChild(card);
    });

  } catch (error) {
    console.error('Prompt Gallery Error:', error);
    box.textContent = 'Prompts could not load.';
  }
}


// 5. Photo Editing Codes - Latest 3
async function loadPhotoCodesGallery() {
  const box = document.getElementById('home-codes');
  if (!box) return;

  const owner = 'samratsaho2010qq-arch';
  const repo = 'ZRX-SAMRAT-edit-Zone-';
  const folder = 'photo-codes/images';

  try {
    const apiURL =
      `https://api.github.com/repos/${owner}/${repo}/contents/${folder}?ref=main`;

    const response = await fetch(apiURL, {
      headers: {
        Accept: 'application/vnd.github+json'
      }
    });

    if (!response.ok) throw new Error('Photo codes unavailable');

    const files = await response.json();

    const images = files
      .filter(file =>
        file.type === 'file' &&
        /\.(png|jpe?g|webp|gif)$/i.test(file.name)
      )
      .sort((a, b) => b.name.localeCompare(a.name))
      .slice(0, 3);

    box.innerHTML = '';

    if (images.length === 0) {
      box.textContent = 'No photo codes uploaded yet.';
      return;
    }

    images.forEach(file => {
      const filename = file.name.replace(/\.[^.]+$/, '');
      const codeName = '/' + filename.toUpperCase();

      const card = makeCard();

      const imageLink = document.createElement('a');
      imageLink.href = file.download_url;
      imageLink.target = '_blank';
      imageLink.rel = 'noopener';

      imageLink.appendChild(
        makeImage(file.download_url, codeName, '210px')
      );

      const title = document.createElement('h3');
      title.textContent = codeName;
      title.style.textAlign = 'center';

      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = '📋 Copy Code';

      button.style.cssText = `
        display:block;
        width:100%;
        padding:12px;
        border:0;
        border-radius:8px;
        background:#e8a64a;
        color:#20152b;
        font-weight:bold;
        font-size:15px;
        cursor:pointer;
      `;

      button.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(codeName);
          button.textContent = '✓ Copied!';
        } catch (error) {
          button.textContent = codeName;
        }

        setTimeout(() => {
          button.textContent = '📋 Copy Code';
        }, 1600);
      });

      card.append(imageLink, title, button);
      box.appendChild(card);
    });

  } catch (error) {
    console.error('Photo Codes Error:', error);
    box.textContent = 'Photo codes could not load.';
  }
}


// 6. VN QR & Templates - Latest 3
async function loadVNImages() {
  const box = document.getElementById('vn-gallery');
  if (!box) return;

  try {
    const response = await fetch(
      './assets/vn/manifest.json?cache=' + Date.now()
    );

    if (!response.ok) throw new Error('VN manifest unavailable');

    const items = await response.json();

    box.innerHTML = '';

    if (!Array.isArray(items) || items.length === 0) {
      box.textContent = 'No VN resources uploaded yet.';
      return;
    }

    items.slice().reverse().slice(0, 3).forEach((entry, index) => {
      const data = typeof entry === 'string'
        ? { qr: entry, title: 'VN Template' }
        : entry;

      if (!data || !data.qr) return;

      const card = makeCard();

      const title = document.createElement('h3');
      title.textContent = data.title || 'VN Video Template';

      if (data.preview) {
        const previewPath = imagePath(data.preview, 'assets/vn/');
        const previewLink = document.createElement('a');

        previewLink.href = previewPath;
        previewLink.target = '_blank';
        previewLink.rel = 'noopener';

        previewLink.appendChild(
          makeImage(previewPath, title.textContent + ' preview', '190px')
        );

        card.appendChild(previewLink);
      }

      const qrTitle = document.createElement('p');
      qrTitle.textContent = '📱 Scan this VN QR Code';

      const qrPath = imagePath(data.qr, 'assets/vn/');
      const qrLink = document.createElement('a');

      qrLink.href = qrPath;
      qrLink.target = '_blank';
      qrLink.rel = 'noopener';

      qrLink.appendChild(
        makeImage(qrPath, 'VN QR Code ' + (index + 1), '220px')
      );

      const description = document.createElement('p');
      description.textContent =
        data.description || 'Scan this QR code in VN.';

      card.append(title, qrTitle, qrLink, description);
      box.appendChild(card);
    });

  } catch (error) {
    console.error('VN Gallery Error:', error);
    box.textContent = 'VN resources could not load.';
  }
}


// 7. Start Homepage Galleries
loadPhotoGallery();
loadPromptGallery();
loadPhotoCodesGallery();
loadVNImages();
    
