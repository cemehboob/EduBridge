import http from 'http';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

async function captureNewViews() {
  const screenshotsDir = path.join(process.cwd(), 'Documentation', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

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

  const PORT = 4195;
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

    // 1. Admin Portal -> Age Groups & Content Rules tab
    await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      localStorage.setItem('edubridge_active_user_id_v1', 'usr_admin_04');
      localStorage.setItem('edubridge_active_role_v1', 'admin');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));

    // Click on Age Groups & Content Rules tab
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const cohortsBtn = btns.find((b) => b.textContent && b.textContent.includes('Age Groups & Content Rules'));
      if (cohortsBtn) cohortsBtn.click();
    });
    await new Promise((r) => setTimeout(r, 700));

    const adminPath = path.join(screenshotsDir, 'admin_10_cohort_governance.png');
    await page.screenshot({ path: adminPath, fullPage: false });
    console.log('Captured:', adminPath);

    // 2. Student View for a 5-year-old child (born 2021) -> Early Primary Assessment Arena
    await page.evaluate(() => {
      const usersStr = localStorage.getItem('edubridge_users_json_v1');
      if (usersStr) {
        const users = JSON.parse(usersStr);
        const childUser = users.find((u: any) => u.id === 'usr_student_01');
        if (childUser) {
          childUser.dateOfBirth = '2021-06-15'; // 5 years old!
          localStorage.setItem('edubridge_users_json_v1', JSON.stringify(users));
        }
      }
      localStorage.setItem('edubridge_active_user_id_v1', 'usr_student_01');
      localStorage.setItem('edubridge_active_role_v1', 'student');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 700));

    // Click on "Junior Practice Tests" or "Exam Prep" tab to view the Early Primary Assessment Arena
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const examBtn = btns.find((b) => b.textContent && (b.textContent.includes('Junior Practice Tests') || b.textContent.includes('Practice') || b.textContent.includes('Exam')));
      if (examBtn) examBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    const studentPath = path.join(screenshotsDir, 'student_21_early_childhood_assessment.png');
    await page.screenshot({ path: studentPath, fullPage: false });
    console.log('Captured:', studentPath);

  } finally {
    await browser.close();
    server.close();
  }
}

captureNewViews().catch(console.error);
