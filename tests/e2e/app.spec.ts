import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Integrated Mobile Pic Maker E2E Test', () => {
  const screenshotPath1 = path.resolve(__dirname, '..', 'fixtures', 'test-screenshot.png');
  // Create a second dummy screenshot for multi-upload testing
  const screenshotPath2 = path.resolve(__dirname, '..', 'fixtures', 'test-screenshot-2.png');

  test.beforeAll(async () => {
    // Ensure the second test image exists
    const fs = require('fs');
    if (!fs.existsSync(screenshotPath2)) {
      const pythonScript = "from PIL import Image; img = Image.new('RGB', (100, 200), color = 'blue'); img.save('tests/fixtures/test-screenshot-2.png')";
      require('child_process').execSync(`python3 -c "${pythonScript}"`);
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the page correctly and display initial UI', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('スクショ作るくん');
    await expect(page.locator('h2')).toHaveText('Controls');
    await expect(page.locator('label[for="upload"]')).toBeVisible();
    await expect(page.locator('label[for="bgColor"]')).toBeVisible();
    await expect(page.locator('button:has-text("Download Image")')).toBeVisible();
    await expect(page.locator('p:has-text("ここにプレビューが表示されます")')).toBeVisible();
  });

  test('should allow uploading multiple screenshots', async ({ page }) => {
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('#upload').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([screenshotPath1, screenshotPath2]);

    // Check if two images are rendered in the preview
    await expect(page.locator('img[alt^="アプリスクリーンショット"]')).toHaveCount(2);
  });

  test('should allow changing the background color', async ({ page }) => {
    const newBgColor = '#ff0000'; // Red
    await page.locator('#bgColor').fill(newBgColor);

    const previewArea = page.getByTestId('preview-area');
    await expect(previewArea).toHaveCSS('background-color', 'rgb(255, 0, 0)');
  });

  test('should contain a draggable text element', async ({ page }) => {
    await expect(page.locator('div[style*="cursor: move"]')).toBeVisible();
    // Use a more specific selector within the draggable component
    await expect(page.locator('.react-draggable .text-2xl')).toHaveText('ここにテキスト');
  });

  test('should trigger a download on button click', async ({ page }) => {
    test.setTimeout(60000);

    // Upload at least one screenshot
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('#upload').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(screenshotPath1);
    await expect(page.locator('img[alt^="アプリスクリーンショット"]')).toHaveCount(1);

    // Start waiting for the download
    const downloadPromise = page.waitForEvent('download');

    // Click the download button
    await page.locator('button:has-text("Download Image")').click();

    // Wait for the download to complete
    const download = await downloadPromise;

    // Check if the downloaded file name is correct
    expect(download.suggestedFilename()).toBe('screenshot-composition.png');
  });
});
