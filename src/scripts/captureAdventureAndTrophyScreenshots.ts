import http from 'http';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

async function captureAdventureAndTrophyScreenshots() {
  const screenshotsDir = path.join(process.cwd(), 'Documentation', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // Static server for dist
  const server = http.createServer((req, res) => {
    let filePath = path.join(process.cwd(), 'dist', req.url === '/' ? 'index.html' : req.url!.split('?')[0]);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(process.cwd(), 'public', req.url!.split('?')[0]);
    }
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(process.cwd(), 'dist', 'index.html');
    }
    const ext = path.extname(filePath);
    const mimeMap: Record<string, string> = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.woff2': 'font/woff2'
    };
    res.writeHead(200, { 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });

  const PORT = 4184;
  await new Promise<void>((resolve) => server.listen(PORT, '127.0.0.1', () => resolve()));
  console.log(`Server listening on http://127.0.0.1:${PORT}`);

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--headless=new'],
    headless: true
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1100 });

    // Set active student user
    await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      localStorage.setItem('edubridge_active_user_id_v1', 'usr_student_01');
      localStorage.setItem('edubridge_active_role_v1', 'student');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));

    // Ensure student dashboard is active
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('nav[aria-label="Student Learning Navigation"] button')).find(
        (b) => b.textContent?.includes('Activity Board') || b.textContent?.includes('Dashboard')
      );
      if (btn) (btn as HTMLElement).click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // 1. Capture Adventure Learning Hub & 4-Step Pathway
    // Scroll so the Adventure Hub is clearly visible
    await page.evaluate(() => {
      const hubHeader = Array.from(document.querySelectorAll('h3')).find((h) => h.textContent?.includes('Adventure Hub'));
      if (hubHeader) {
        const container = hubHeader.closest('.rounded-3xl');
        if (container) {
          container.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
      }
    });
    await new Promise((r) => setTimeout(r, 500));

    const shotAdventureHub = path.join(screenshotsDir, 'student_19_adventure_hub.png');
    const hubElement = await page.evaluateHandle(() => {
      const hubHeader = Array.from(document.querySelectorAll('h3')).find((h) => h.textContent?.includes('Adventure Hub'));
      return hubHeader?.closest('.rounded-3xl');
    });

    if (hubElement && hubElement.asElement()) {
      await (hubElement.asElement())!.screenshot({ path: shotAdventureHub });
      console.log('Saved element screenshot of Adventure Hub to:', shotAdventureHub);
    } else {
      await page.screenshot({ path: shotAdventureHub, fullPage: false });
      console.log('Saved page screenshot of Adventure Hub to:', shotAdventureHub);
    }

    // 2. Navigate to Trophy Box / Milestone Badges Vault
    // Click "MY BADGES" on step 4 or click nav tab "Badges & Trophies"
    console.log('Navigating to Trophy Box & Milestone Badges...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const badgeBtn = buttons.find((b) => b.textContent?.includes('MY BADGES') || b.textContent?.includes('Trophy Box') || b.textContent?.includes('View Full Badge Grid'));
      if (badgeBtn) {
        badgeBtn.click();
      } else {
        const navBtn = buttons.find((b) => b.textContent?.includes('Trophy') || b.textContent?.includes('Badges'));
        if (navBtn) navBtn.click();
      }
    });
    await new Promise((r) => setTimeout(r, 800));

    const shotTrophyBox = path.join(screenshotsDir, 'student_20_trophy_box_badges.png');
    await page.screenshot({ path: shotTrophyBox, fullPage: false });
    console.log('Saved screenshot of Trophy Box & Milestone Badges to:', shotTrophyBox);

  } finally {
    await browser.close();
    server.close();
  }
}

captureAdventureAndTrophyScreenshots().catch((err) => {
  console.error('Error capturing adventure and trophy screenshots:', err);
  process.exit(1);
});

