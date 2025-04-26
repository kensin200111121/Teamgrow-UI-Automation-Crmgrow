
const { expect, browser } = require('@wdio/globals');
// const { getAddHeaderUrl, getAddHeadersUrl } = require('chrome-modheader');

const isVortex = require('../test-data/testdata').isVortex
const { email, password} = require('../test-data/testdata').user;
const { LOGIN_LINK, HOME_LINK } = require('../test-data/testLink').Link;

console.log(process.env);

describe('Login Test', () => {
    it('Login', !isVortex ? async () => {
        // await browser.url(getAddHeadersUrl({Origin: '*'}))
        // await browser.waitUntil(async () => (await browser.getTitle()) === 'Done', { timeout: 50000 });
        await browser.url(LOGIN_LINK)
        // await browser.maximizeWindow()
        await $('input[data-name="login-email"]').setValue(email)
        await $('input[data-name="login-password"]').setValue(password)
        await $('button[data-action="login-submit"]').click()
        await expect(browser).toHaveUrl(HOME_LINK)
    } : async () => {
        await browser.url(LOGIN_LINK)
        // await browser.maximizeWindow()
        await $('input[name="username"]').setValue(email)
        await $('input[name="password"]').setValue(password)
        await $('button.login-button').click()
        await expect(browser).toHaveUrl(HOME_LINK)
    })
})






