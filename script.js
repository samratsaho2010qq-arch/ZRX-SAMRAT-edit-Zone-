// Hamburger Navigation
const menu = document.querySelector('.hamburger');
const nav = document.querySelector('.header nav');

if (menu && nav) {
menu.addEventListener('click', () => {
nav.classList.toggle('open');
});

nav.querySelectorAll('a').forEach(a => {
a.addEventListener('click', () => nav.classList.remove('open'));
});
}

// Copy Prompt Button
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

// VN QR + Preview Gallery
async function loadVNImages() {
const box = document.getElementById('vn-gallery');
if (!box) return;

try {
const response = await fetch(
'assets/vn/manifest.json?cache=' + Date.now()
);

if (!response.ok) throw new Error('Manifest unavailable');    

const items = await response.json();    

if (!Array.isArray(items) || items.length === 0) {    
  box.innerHTML = '<p class="loading">No VN resources uploaded yet.</p>';    
  return;    
}    

box.innerHTML = '';    

items.forEach((entry, index) => {    
  const data = typeof entry === 'string'    
    ? { qr: entry, title: 'VN Template ' + (index + 1) }    
    : entry;    

  if (!data.qr) return;    

  const card = document.createElement('article');    
  card.className = 'vn-item';    
  card.style.cssText =    
    'padding:14px;border-radius:14px;background:#20152b;color:#fff;border:1px solid #e8a64a;overflow:hidden;';    

  const title = document.createElement('h3');    
  title.textContent = data.title || 'VN Video Template';    
  title.style.cssText = 'margin:0 0 12px;';    

  if (data.preview) {    
    const previewLink = document.createElement('a');    
    previewLink.href = 'assets/vn/' + data.preview;    
    previewLink.target = '_blank';    
    previewLink.rel = 'noopener';    

    const preview = document.createElement('img');    
    preview.src = 'assets/vn/' + data.preview;    
    preview.alt = (data.title || 'VN template') + ' preview';    
    preview.loading = 'lazy';    
    preview.style.cssText =    
      'display:block;width:100%;max-height:380px;object-fit:contain;border-radius:9px;background:#111;margin-bottom:12px;';    

    previewLink.appendChild(preview);    
    card.appendChild(title);    
    card.appendChild(previewLink);    
  } else {    
    card.appendChild(title);    
  }    

  const qrTitle = document.createElement('p');    
  qrTitle.textContent = '📱 Scan this VN QR Code';    
  qrTitle.style.cssText = 'font-weight:bold;margin:12px 0 8px;';    

  const qrLink = document.createElement('a');    
  qrLink.href = 'assets/vn/' + data.qr;    
  qrLink.target = '_blank';    
  qrLink.rel = 'noopener';    

  const qr = document.createElement('img');    
  qr.src = 'assets/vn/' + data.qr;    
  qr.alt = 'VN QR Code for ' + (data.title || 'template');    
  qr.loading = 'lazy';    
  qr.style.cssText =    
    'display:block;width:100%;max-height:260px;object-fit:contain;border-radius:9px;background:#fff;padding:6px;box-sizing:border-box;';    

  qrLink.appendChild(qr);    

  const caption = document.createElement('p');    
  caption.textContent =    
    data.description || 'Preview the style, then scan the QR in VN.';    
  caption.style.cssText = 'font-size:14px;line-height:1.6;';    

  card.append(qrTitle, qrLink, caption);    
  box.appendChild(card);    
});

} catch (error) {
box.innerHTML =
'<p class="loading">VN resources could not load. Please refresh later.</p>';
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
heading.style.cssText = 'grid-column:1/-1;text-align:center;';
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

  if (prompt.image) {    
    const img = document.createElement('img');    
    img.src = prompt.image;    
    img.alt = prompt.title;    
    img.loading = 'lazy';    
    img.style.cssText =    
      'display:block;width:100%;height:180px;object-fit:cover;border-radius:8px;margin-bottom:12px;';    
    img.onerror = () => img.style.display = 'none';    
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
message.textContent = 'Prompts could not load. Please refresh later.';
gallery.appendChild(message);
}
}

// Photo Editing Codes Gallery
async function loadPhotoCodesGallery() {
const owner = 'samratsaho2010qq-arch';
const repo = 'ZRX-SAMRAT-edit-Zone-';
const folder = 'photo-codes/images';

// Create the gallery section automatically
let section = document.getElementById('photo-codes-gallery');

if (!section) {
section = document.createElement('section');
section.id = 'photo-codes-gallery';
section.style.cssText = 'padding:24px 14px;margin:20px auto;max-width:1200px;';

const promptSection = document.getElementById('prompt-showcase');    

if (promptSection) {    
  promptSection.insertAdjacentElement('afterend', section);    
} else {    
  const main = document.querySelector('main');    
  (main || document.body).appendChild(section);    
}

}

section.innerHTML = '';

const heading = document.createElement('h2');
heading.textContent = '📸 Photo Editing Codes Gallery';
heading.style.cssText = 'text-align:center;margin-bottom:8px;';

const subtitle = document.createElement('p');
subtitle.textContent = 'Choose a code and copy it with one tap.';
subtitle.style.cssText = 'text-align:center;margin-bottom:22px;';

const gallery = document.createElement('div');
gallery.style.cssText =
'display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,220px),300px));justify-content:center;gap:16px;width:100%;box-sizing:border-box;';

const status = document.createElement('p');
status.textContent = 'Loading photo codes...';
status.style.cssText = 'text-align:center;padding:16px;';

section.append(heading, subtitle, status, gallery);

try {
const apiURL =
https://api.github.com/repos/${owner}/${repo}/contents/${folder}?ref=main;

const response = await fetch(apiURL, {    
  headers: { Accept: 'application/vnd.github+json' }    
});    

if (!response.ok) {    
  throw new Error('Could not load image folder');    
}    

const files = await response.json();    

const images = files.filter(file =>    
  file.type === 'file' &&    
  /\.(png|jpe?g|webp|gif)$/i.test(file.name)    
);    

images.sort((a, b) => a.name.localeCompare(b.name));    

if (images.length === 0) {    
  status.textContent = 'No photo codes uploaded yet.';    
  return;    
}    

status.remove();    

images.forEach(file => {    
  const filename = file.name.replace(/\.[^.]+$/, '');    
  const codeName = '/' + filename.toUpperCase();    

  const card = document.createElement('article');    
  card.style.cssText =    
    'padding:14px;border-radius:14px;background:#20152b;color:#fff;border:1px solid #e8a64a;overflow:hidden;';    

  const imageLink = document.createElement('a');    
  imageLink.href = file.download_url;    
  imageLink.target = '_blank';    
  imageLink.rel = 'noopener';    

  const img = document.createElement('img');    
  img.src = file.download_url;    
  img.alt = codeName + ' photo editing example';    
  img.loading = 'lazy';    
  img.style.cssText =    
    'display:block;width:100%;height:230px;object-fit:contain;border-radius:9px;background:#111;margin-bottom:12px;';    

  img.onerror = () => {    
    img.alt = 'Image preview unavailable';    
  };    

  imageLink.appendChild(img);    

  const title = document.createElement('h3');    
  title.textContent = codeName;    
  title.style.cssText = 'text-align:center;margin:12px 0;';    

  const button = document.createElement('button');    
  button.type = 'button';    
  button.textContent = '📋 Copy Code';    
  button.style.cssText =    
    'display:block;width:100%;padding:12px;border:0;border-radius:8px;background:#e8a64a;color:#20152b;font-weight:bold;font-size:15px;cursor:pointer;';    

  button.addEventListener('click', async () => {    
    try {    
      await navigator.clipboard.writeText(codeName);    
      button.textContent = '✓ Copied!';    
    } catch (error) {    
      // Fallback for browsers that block clipboard access    
      const temp = document.createElement('textarea');    
      temp.value = codeName;    
      temp.style.position = 'fixed';    
      temp.style.opacity = '0';    
      document.body.appendChild(temp);    
      temp.select();    

      try {    
        const success = document.execCommand('copy');    
        button.textContent = success ? '✓ Copied!' : 'Select code manually';    
      } catch (copyError) {    
        button.textContent = 'Select code manually';    
      }    

      temp.remove();    
    }    

    setTimeout(() => {    
      button.textContent = '📋 Copy Code';    
    }, 1600);    
  });    

  card.append(imageLink, title, button);    
  gallery.appendChild(card);    
});

} catch (error) {
status.textContent =
'Photo codes could not load. Please refresh later.';
}
}

// Start all galleries
loadVNImages();
loadPromptGallery();
loadPhotoCodesGallery();
