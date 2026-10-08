# ZRX SAMRAT Edit Zone — Auto VN Image System

This version is prepared for GitHub Pages and includes an automatic VN QR/image system.

## How it works

1. Your website reads `assets/vn/manifest.json`.
2. A GitHub Action watches the `assets/vn/` folder.
3. Whenever you upload a new `.png`, `.jpg`, `.jpeg`, `.webp`, or `.gif` file into `assets/vn/` and commit/push it, the Action scans the folder.
4. It automatically updates `assets/vn/manifest.json`.
5. The website then displays the new image in the **Video Making & VN QR** section.

### To add a new VN QR/image later

Upload it here:

`assets/vn/your-new-qr.png`

Then commit the change to GitHub.

**You do not need to edit `index.html`.**

## GitHub Pages setup

1. Upload the entire project to your repository.
2. Go to **Settings → Pages**.
3. Choose **Deploy from a branch → main → / (root)**.
4. Save.
5. Go to the **Actions** tab once and make sure GitHub Actions are allowed/enabled for the repository.
6. After uploading a new image to `assets/vn/`, wait for **Update VN image list** to finish.
7. Refresh the website. The new image will appear automatically.

## Important

- This is a static GitHub Pages site, so the automation happens through GitHub Actions after each upload/commit.
- If you upload an image through the GitHub website, make sure you click **Commit changes**.
- Supported image types: PNG, JPG/JPEG, WEBP, GIF.
- Do not upload private or copyrighted images unless you have permission to use them.

## Contact

Instagram: https://www.instagram.com/zrx_samrat_w.b?stkn=dmRsemcydnF0d2Rh  
WhatsApp: https://wa.me/918670884540  
Email: samratsaho2010qq@gmail.com
