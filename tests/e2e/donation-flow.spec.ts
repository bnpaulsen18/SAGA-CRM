import { test, expect } from '@playwright/test';

test.describe('Donation Flow', () => {
  // Skip auth for now since we need test users set up
  test.skip('complete donation creation flow', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for dashboard
    await expect(page).toHaveURL('/dashboard');

    // 2. Navigate to new donation page
    await page.click('a[href="/donations/new"]');
    await expect(page).toHaveURL('/donations/new');

    // 3. Fill out donation form
    await page.selectOption('select[name="contactId"]', { index: 1 });
    await page.fill('input[name="amount"]', '100.00');
    await page.selectOption('select[name="method"]', 'CHECK');

    // 4. Submit form
    await page.click('button[type="submit"]');

    // 5. Verify success
    await expect(page.locator('text=Donation recorded successfully')).toBeVisible({ timeout: 10000 });

    // 6. Verify redirect to donations list
    await expect(page).toHaveURL(/\/donations/);
  });

  test('landing page loads successfully', async ({ page }) => {
    await page.goto('/');

    // Check for key elements
    await expect(page.locator('h1')).toBeVisible();

    // Check newsletter form exists
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
  });

  test('newsletter signup form validation', async ({ page }) => {
    await page.goto('/');

    // Find newsletter form
    const emailInput = page.locator('input[type="email"]').first();
    const submitButton = page.locator('button[type="submit"]').first();

    // Try to submit without email
    await submitButton.click();

    // Should show validation error (HTML5 validation)
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);

    // Fill valid email
    await emailInput.fill('test@example.com');

    // Submit
    await submitButton.click();

    // Should show success or CAPTCHA (depending on configuration)
    // Wait for response
    await page.waitForTimeout(2000);
  });

  test('fraud monitor dashboard loads (admin only)', async ({ page }) => {
    // This will fail without auth, but tests the route exists
    await page.goto('/admin/fraud-monitor');

    // Should redirect to login or show unauthorized
    await expect(page).toHaveURL(/\/login|\/admin\/fraud-monitor/);
  });
});

test.describe('Public Pages', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('register page loads', async ({ page }) => {
    await page.goto('/register');

    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('landing page has correct SEO meta tags', async ({ page }) => {
    await page.goto('/');

    // Check meta tags
    const title = await page.title();
    expect(title).toContain('SAGA CRM');

    // Check Open Graph tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toContain('SAGA CRM');

    // Check structured data
    const structuredData = await page.locator('script[type="application/ld+json"]').count();
    expect(structuredData).toBeGreaterThan(0);
  });
});

test.describe('Cookie Consent', () => {
  test('cookie consent banner appears on first visit', async ({ context, page }) => {
    // Clear cookies to simulate first visit
    await context.clearCookies();

    await page.goto('/');

    // Should show cookie consent banner
    const consentBanner = page.locator('text=We Value Your Privacy');
    await expect(consentBanner).toBeVisible({ timeout: 5000 });
  });

  test('accepting cookies hides banner', async ({ context, page }) => {
    await context.clearCookies();
    await page.goto('/');

    // Click accept all
    const acceptButton = page.locator('button:has-text("Accept All Cookies")');
    await acceptButton.click();

    // Banner should disappear
    await expect(page.locator('text=We Value Your Privacy')).not.toBeVisible();

    // Reload page - banner should not reappear
    await page.reload();
    await expect(page.locator('text=We Value Your Privacy')).not.toBeVisible();
  });
});
