import puppeteer from 'puppeteer'
import httpServerPwa from'http-server-pwa'



const APP_URL = 'http://localhost:3000'
let browser
let page
let server

beforeAll(async () => {
  server = await httpServerPwa(__dirname + '/../../public/', {p: 3000});

  browser = await puppeteer.launch({})
  page = await browser.newPage();
})

afterAll(() => {
  browser.close()
  server.close()
})

test('is dom loaded',async () => {
  expect.assertions(1);
  await page.goto(APP_URL)
  let sceneContent = await page.waitForSelector("#scene_container");
  expect(sceneContent).not.toBeFalsy();
})

test('is panels loaded',async () => {
  expect.assertions(1);
  await page.goto(APP_URL)
  let sceneContent = await page.waitForSelector(".error_panel");
  expect(sceneContent).not.toBeFalsy();
})

test('is map loaded',async () => {
  expect.assertions(1);
  await page.goto(APP_URL)
  let sceneContent = await page.waitForSelector(".mapboxgl-canvas");
  expect(sceneContent).not.toBeFalsy();
})