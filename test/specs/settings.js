
const { expect, browser } = require('@wdio/globals');
const { goToPage, goToSubmenu } = require('./sidebar');
const isVortex = require('../test-data/testdata').isVortex

const delay = (ms) => {
    return new Promise(res => {
       setTimeout(() => {
        res()
       }, ms) 
    })
}
const mainLink = require('../test-data/testLink').Link.SETTINGS_LINK;

describe('Notifications', () => {
    it('All', async () => {
        await goToSubmenu('notifications')
        const desktop = await $('table tbody tr:first-of-type td:nth-of-type(2) input[type="checkbox"]').isSelected()
        const text = await $('table tbody tr:first-of-type td:nth-of-type(3) input[type="checkbox"]').isSelected()
        const email = await $('table tbody tr:first-of-type td:nth-of-type(4) input[type="checkbox"]').isSelected()
        if(!desktop) await $('table tbody tr:first-of-type td:nth-of-type(2)').click()
        if(!text) await $('table tbody tr:first-of-type td:nth-of-type(3)').click()
        if(!email) await $('table tbody tr:first-of-type td:nth-of-type(4)').click()
        await expect($('table tbody tr:last-of-type td:nth-of-type(2) input[type="checkbox"]')).toBeSelected()
        await expect($('table tbody tr:last-of-type td:nth-of-type(3) input[type="checkbox"]')).toBeSelected()
        await expect($('table tbody tr:last-of-type td:nth-of-type(4) input[type="checkbox"]')).toBeSelected()
    })
})
describe('Task Reminder', () => {
    it('10 mins', async () => {
        await $('select[name="reminder"]').selectByVisibleText('10 mins')
        await delay(2000)
        const selectValue = await $('select[name="reminder"]').getValue()
        await expect(selectValue).toEqual('10')
    })
    it('20 mins', async () => {
        await $('select[name="reminder"]').selectByVisibleText('20 mins')
        await delay(2000)
        const selectValue = await $('select[name="reminder"]').getValue()
        await expect(selectValue).toEqual('20')
    })
    it('30 mins', async () => {
        await $('select[name="reminder"]').selectByVisibleText('30 mins')
        await delay(2000)
        const selectValue = await $('select[name="reminder"]').getValue()
        await expect(selectValue).toEqual('30')
    })
    it('40 mins', async () => {
        await $('select[name="reminder"]').selectByVisibleText('40 mins')
        await delay(2000)
        const selectValue = await $('select[name="reminder"]').getValue()
        await expect(selectValue).toEqual('40')
    })
    it('50 mins', async () => {
        await $('select[name="reminder"]').selectByVisibleText('50 mins')
        await delay(2000)
        const selectValue = await $('select[name="reminder"]').getValue()
        await expect(selectValue).toEqual('50')
    })
    it('1 hour', async () => {
        await $('select[name="reminder"]').selectByVisibleText('1 hour')
        await delay(2000)
        const selectValue = await $('select[name="reminder"]').getValue()
        await expect(selectValue).toEqual('60')
    })
})
describe('Event Reminder', () => {
    it('10 mins', async () => {
        await $('select[name="schedulerReminder"]').selectByVisibleText('10 mins')
        await delay(2000)
        const selectValue = await $('select[name="schedulerReminder"]').getValue()
        await expect(selectValue).toEqual('10')
    })
    it('20 mins', async () => {
        await $('select[name="schedulerReminder"]').selectByVisibleText('20 mins')
        await delay(2000)
        const selectValue = await $('select[name="schedulerReminder"]').getValue()
        await expect(selectValue).toEqual('20')
    })
    it('30 mins', async () => {
        await $('select[name="schedulerReminder"]').selectByVisibleText('30 mins')
        await delay(2000)
        const selectValue = await $('select[name="schedulerReminder"]').getValue()
        await expect(selectValue).toEqual('30')
    })
    it('40 mins', async () => {
        await $('select[name="schedulerReminder"]').selectByVisibleText('40 mins')
        await delay(2000)
        const selectValue = await $('select[name="schedulerReminder"]').getValue()
        await expect(selectValue).toEqual('40')
    })
    it('50 mins', async () => {
        await $('select[name="schedulerReminder"]').selectByVisibleText('50 mins')
        await delay(2000)
        const selectValue = await $('select[name="schedulerReminder"]').getValue()
        await expect(selectValue).toEqual('50')
    })
    it('1 hour', async () => {
        await $('select[name="schedulerReminder"]').selectByVisibleText('1 hour')
        await delay(2000)
        const selectValue = await $('select[name="schedulerReminder"]').getValue()
        await expect(selectValue).toEqual('60')
    })
})
describe.skip('SMS', () => {
    it('Limit Details', async () => {
        await goToSubmenu('sms')
        await $('button[data-action="purchase-messages"]').click()
        await $('app-purchase-message').waitForDisplayed({ timeout: 5000 })
        await expect($('h1.mat-dialog-title')).toHaveText('Add SMS message credits')
        await $('button[data-action="sms-purchase-message-cancel"]').click()
        await $('app-purchase-message').waitForDisplayed({ reverse: true })
    })
    it('Verify Phone number', async () => {
        await goToSubmenu('sms')
        await $('button[data-action="settings-change-phone-number"]').click()
        await $('app-add-phone').waitForDisplayed({ timeout: 5000 })
        await expect($('h1.mat-dialog-title')).toHaveText('Add phone number')
        await $('button[data-action="sms-change-phone-cancel"]').click()
        await $('app-add-phone').waitForDisplayed({ reverse: true })
    })
})
describe('Business Hours', () => {
    it('Set up', async () => {
        await goToSubmenu('businessHours')
        await $('select[name="emailStart"]').selectByVisibleText('1:00 AM')
        await $('select[name="emailEnd"]').selectByVisibleText('9:00 PM')
        await delay(2000)
        await $('button[data-action="business-hour-save"]').click()
        await delay(5000)
        const startValue = await $('select[name="emailStart"]').getValue()
        await expect(startValue).toEqual('01:00:00.000')
        const endValue = await $('select[name="emailEnd"]').getValue()
        await expect(endValue).toEqual('21:00:00.000')
    })
    it.skip('Enable', async () => {
        await goToSubmenu('businessHours')
        await $('select[name="emailStart"]').selectByVisibleText('8:00 AM')
        await $('select[name="emailEnd"]').selectByVisibleText('5:00 PM')
        await $('button[data-action="business-hour-save"]').click()
        await delay(5000)
        await goToPage('contacts')
        await $('table tbody tr:first-of-type td:nth-of-type(2) div.contact-avatar').waitForClickable({ timeout: 5000 })
        await $('table tbody tr:first-of-type td:nth-of-type(2) div.contact-avatar').click()
        await delay(5000)
        await $('mat-form-field[data-name="contact-input-automation-select"]').waitForClickable({ timeout: 5000 })
        await $('mat-form-field[data-name="contact-input-automation-select"]').click()
        await $('mat-option[data-name="contact-input-automation-select-simple"]').scrollIntoView()
        await browser.pause(2000)
        await $('mat-option[data-name="contact-input-automation-select-simple"] div.automation-name').click()
        await $('div.automation-action i.i-automation-start').waitForClickable({ timeout: 3000 })
        await $('div.automation-action i.i-automation-start').click()
        await $('mat-dialog-container').waitForDisplayed({ timeout: 2000 })
        await expect($('app-confirm-business-hour')).toBeDisplayed()
    })
})
if(!isVortex) describe('Assistant', () => {
    it('Add', async () => {
        await goToSubmenu('assistant')
        await $('button[data-action="create-assistant"]').click()
        await $('app-assistant-create').waitForDisplayed({ timeout: 3000 })
        await delay(3000)
        await $('input[name="username"]').setValue('Lionel Messi')
        await delay(3000)
        await $('input[name="email"]').setValue('messi.public@gmail.com')
        await delay(3000)
        await $('input[name="password"]').setValue('argentina')
        await delay(3000)
        await $('input[name="confirmPassword"]').setValue('argentina')
        await delay(3000)
        await $('button[data-action="assistant-create-confirm"]').click()
        await $('app-assistant-create').waitForDisplayed({ reverse: true })
        await expect($('table tbody tr:first-of-type td:first-of-type div.avatar')).toHaveText('LM')
    })
    it('Edit', async () => {
        await goToSubmenu('assistant')
        await $('table tbody tr:first-of-type td.password-col i.i-edit').click()
        await $('mat-dialog-container').waitForDisplayed({ timeout: 3000 })
        await expect($('app-assistant-password')).toBeDisplayed()
        await delay(2000)
        await $('input[name="password"]').setValue('7trophy')
        await delay(2000)
        await $('input[name="confirmPassword"]').setValue('7trophy')
        await delay(2000)
        await $('button[data-action="assistant-password-change"]').click()
        await $('app-assistant-password').waitForDisplayed({ reverse: true })
    })
    it('Disable', async () => {
        await goToSubmenu('assistant')
        await $('table tbody tr:first-of-type td:nth-of-type(3) span.custom-toggle-slider').click()
        await expect($('table tbody tr:first-of-type td:nth-of-type(3) input[type="checkbox"]')).not.toBeSelected()
    })
    it('Enable', async () => {
        await goToSubmenu('assistant')
        await $('table tbody tr:first-of-type td:nth-of-type(3) span.custom-toggle-slider').click()
        await expect($('table tbody tr:first-of-type td:nth-of-type(3) input[type="checkbox"]')).toBeSelected()
    })
    it('Delete', async () => {
        await goToSubmenu('assistant')
        await $('table tbody tr:first-of-type td:last-of-type i.i-trash').click()
        await $('app-assistant-remove').waitForDisplayed({ timeout: 3000 })
        await $('button[data-action="assistant-delete"]').click()
        await $('app-assistant-remove').waitForDisplayed({ reverse: true })
        await expect($('table tbody tr:first-of-type td:first-of-type div.avatar')).not.toExist()
    })
})
describe('Landing Page Theme', () => {
    it('Change Default Theme', async () => {
        await goToSubmenu('landingPageTheme')
        await $('button[data-action="landing-page-default-theme-change"]').click()
        await $('app-material-edit-template').waitForDisplayed({ timeout: 3000 })
        await $('div.themes div.theme:first-of-type').click()
        await expect($('div.themes div.theme:first-of-type')).toHaveAttributeContaining('class', 'selected')
        await $('button[data-action="material-change-landing-save"]').click()
        await $('app-material-edit-template').waitForDisplayed({ reverse: true })
    })
    it.skip('Change Highlights images', async () => {
        let landing = await $('li[data-name="sidebar-submenu-item-landing_page_theme"]').isDisplayedInViewport()
        if(!landing) await $('div[data-name="sidebar-item-settings"]').click()
        await $('li[data-name="sidebar-submenu-item-landing_page_theme"] a').click()
    })
    it.skip('Edit Images for Highlights', async () => {
        let landing = await $('li[data-name="sidebar-submenu-item-landing_page_theme"]').isDisplayedInViewport()
        if(!landing) await $('div[data-name="sidebar-item-settings"]').click()
        await $('li[data-name="sidebar-submenu-item-landing_page_theme"] a').click()
    })
})
describe.skip('Affiliate', () => {
    it('Copy Referral Link', async () => {

    })
    it('Affiliate Dashboard', async () => {

    })
    it('Affiliate Reset Password', async () => {

    })
})
describe.skip('Integration', () => {
    it('Google Mail', async () => {

    })
    it('Outlook Mail', async () => {
        
    })
    it('SMTP Mail', async () => {
        
    })
    it('Google Calendar', async () => {
        
    })
    it('Outlook Calendar', async () => {
        
    })
    it('Activate', async () => {
        
    })
    it('Calendly', async () => {
        
    })
    it('Zoom', async () => {
        
    })
    it('Chrome Extension', async () => {
        
    })
})
describe.skip('Social Profile', () => {
    it('Facebook, Linkedin, Twitter', async () => {

    })
})
