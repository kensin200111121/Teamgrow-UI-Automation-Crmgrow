
const { expect, browser } = require('@wdio/globals');

const { goToPage, goToSubmenu } = require('./sidebar');
const testContactName = require('../test-data/testdata').testPrepare.contact.name;
const delay = (ms) => {
    return new Promise(res => {
       setTimeout(() => {
        res()
       }, ms) 
    })
}

describe('Event', () => {
    it('Create', async () => {
        await goToPage('calendar')
        await $('span[data-name="profile-tab-item-Week"]').click()
        await delay(3000)
        await $('div=Today').click()
        await $('button[data-action="calendar-add-new-meeting"]').click()
        await $('app-calendar-dialog').waitForDisplayed({ timeout: 3000 })
        await delay(3000)
        await $('input[data-name="deal-meeting-title"]').setValue('QA Meeting')
        await delay(3000)
        await $('input[data-name="task-contact-to-assign"]').setValue('j')
        await delay(5000)
        await $('div=' + testContactName).click()
        await delay(2000)
        await $('button[data-action="deal-action-create"]').click()
        await delay(10000)
        await expect($('div=QA Meeting')).toBeDisplayed()
        await goToPage('contacts')
        await $('span=' + testContactName).click()
        await delay(3000)
        await $('app-contact-data-list-container div.data-sections-container div.accordion-item:nth-of-type(3) i.i-arrow-down').click()
        await delay(3000)
        await expect($('app-contact-data-list-container div.data-sections-container div.accordion-item:nth-of-type(3) app-data-list div.contact-data-appointment:first-of-type').$('div=QA Meeting')).toExist()
    })
    it('Edit', async () => {
        await goToPage('calendar')
        await $('span[data-name="profile-tab-item-Week"]').click()
        await delay(3000)
        await $('div=Today').click()
        await $('div=QA Meeting').waitForClickable({ timeout: 5000 })
        await $('div=QA Meeting').click()
        await $('app-calendar-event').waitForDisplayed({ timeout: 3000 })
        await $('app-calendar-event i.i-edit').click()
        await $('app-calendar-dialog').waitForDisplayed({ timeout: 3000 })
        await delay(3000)
        await $('input[data-name="deal-meeting-title"]').setValue('Scrum Meeting')
        await delay(3000)
        await $('app-calendar-dialog').$('button=Update').click()
        await delay(10000)
        await expect($('div=Scrum Meeting')).toBeDisplayed()
        await goToPage('contacts')
        await $('span=' + testContactName).click()
        await delay(3000)
        await $('app-contact-data-list-container div.data-sections-container div.accordion-item:nth-of-type(3) i.i-arrow-down').click()
        await delay(3000)
        await expect($('app-contact-data-list-container div.data-sections-container div.accordion-item:nth-of-type(3) app-data-list div.contact-data-appointment:first-of-type').$('div=Scrum Meeting')).toExist()
    })
    it('Remove', async () => {
        await goToPage('calendar')
        await $('span[data-name="profile-tab-item-Week"]').click()
        await delay(3000)
        await $('div=Today').click()
        await $('div=Scrum Meeting').waitForClickable({ timeout: 5000 })
        await $('div=Scrum Meeting').click()
        await $('app-calendar-event').waitForDisplayed({ timeout: 3000 })
        await $('app-calendar-event i.i-trash').click()
        await $('app-confirm').waitForDisplayed({ timeout: 3000 })
        await $('app-confirm').$('button=OK').click()
        await delay(3000)
    })
})

 