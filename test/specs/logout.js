const { expect, browser } = require('@wdio/globals');

const { LOGIN_LINK } = require('../test-data/testLink').Link;
const isVortex = require('../test-data/testdata').isVortex

describe('Logout Test', () => {
    it('Logout', !isVortex ? async () => {
        await $('div[data-name="profile-entrance"]').waitForClickable({ timeout: 5000 })
        await $('div[data-name="profile-entrance"]').click()
        await $('a[data-name="logout-link"]').click()
        await expect(browser).toHaveUrl(LOGIN_LINK)
    } : async () => {
        await $('div.vortex-avatar-menu__button').waitForClickable({ timeout: 5000 })
        await $('div.vortex-avatar-menu__button').click()
        await $('div=Log Out').click()
        await expect(browser).toHaveUrl(LOGIN_LINK)
    })
})
