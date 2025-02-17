import { initBrowser, store, clearStore, getMapView } from '../tools';
let browser;
let page;

beforeAll(async () => {
  const browserPage = await initBrowser();
  page = browserPage.page;
  browser = browserPage.browser;
});

describe('Initial map position', () => {
  test('determined by geoip region on first visit', async () => {
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      'x-geoip-country-code': 'FR', // France
      'x-geoip-region-code': 'BRE', // Brittany
    });
    await page.goto(APP_URL);
    const bounds = await page.evaluate(() => window.MAP_MOCK.options.bounds);
    expect(bounds).toEqual([-5.1440329, 47.2777959, -1.01569, 48.908645899999996]);
  });

  test('restore position from previous visit, as stored in local storage', async () => {
    const center = { lng: 11.1, lat: 43.3 };

    await page.goto(APP_URL);
    await store(page, 'qmaps_v1_last_location', center);
    await page.goto(APP_URL);
    await page.reload(); // force reload

    const { center: mapCenter } = await getMapView(page);
    expect(mapCenter).toEqual(center);
  });

  test('use position from the url if any, ignoring previous position', async () => {
    const center = { lng: 11.1, lat: 43.3 };

    await page.goto(APP_URL);
    await store(page, 'qmaps_v1_last_location', { lng: 19, lat: 47, zoom: 18 });
    await page.goto(`${APP_URL}/#map=2.00/${center.lat}/${center.lng}`);
    await page.reload(); // force reload

    const { center: mapCenter } = await getMapView(page);
    expect(mapCenter).toEqual(center);
  });
});

afterEach(async () => {
  await clearStore(page);
});

afterAll(async () => {
  await browser.close();
});
