
const { expect, browser } = require('@wdio/globals');
const path = require('path');
const { goToPage, goToSubmenu } = require('./sidebar');
const isVortex = require('../test-data/testdata').isVortex
const test_contact = require('../test-data/testdata').contact;
const delay = (ms) => {
    return new Promise(res => {
       setTimeout(() => {
        res()
       }, ms) 
    })
}

const selectContact = async contactName => {
    const contactExist = await $(`span*=${contactName}`).isExisting()
    if(contactExist) {
        const contact = await $(`span*=${contactName}`)
        const Tr = await browser.custom$('closest', contact)
        const selectorEl = await Tr.$('td.mat-column-select')
        await selectorEl.scrollIntoView()
        await browser.execute(ele => {
            ele.querySelector('input[type="checkbox"]').click();
        }, selectorEl)
    }
}


describe('Test Data Setup', () => {
    describe('Preparation', async () => {
        it('Delete Testing Contact', async () => {
            await goToPage('contacts')
            await $('input[name="searchStr"]').setValue(test_contact.full_name)
            await delay(5000)
            let contactName = test_contact.full_name;
            console.log('========', contactName);
            const testingContactExist = await $(`span*=${test_contact.full_name}`).isDisplayed()
            console.log('=============', testingContactExist);
            if(testingContactExist) {
                await delay(3000)
                await selectContact(test_contact.full_name)
                await $('div[data-name="material-action-item-More"]').waitForClickable({ timeout: 2000 })
                await $('div[data-name="material-action-item-More"]').click()
                await $('div[data-name="material-action-item-More-Delete"]').click()
                await $('button[data-action="confirm-downgrade"]').click()
                await delay(3000)
            }
        })
    })
})

describe('Add New Contact', () => {
    it('Add', async () => {
        await goToPage('contacts')
        await $('button[data-action="create-new-contact"]').waitForClickable({ timeout: 10000 })
        await $('button[data-action="create-new-contact"]').click()
        await delay(5000)
        await $('input[data-name="contact-create-firstname"]').setValue(test_contact.first_name)
        await $('input[data-name="contact-create-lastname"]').setValue(test_contact.last_name)
        await $('input[data-name="contact-create-email"]').setValue(test_contact.email)
        await $('app-contact-create-edit app-phone-input input[data-name="add-user-phone"]').setValue(test_contact.phone)
        await delay(2000)
        await $('button[data-action="create-contact-add-btn"]').waitForClickable({ timeout: 3000 })
        await $('button[data-action="create-contact-add-btn"]').click()
        await $('app-contact-create-edit').waitForDisplayed({ reverse: true })
        await delay(5000)
        let testingContactElement = await $('span=' + test_contact.full_name)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await expect(testingContactTr.$('td.mat-column-contact_name span')).toHaveText(test_contact.full_name)
        }
    })
})