/* =========================================
   ZRX SAMRAT EDIT ZONE
   Main Script + SAMRAT EDIT STUDIO
========================================= */

/* ---------- Navigation ---------- */
const menu = document.querySelector('.menu-toggle, .hamburger');
const nav = document.querySelector('.header nav');

if (menu && nav) {
  menu.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- SAMRAT EDIT STUDIO ---------- */
(() => {
  const $ = id => document.getElementById(id);

  const modal = $('samrat-editor-modal');
  const openButton = $('open-samrat-studio');
  const upload = $('samrat-image-upload');
  const preview = $('samrat-image-preview');
  const previewWrap = $('samrat-image-preview-wrap');
  const emptyState = $('samrat-empty-state');
  const textOverlay = $('samrat-text-overlay');
  const status = $('samrat-status');

  if (!modal || !upload || !preview) return;

  let originalImage = null;
  let imageURL = '';
  let rotation = 0;
  let flipX = 1;
  let flipY = 1;
  let activeFilter = 'none';
  let history = [];
  let historyIndex = -1;
  let currentText = '';
  let currentTextColor = '#ffffff';
  let currentTextSize = 36;
  let warmth = 0;
  let blur = 0;
  let brightness = 100;
  let contrast = 100;
  let saturation = 100;

  const settings = () => ({
    rotation,
    flipX,
    flipY,
    activeFilter,
    currentText,
    currentTextColor,
    currentTextSize,
    warmth,
    blur,
    brightness,
    contrast,
    saturation
  });

  function setStatus(message) {
    if (status) status.textContent = message;
  }

  function editorIsReady() {
    return !!originalImage;
  }

  function updateControls() {
    const ready = editorIsReady();

    modal.querySelectorAll(
      '#samrat-undo, #samrat-reset, #samrat-download, ' +
      'input[type="range"], input[type="text"], input[type="color"], ' +
      '[data-filter], [data-editor-tab], ' +
      '#samrat-rotate-left, #samrat-rotate-right, ' +
      '#samrat-flip-horizontal, #samrat-flip-vertical, ' +
      '#samrat-remove-text'
    ).forEach(control => {
      control.disabled = !ready;
    });
  }

  function saveHistory() {
    const snapshot = settings();
    const previous = history[historyIndex];

    if (previous && JSON.stringify(previous) === JSON.stringify(snapshot)) {
      return;
    }

    history = history.slice(0, historyIndex + 1);
    history.push(snapshot);

    if (history.length > 40) history.shift();

    historyIndex = history.length - 1;
    updateUndoButton();
  }

  function updateUndoButton() {
    const undo = $('samrat-undo');
    if (undo) undo.disabled = !editorIsReady() || historyIndex <= 0;
  }

  function restoreSettings(snapshot) {
    rotation = snapshot.rotation;
    flipX = snapshot.flipX;
    flipY = snapshot.flipY;
    activeFilter = snapshot.activeFilter;
    currentText = snapshot.currentText;
    currentTextColor = snapshot.currentTextColor;
    currentTextSize = snapshot.currentTextSize;
    warmth = snapshot.warmth;
    blur = snapshot.blur;
    brightness = snapshot.brightness;
    contrast = snapshot.contrast;
    saturation = snapshot.saturation;

    setControlValue('samrat-brightness', brightness);
    setControlValue('samrat-contrast', contrast);
    setControlValue('samrat-saturation', saturation);
    setControlValue('samrat-warmth', warmth);
    setControlValue('samrat-blur', blur);
    setControlValue('samrat-text-input', currentText);
    setControlValue('samrat-text-color', currentTextColor);
    setControlValue('samrat-text-size', currentTextSize);

    modal.querySelectorAll('[data-filter]').forEach(button => {
      button.classList.toggle(
        'active',
        button.dataset.filter === activeFilter
      );
    });

    renderPreview();
    updateUndoButton();
  }

  function setControlValue(id, value) {
    const element = $(id);
    if (element) element.value = value;
  }

  function readControl(id, fallback) {
    const element = $(id);
    return element ? element.value : fallback;
  }

  function filterValues() {
    let sepia = 0;
    let grayscale = 0;
    let hue = 0;
    let extraSaturation = 100;
    let extraContrast = 100;

    switch (activeFilter) {
      case 'vivid':
        extraSaturation = 145;
        extraContrast = 108;
        break;
      case 'cinematic':
        sepia = 12;
        extraContrast = 115;
        extraSaturation = 88;
        break;
      case 'vintage':
        sepia = 38;
        extraSaturation = 78;
        extraContrast = 92;
        break;
      case 'mono':
        grayscale = 100;
        extraContrast = 112;
        break;
      case 'warm':
        sepia = 22;
        extraSaturation = 112;
        break;
    }

    return { sepia, grayscale, hue, extraSaturation, extraContrast };
  }

  function getCSSFilter() {
    const f = filterValues();

    return [
      `brightness(${brightness}%)`,
      `contrast(${contrast * f.extraContrast / 100}%)`,
      `saturate(${saturation * f.extraSaturation / 100}%)`,
      `sepia(${Math.min(100, Math.max(0, f.sepia + warmth))}%)`,
      `grayscale(${f.grayscale}%)`,
      `hue-rotate(${warmth < 0 ? Math.abs(warmth) * 0.5 : -warmth * 0.35}deg)`,
      `blur(${blur}px)`
    ].join(' ');
  }

  function renderPreview() {
    if (!originalImage) return;

    preview.style.filter = getCSSFilter();
    preview.style.transform =
      `rotate(${rotation}deg) scale(${flipX}, ${flipY})`;

    if (textOverlay) {
      textOverlay.textContent = currentText;
      textOverlay.style.color = currentTextColor;
      textOverlay.style.fontSize = `${currentTextSize}px`;
      textOverlay.style.display = currentText ? 'block' : 'none';
    }

    modal.querySelectorAll('[data-editor-output]').forEach(output => {
      const id = output.dataset.editorOutput;
      const input = $(id);
      if (input) output.textContent = input.value;
    });
  }

  function loadImage(file) {
    if (!file || !file.type.startsWith('image/')) {
      setStatus('Please select a valid image file.');
      return;
    }

    if (imageURL) URL.revokeObjectURL(imageURL);

    imageURL = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      originalImage = img;

      rotation = 0;
      flipX = 1;
      flipY = 1;
      activeFilter = 'none';
      currentText = '';
      currentTextColor = '#ffffff';
      currentTextSize = 36;
      warmth = 0;
      blur = 0;
      brightness = 100;
      contrast = 100;
      saturation = 100;

      history = [];
      historyIndex = -1;

      if (emptyState) emptyState.hidden = true;
      if (previewWrap) previewWrap.hidden = false;

      preview.src = imageURL;

      setControlValue('samrat-brightness', 100);
      setControlValue('samrat-contrast', 100);
      setControlValue('samrat-saturation', 100);
      setControlValue('samrat-warmth', 0);
      setControlValue('samrat-blur', 0);
      setControlValue('samrat-text-input', '');
      setControlValue('samrat-text-color', '#ffffff');
      setControlValue('samrat-text-size', 36);

      modal.querySelectorAll('[data-filter]').forEach(button => {
        button.classList.toggle(
          'active',
          button.dataset.filter === 'none'
        );
      });

      renderPreview();
      saveHistory();
      updateControls();
      setStatus('Image loaded! Start editing.');
    };

    img.onerror = () => {
      setStatus('Could not open this image. Please try another.');
      URL.revokeObjectURL(imageURL);
      imageURL = '';
    };

    img.src = imageURL;
  }

  upload.addEventListener('change', event => {
    const file = event.target.files && event.target.files[0];
    loadImage(file);
  });

  /* Open and close editor */
  function openEditor() {
    modal.hidden = false;
    modal.classList.add('open');
    document.body.classList.add('editor-open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeEditor() {
    modal.classList.remove('open');
    modal.hidden = true;
    document.body.classList.remove('editor-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (openButton) {
    openButton.addEventListener('click', openEditor);
  }

  modal.querySelectorAll(
    '#close-samrat-studio, [data-close-editor]'
  ).forEach(button => {
    button.addEventListener('click', closeEditor);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !modal.hidden) closeEditor();
  });

  /* Slider controls */
  const sliderSettings = [
    ['samrat-brightness', 'brightness'],
    ['samrat-contrast', 'contrast'],
    ['samrat-saturation', 'saturation'],
    ['samrat-warmth', 'warmth'],
    ['samrat-blur', 'blur']
  ];

  sliderSettings.forEach(([id, property]) => {
    const input = $(id);
    if (!input) return;

    input.addEventListener('input', () => {
      const value = Number(input.value);

      if (property === 'brightness') brightness = value;
      if (property === 'contrast') contrast = value;
      if (property === 'saturation') saturation = value;
      if (property === 'warmth') warmth = value;
      if (property === 'blur') blur = value;

      renderPreview();
    });

    input.addEventListener('change', saveHistory);
  });

  /* Filters */
  modal.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      if (!editorIsReady()) return;

      activeFilter = button.dataset.filter || 'none';

      modal.querySelectorAll('[data-filter]').forEach(item => {
        item.classList.toggle('active', item === button);
      });

      renderPreview();
      saveHistory();
    });
  });

  /* Rotate and flip */
  function transformImage(action) {
    if (!editorIsReady()) return;

    if (action === 'left') rotation -= 90;
    if (action === 'right') rotation += 90;
    if (action === 'horizontal') flipX *= -1;
    if (action === 'vertical') flipY *= -1;

    renderPreview();
    saveHistory();
  }

  const transformButtons = [
    ['samrat-rotate-left', 'left'],
    ['samrat-rotate-right', 'right'],
    ['samrat-flip-horizontal', 'horizontal'],
    ['samrat-flip-vertical', 'vertical']
  ];

  transformButtons.forEach(([id, action]) => {
    const button = $(id);
    if (button) {
      button.addEventListener('click', () => transformImage(action));
    }
  });

  /* Text overlay */
  const textInput = $('samrat-text-input');
  const textColor = $('samrat-text-color');
  const textSize = $('samrat-text-size');

  if (textInput) {
    textInput.addEventListener('input', () => {
      currentText = textInput.value;
      renderPreview();
    });

    textInput.addEventListener('change', saveHistory);
  }

  if (textColor) {
    textColor.addEventListener('input', () => {
      currentTextColor = textColor.value;
      renderPreview();
    });

    textColor.addEventListener('change', saveHistory);
  }

  if (textSize) {
    textSize.addEventListener('input', () => {
      currentTextSize = Number(textSize.value);
      renderPreview();
    });

    textSize.addEventListener('change', saveHistory);
  }

  const removeText = $('samrat-remove-text');
  if (removeText) {
    removeText.addEventListener('click', () => {
      currentText = '';
      setControlValue('samrat-text-input', '');
      renderPreview();
      saveHistory();
    });
  }

  /* Editor tabs */
  modal.querySelectorAll('[data-editor-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.editorTab;

      modal.querySelectorAll('[data-editor-tab]').forEach(item => {
        const selected = item === tab;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-selected', String(selected));
      });

      modal.querySelectorAll('[data-editor-panel]').forEach(panel => {
        const selected = panel.dataset.editorPanel === target;
        panel.hidden = !selected;
        panel.classList.toggle('active', selected);
      });
    });
  });

  /* Undo */
  const undoButton = $('samrat-undo');
  if (undoButton) {
    undoButton.addEventListener('click', () => {
      if (historyIndex <= 0) return;

      historyIndex--;
      restoreSettings(history[historyIndex]);
      setStatus('Previous edit restored.');
    });
  }

  /* Reset */
  const resetButton = $('samrat-reset');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      if (!editorIsReady()) return;

      rotation = 0;
      flipX = 1;
      flipY = 1;
      activeFilter = 'none';
      currentText = '';
      currentTextColor = '#ffffff';
      currentTextSize = 36;
      warmth = 0;
      blur = 0;
      brightness = 100;
      contrast = 100;
      saturation = 100;

      setControlValue('samrat-brightness', 100);
      setControlValue('samrat-contrast', 100);
      setControlValue('samrat-saturation', 100);
      setControlValue('samrat-warmth', 0);
      setControlValue('samrat-blur', 0);
      setControlValue('samrat-text-input', '');
      setControlValue('samrat-text-color', '#ffffff');
      setControlValue('samrat-text-size', 36);

      modal.querySelectorAll('[data-filter]').forEach(button => {
        button.classList.toggle(
          'active',
          button.dataset.filter === 'none'
        );
      });

      renderPreview();
      saveHistory();
      setStatus('Edits reset to the original settings.');
    });
  }

  /* Download edited image */
  const downloadButton = $('samrat-download');

  if (downloadButton) {
    downloadButton.addEventListener('click', () => {
      if (!originalImage) {
        setStatus('Upload an image first.');
        return;
      }

      try {
        const canvas = document.createElement('canvas');
        const sideways = Math.abs(rotation % 180) === 90;

        canvas.width = sideways
          ? originalImage.naturalHeight
          : originalImage.naturalWidth;

        canvas.height = sideways
          ? originalImage.naturalWidth
          : originalImage.naturalHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas unavailable');

        const f = filterValues();

        ctx.filter = [
          `brightness(${brightness}%)`,
          `contrast(${contrast * f.extraContrast / 100}%)`,
          `saturate(${saturation * f.extraSaturation / 100}%)`,
          `sepia(${Math.min(100, Math.max(0, f.sepia + warmth))}%)`,
          `grayscale(${f.grayscale}%)`,
          `hue-rotate(${warmth < 0 ? Math.abs(warmth) * 0.5 : -warmth * 0.35}deg)`,
          `blur(${blur}px)`
        ].join(' ');

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.scale(flipX, flipY);

        ctx.drawImage(
          originalImage,
          -originalImage.naturalWidth / 2,
          -originalImage.naturalHeight / 2
        );

        ctx.filter = 'none';

        if (currentText.trim()) {
          const scale = Math.min(
            canvas.width / originalImage.naturalWidth,
            canvas.height / originalImage.naturalHeight
          );

          const fontSize = Math.max(12, currentTextSize * scale);
          ctx.fillStyle = currentTextColor;
          ctx.font = `bold ${fontSize}px Arial, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'rgba(0,0,0,0.75)';
          ctx.shadowBlur = Math.max(2, fontSize * 0.08);

          const lines = currentText.split('\n');
          const lineHeight = fontSize * 1.25;
          const startY = canvas.height / 2 -
            ((lines.length - 1) * lineHeight) / 2;

          lines.forEach((line, index) => {
            ctx.fillText(
              line,
              canvas.width / 2,
              startY + index * lineHeight,
              canvas.width * 0.9
            );
          });
        }

        canvas.toBlob(blob => {
          if (!blob) {
            setStatus('Could not create the image. Try again.');
            return;
          }

          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'samrat-edited-photo.png';
          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(url);

          setStatus('Your edited image is ready to save!');
        }, 'image/png');
      } catch (error) {
        setStatus('Download failed. Please try again.');
      }
    });
  }

  updateControls();
})();

/* ---------- VN QR + Preview Gallery ---------- */
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
      box.innerHTML =
        '<p class="loading">No VN resources uploaded yet.</p>';
      return;
    }

    box.innerHTML = '';

    items.forEach((entry, index) => {
      const data = typeof entry === 'string'
        ? { qr: entry, title: 'VN Template ' + (index + 1) }
        : entry;

      if (!data || !data.qr) return;

      const card = document.createElement('article');
      card.className = 'vn-item';

      const title = document.createElement('h3');
      title.textContent = data.title || 'VN Video Template';

      const makeImageLink = (filename, alt, maxHeight, background) => {
        const link = document.createElement('a');
        link.href = 'assets/vn/' + filename;
        link.target = '_blank';
        link.rel = 'noopener';

        const img = document.createElement('img');
        img.src = 'assets/vn/' + filename;
        img.alt = alt;
        img.loading = 'lazy';
        img.style.cssText =
          `display:block;width:100%;max-height:${maxHeight}px;` +
          `object-fit:contain;border-radius:9px;background:${background};` +
          'margin-bottom:12px;';

        link.appendChild(img);
        return link;
      };

      card.appendChild(title);

      if (data.preview) {
        card.appendChild(makeImageLink(
          data.preview,
          (data.title || 'VN template') + ' preview',
          380,
          '#111'
        ));
      }

      const qrTitle = document.createElement('p');
      qrTitle.textContent = '📱 Scan this VN QR Code';
      qrTitle.style.fontWeight = 'bold';

      card.appendChild(qrTitle);
      card.appendChild(makeImageLink(
        data.qr,
        'VN QR Code for ' + (data.title || 'template'),
        260,
        '#fff'
      ));

      const caption = document.createElement('p');
      caption.textContent =
        data.description || 'Preview the style, then scan the QR in VN.';

      card.appendChild(caption);
      box.appendChild(card);
    });

    if (!box.children.length) {
      box.innerHTML =
        '<p class="loading">No valid VN resources found in the manifest.</p>';
    }
  } catch (error) {
    box.innerHTML =
      '<p class="loading">VN resources could not load. Please refresh later.</p>';
  }
}

/* ---------- AI Prompt Gallery ---------- */
async function loadPromptGallery() {
  const section = document.getElementById('prompt-showcase');
  if (!section) return;

  let gallery = document.getElementById('dynamic-prompts');

  if (!gallery) {
    gallery = document.createElement('div');
    gallery.id = 'dynamic-prompts';
    gallery.style.cssText =
      'display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));' +
      'gap:16px;margin:24px 0;padding:12px;';
    section.appendChild(gallery);
  }

  gallery.innerHTML = '';

  const heading = document
