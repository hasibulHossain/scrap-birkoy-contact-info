const puppeteer = require('puppeteer-core');
const fs = require('fs');


const run = () => new Promise(async (resolve) => {
   console.log('from root_______')
   let launchOption = {
      headless: false,
      executablePath: '/usr/bin/google-chrome-stable',
      args: ['--start-maximized']
   };

   const browser = await puppeteer.launch(launchOption);
   const page = await browser.newPage();
   await page.setViewport({ width: 1440, height: 900 });

   //Products list
   const productsList = [];

   //pages urls 256
   const urls = [];
   for (let i = 1; i < 3; i++) {
      urls.push(`https://bikroy.com/en/ads/dhaka/mobile-phones?by_paying_member=0&sort=date&buy_now=0&urgent=0&page=${i}`)
   };

   //looping through urls
   for (let i = 0; i < urls.length; i++) {
      console.log('from first loop-----------')
      const data = []

      const url = urls[i];
      await page.goto(url, { waitUntil: 'load', timeout: 0 });

      //get all team rows
      page.waitForSelector('.card-link--3ssYv.gtm-ad-item', {timeout: 0});
      const items = await page.$$('.card-link--3ssYv.gtm-ad-item');

      for (let item = 0; item < items.length; item++) {
         console.log('from second loop------------')
         const link = await page.evaluate((item) => {
            const itemLink = document.querySelectorAll('.card-link--3ssYv.gtm-ad-item')[item].href;
            return itemLink;
         }, item);

         await page.goto(link, { timeout: 0 });
         await page.waitFor(150)

         if (await page.$('.card--_2NNk .membership-container--1hm7D') !== null) {
            await page.goBack()

         } else if(await page.$('.display--s3dc8 > .gtm-show-number') == null) {
            await page.goBack()

         } else {
            await page.waitForSelector('.display--s3dc8 > .gtm-show-number')
            await page.click('.display--s3dc8 > .gtm-show-number');

            const result = await page.evaluate(() => {
               const name = document.querySelector('.contact-name--m97Sb');
               const number = document.querySelector('.phone-numbers--2COKR');

               const nameNumberPush = (item) => {
                  if(item) {
                     return item.innerText.trim();
                  } else {
                     return 'error';
                  }
               }

               return {
                  name: nameNumberPush(name),
                  number: nameNumberPush(number)
               }
            });

            data.push(result)
            await page.goBack()
         }

      };
      console.log('after second loop-----------')
      fs.appendFile(
         './data/test.json',
         JSON.stringify({pageNumber: i + 1, timeStump: new Date().getTime(), userNumberList: data}, null, '\t'),
         { flag: 'a'},
         err => err ? console.error('Data not written!', err) : console.log('data written')
      )

      productsList.push(data);
   }

   await browser.close();
})

run()
