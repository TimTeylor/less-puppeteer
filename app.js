const https = require('https');
const { writeFile, createWriteStream } = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true })
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

  let images = await page.evaluate(() => {
    let imgElements = document.querySelectorAll('.serp-item__thumb')
    let URLs = Object.values(imgElements).map(
      el => ({
        src: el.src,
        alt: el.alt
      })
    )
    return URLs
  })

  writeFile('imagesURL.json', JSON.stringify(images, null, ' '), err => {
    if (err) return err
    console.log('images -> imagesURL.json')
  })

  images.forEach((image, index) => {
    const file = createWriteStream(`images/${index}.webp`)
    https.get(image.src, response => {
      response.pipe(file)
    })
  })

  await browser.close()
})()