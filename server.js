const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();

app.use(bodyParser.text({
    inflate: true,
    limit: '1mb',
    type: 'text/html'
}));

app.post('/from-html', async (req, res) => {
    if (typeof req.body !== 'string') {
        res.status(400);
        res.send('Invalid content-type');
        return;
    }

    const browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/google-chrome',
        args: [
            "--no-sandbox",
            "--disable-gpu",
        ]
    });
    const page = await browser.newPage();
    await page.setContent(req.body);
    const pdf = await page.pdf({ format: 'A4' });
    await browser.close();

    res.set('Content-Type', 'application/pdf');
    res.send(pdf);
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});