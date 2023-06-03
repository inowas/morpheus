import puppeteer from 'puppeteer';

jest.setTimeout(10000);

/**
 * @jest-environment puppeteer
 */
describe('Render Login Page', () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;
  const baseUrl = 'http://localhost:5000';

  async function waitAndClick(selector: string) {
    await page.evaluate((s) => document.querySelector(s).click(), selector);
  }

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  it('contains the welcome text', async () => {
    await page.goto(`${baseUrl}/user/login`);
    await page.waitForSelector('#company');
    const text = await page.$eval('#company', (e) => e.textContent);
    expect(text).toContain('ITEXIA GmbH');
  });

  it('Renders error message with wrong cretentials', async () => {
    await page.goto(`${baseUrl}/user/login`);
    await page.waitForSelector('#loginform');
    await page.type('#username', 'username');
    await page.type('#password', 'password');
    await page.click('#submit');

    await page.waitForSelector('#error');
    const text = await page.$eval('#error', (e) => e.textContent);
    expect(text).toEqual('Anmeldung fehlgeschlagen');
  });

  it('Redirects to dashboard with correct credentials', async () => {
    await page.goto(`${baseUrl}/user/login`);
    await page.waitForSelector('#loginform');
    await page.type('#username', 'admin@inowas.com');
    await page.type('#password', 'admin');
    await page.click('#submit');
    await page.waitForNavigation();
    expect(page.url()).toEqual(`${baseUrl}/dashboard`);
  });


  it('Renders pages', async () => {
    await page.goto(`${baseUrl}/dashboard`, {waitUntil: 'networkidle0'});
    await page.waitForSelector('[data-testid="page_header"]');
    const text = await page.$eval('[data-testid="page_header"]', (e) => e.textContent);
    expect(text).toEqual('DASHBOARD');

    const list = [
      ['[data-testid="menuitem-Dashboard"]', '[data-testid="page_header"]', 'DASHBOARD'],
      ['[data-testid="menuitem-Assets"]', '[data-testid="page_header"]', 'INVENTARE'],
      ['[data-testid="menuitem-Sublocations"]', '[data-testid="page_header"]', 'RÄUME'],
    ];

    for (let i = 0; i < list.length; i++) {
      const [menuSelector, contentSelector, expectedContent] = list[i];
      await waitAndClick(menuSelector);
      await page.waitForSelector(contentSelector);
      const content = await page.$eval(contentSelector, (e) => e.textContent);
      expect(content).toEqual(expectedContent);
    }
  });

  afterAll(() => browser.close());
});
