const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.goto('https://yandex.ru/images/search?text=reno')

  await page.waitForSelector('.serp-item__link')
  await page.click('.serp-item__link')
  
  await page.setViewport({
    width: 1200,
    height: 800
  })

  await page.waitForSelector('.MMImage-Origin')
  await page.screenshot({ path: 'screenshot.png' })

  await browser.close()
})()