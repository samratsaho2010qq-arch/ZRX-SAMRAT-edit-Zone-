const menu=document.querySelector('.hamburger');
const nav=document.querySelector('.header nav');
if(menu){menu.addEventListener('click',()=>nav.classList.toggle('open'));nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')))}
const copy=document.querySelector('.copy');
if(copy){copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(copy.dataset.copy);const old=copy.textContent;copy.textContent='✓ Copied!';setTimeout(()=>copy.textContent=old,1400)}catch(e){copy.textContent='Copy unavailable'}})}
async function loadVNImages(){const box=document.getElementById('vn-gallery');if(!box)return;try{const res=await fetch('assets/vn/manifest.json?cache='+Date.now());if(!res.ok)throw new Error('manifest unavailable');const files=await res.json();if(!files.length){box.innerHTML='<div class="loading">No VN QR/image uploaded yet.<br><small>Add an image to <b>assets/vn/</b> and push it to GitHub.</small></div>';return}box.innerHTML=files.map((file,i)=>`<a class="vn-item" href="${file}" target="_blank" rel="noopener"><img src="${file}" alt="VN QR or video resource ${i+1}" loading="lazy"><span>Scan / Open →</span></a>`).join('')}catch(e){box.innerHTML='<div class="loading">VN image list will appear after the GitHub Action runs.</div>'}}
loadVNImages();
