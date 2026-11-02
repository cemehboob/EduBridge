import http from 'http';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

async function captureDayStreakScreenshot() {
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

  const PORT = 4182;
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

    // Find "View Calendar" button on StreakCounter and click it to expand the heatmap
    const clicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const calBtn = buttons.find((b) => b.textContent?.includes('View Calendar'));
      if (calBtn) {
        calBtn.click();
        return true;
      }
      return false;
    });
    console.log('Clicked "View Calendar" button:', clicked);
    await new Promise((r) => setTimeout(r, 600));

    // Scroll to the StreakCounter element
    await page.evaluate(() => {
      const streakHeader = Array.from(document.querySelectorAll('span')).find((s) => s.textContent?.includes('Day Streak'));
      if (streakHeader) {
        const container = streakHeader.closest('.rounded-3xl');
        if (container) {
          container.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
      }
    });
    await new Promise((r) => setTimeout(r, 500));

    // Capture screenshot of the Day Streak interface
    const shotPath = path.join(screenshotsDir, 'student_18_day_streak.png');
    
    // Find the bounding box of the StreakCounter container
    const streakElement = await page.evaluateHandle(() => {
      const streakHeader = Array.from(document.querySelectorAll('span')).find((s) => s.textContent?.includes('Day Streak'));
      return streakHeader?.closest('.rounded-3xl');
    });

    if (streakElement && streakElement.asElement()) {
      await (streakElement.asElement())!.screenshot({ path: shotPath });
      console.log('Saved element screenshot of StreakCounter to:', shotPath);
    } else {
      await page.screenshot({ path: shotPath, fullPage: false });
      console.log('Saved page screenshot of StreakCounter to:', shotPath);
    }

    console.log('Day Streak screenshot successfully captured at:', shotPath);
  } finally {
    await browser.close();
    server.close();
  }
}

captureDayStreakScreenshot().catch((err) => {
  console.error('Error capturing day streak screenshot:', err);
  process.exit(1);
});

