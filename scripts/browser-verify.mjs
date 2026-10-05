import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const baseUrl = 'http://127.0.0.1:5173/';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const tmpDir = join(process.cwd(), '.tmp-verification');
mkdirSync(tmpDir, { recursive: true });

const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=',
  'base64',
);
const ikat = join(tmpDir, 'red-ikat-demo.png');
const ikatTwo = join(tmpDir, 'blue-ikat-demo.png');
const banarasi = join(tmpDir, 'banarasi-demo.png');
const invalid = join(tmpDir, 'invalid-file.txt');
const large = join(tmpDir, 'large-ikat.png');

writeFileSync(ikat, png);
writeFileSync(ikatTwo, png);
writeFileSync(banarasi, png);
writeFileSync(invalid, 'not an image');
writeFileSync(large, Buffer.alloc(8 * 1024 * 1024 + 8, 0));

const failures = [];
const consoleErrors = [];
const failedRequests = [];

function record(name, passed, detail = '') {
  if (!passed) failures.push(`${name}${detail ? `: ${detail}` : ''}`);
  process.stdout.write(`${passed ? 'PASS' : 'FAIL'} ${name}${detail ? ` - ${detail}` : ''}\n`);
}

async function noOverflow(page, label) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  record(`Responsive overflow ${label}`, !overflow);
}

async function clickNav(page, label) {
  const button = page.getByRole('button', { name: label }).first();
  await button.click();
}

const browser = await chromium.launch({
  headless: true,
  executablePath: edgePath,
});

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('console', (message) => {
  if (message.type() === 'error') consoleErrors.push(message.text());
});
page.on('requestfailed', (request) => {
  failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText ?? ''}`);
});

await page.goto(baseUrl, { waitUntil: 'networkidle' });
record('Home page', await page.getByRole('heading', { name: 'Recognizing the design beyond the color.' }).isVisible());

await clickNav(page, 'Identify');
record('Identify page', await page.getByRole('heading', { name: 'Upload a saree or fabric image' }).isVisible());
await page.locator('input[type="file"]').first().setInputFiles(ikat);
await page.getByText('red-ikat-demo.png').waitFor({ state: 'visible' });
record('Identify image preview', await page.getByText('red-ikat-demo.png').isVisible());
await page.getByRole('button', { name: 'Analyze Design' }).click();
await page.getByText('Design Analysis').waitFor({ state: 'visible' });
record('Identify analysis result', await page.getByText('Demo similarity').first().isVisible());
record('Identify top matches', await page.getByRole('heading', { name: 'Top Similar Designs' }).isVisible());
await page.getByRole('button', { name: 'Remove' }).click();
record('Identify remove image', await page.getByText('red-ikat-demo.png').isHidden());
await page.locator('input[type="file"]').first().setInputFiles(invalid);
record('Invalid upload handling', await page.getByText(/Unsupported image/).isVisible());
await page.locator('input[type="file"]').first().setInputFiles(large);
record('Large upload handling', await page.getByText(/too large/).isVisible());

await clickNav(page, 'Verify');
record('Verify page', await page.getByRole('heading', { name: 'Do these two designs match?' }).isVisible());
const verifyInputs = page.locator('input[type="file"]');
await verifyInputs.nth(0).setInputFiles(ikat);
await verifyInputs.nth(1).setInputFiles(ikatTwo);
await page.getByRole('button', { name: 'Compare Designs' }).click();
await page.getByText('SAME DESIGN').waitFor({ state: 'visible' });
record('Verify same design', await page.getByText('SAME DESIGN').isVisible());
await page.getByRole('button', { name: 'Remove' }).nth(1).click();
await verifyInputs.nth(1).setInputFiles(banarasi);
await page.getByRole('button', { name: 'Compare Designs' }).click();
await page.getByText('DIFFERENT DESIGN').waitFor({ state: 'visible' });
record('Verify different design', await page.getByText('DIFFERENT DESIGN').isVisible());

await clickNav(page, 'Gallery');
record('Gallery page', await page.getByRole('heading', { name: 'Explore Indian Textile Patterns' }).isVisible());
await page.getByPlaceholder('Search Banarasi, Bandhani, Ikat, Pichwai').fill('NoMatchPattern');
record('Gallery empty state', await page.getByText(/No local dataset images found|No designs found/).isVisible());

await clickNav(page, 'Color Invariance');
record('Color page', await page.getByRole('heading', { name: 'Same Pattern. Different Palette.' }).isVisible());
await page.locator('input[type="file"]').first().setInputFiles(ikat);
record('Color variants', await page.getByText('Brightness Adjusted').isVisible());

await clickNav(page, 'About');
record('About page', await page.getByRole('heading', { name: 'How VASTRA VISION Works' }).isVisible());
record('About diagram', await page.getByText('Feature Encoder').isVisible());

for (const width of [1920, 1440, 1024, 768, 390]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  if (width < 1024) {
    await page.getByRole('button', { name: 'Menu' }).click();
    record(
      `Mobile menu ${width}`,
      await page
        .getByRole('navigation', { name: 'Mobile navigation' })
        .getByRole('button', { name: 'Analyze a Design' })
        .isVisible(),
    );
  }
  await noOverflow(page, `${width}px`);
}

record('Console clean', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '));
record('Network clean', failedRequests.length === 0, failedRequests.slice(0, 3).join(' | '));

await browser.close();

if (failures.length) {
  console.error(`Verification failed:\n${failures.join('\n')}`);
  process.exit(1);
}
