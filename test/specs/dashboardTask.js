
const { expect, browser } = require('@wdio/globals');

const testContactFirstName = 'Long'
const testContactLastName = 'Hao'
const testContactFullName = 'Long Hao'
const testContactEmail = 'test@crmgrow.com'
const testContactPhoneNumber = '3214479721'
const testZipcode = 'My Zipcode'

const delay = (ms) => {
    return new Promise(res => {
       setTimeout(() => {
        res()
       }, ms) 
    })
}
const { goToPage, goToSubmenu } = require('./sidebar');
const isVortex = require('../test-data/testdata').isVortex

const mainLink = require('../test-data/testLink').Link.TASKS_LINK;
const testContactName = require('../test-data/testdata').testPrepare.contact.name;

describe('Test Data Setup', () => {
    describe('Preparation', () => {
        it('Remove Test Tasks', async () => {
            await goToPage('tasks')
            const anyAccountExist = await $('app-tasks div.custom-mat-table table tbody tr:first-of-type td.mat-column-contact_name span').isDisplayed()
            if(anyAccountExist) {
                const latestAccount = await $('app-tasks div.custom-mat-table table tbody tr:first-of-type td.mat-column-contact_name span').getText()
                if(latestAccount === testContactName) {
                    await goToPage('contacts')
                    await $('span=' + testContactName).click()
                    await delay(3000)
                    await $('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type div.accordion-header i.i-task').click()
                    const dataShow = await $('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type app-data-list').isDisplayed()
                    if(!dataShow) {
                        await $('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type div.accordion-header i.i-arrow-down').click()
                    }
                    await delay(7000)
                    await browser.waitUntil(async () => {
                        await $('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type app-data-list div.contact-data-task:first-of-type i.i-menu-more').click()
                        await $('span=Delete').click()
                        await delay(1000)
                        const normal = await $('app-confirm').isDisplayedInViewport()
                        if(normal) {
                            await $('button[data-action="confirm-downgrade"]').click()
                        } else {
                            await $('span=All tasks').click()
                            await $('button=OK').click()
                        }
                        await delay(6000)
                        const stillRemaining = await $('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type app-data-list div.contact-data-task:first-of-type div.task-checkbox').isExisting()
                        return !stillRemaining
                    }, {
                        timeout: 200000,
                        timeoutMsg: 'expect to remove all tasks'
                    })
                    await delay(2000)
                    await goToPage('tasks')
                    const anyTaskExist = await $('table tbody tr:first-of-type td.mat-column-contact_name span').isDisplayed()
                    if(anyTaskExist) {
                        await expect($('table tbody tr:first-of-type td.mat-column-contact_name span')).not.toHaveText(testContactName)
                    }
                }
            }
        })
    })
})
describe('Create New Task', () => {
    describe('General', () => {
        it('Timezone', async () => {
            await goToPage('tasks')
            await $('button[data-action="create-new-task"]').click()
            await $('app-task-create').waitForDisplayed({ timeout: 2000 })
            await $('div[data-name="task-type-general"]').click()
            await $('input[id="content_tc"]').setValue('key to success')
            await $('input[data-name="task-contact-to-assign"]').setValue('j')
            await $('div=' + testContactName).waitForClickable({ timeout: 8000 })
            await $('div=' + testContactName).click()
            // Date Time
            await $('input[data-name="task-date-picker"]').click()
            await browser.waitUntil(async () => {
                await $('div.calendar-time div.calendar-controls i.i-chev-right').click()
                const text = await $('div.calendar-time div.date span').getText()
                return text.includes("January")
            })
            await $('mwl-calendar-month-view div.cal-days > div:nth-of-type(2) mwl-calendar-month-cell:nth-of-type(2) span.cal-day-number').click()
            await $('mat-select[data-name="task-time-select"]').click() 
            await $('div.cdk-overlay-container').$('div.cdk-overlay-connected-position-bounding-box').$('span=10:00 AM').click()
            // Timezone
            await $('app-select-timezone div.dropdown-toggle').click()
            await $('span[data-name="task-timezone-select-Eastern Time"]').click()
            await $('button[data-action="new-task-create"]').click()
            await $('app-task-create').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('table tbody tr:first-of-type td.mat-column-contact_name span')).toHaveText(testContactName)
            await expect($('table tbody tr:first-of-type td.mat-column-subject span')).toHaveText('key to success')
        })
        it('All day', async () => {
            await goToPage('tasks')
            await $('button[data-action="create-new-task"]').click()
            await $('app-task-create').waitForDisplayed({ timeout: 2000 })
            await $('div[data-name="task-type-general"]').click()
            await $('input[id="content_tc"]').setValue('key to success')
            await $('input[data-name="task-contact-to-assign"]').setValue('j')
            await $('div=' + testContactName).waitForClickable({ timeout: 10000 })
            await $('div=' + testContactName).click()
            // Date Time
            await $('input[data-name="task-date-picker"]').click()
            await browser.waitUntil(async () => {
                await $('div.calendar-time div.calendar-controls i.i-chev-right').click()
                const text = await $('div.calendar-time div.date span').getText()
                return text === "January 2024" || text === "January 2025"
            })
            await $('mwl-calendar-month-view div.cal-days > div:nth-of-type(2) mwl-calendar-month-cell:nth-of-type(2) span.cal-day-number').click()
            await $('mat-select[data-name="task-time-select"]').click() 
            await $('div.cdk-overlay-container').$('div.cdk-overlay-connected-position-bounding-box').$('span=10:00 AM').click()
            // Timezone
            await $('app-select-timezone div.dropdown-toggle').click()
            await $('span[data-name="task-timezone-select-Eastern Time"]').click()
            await $('label[data-name="all_day_tc"]').click()
            await $('button[data-action="new-task-create"]').click()
            await $('app-task-create').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('table tbody tr:first-of-type td.mat-column-contact_name span')).toHaveText(testContactName)
            // await expect($('table tbody tr:first-of-type td.mat-column-subject i.i-task')).toExist()
            await expect($('table tbody tr:first-of-type td.mat-column-subject span')).toHaveText('key to success')
        })
        // it('Recurring', async () => {
        //     await goToPage('tasks')
        //     await $('button[data-action="create-new-task"]').waitForClickable({ timeout: 5000 })
        //     await $('button[data-action="create-new-task"]').click()
        //     await $('app-task-create').waitForDisplayed({ timeout: 2000 })
        //     await $('div[data-name="task-type-general"]').click()
        //     await $('input[id="content_tc"]').setValue('key to success')
        //     await $('input[data-name="task-contact-to-assign"]').setValue('j')
        //     await delay(3000)
        //     await $('div=' + testContactName).waitForClickable({ timeout: 10000 })
        //     await $('div=' + testContactName).click()
        //     // Date Time
        //     await $('input[data-name="task-date-picker"]').click()
        //     await browser.waitUntil(async () => {
        //         await $('div.calendar-time div.calendar-controls i.i-chev-right').click()
        //         const text = await $('div.calendar-time div.date span').getText()
        //         return text === "January 2024" || text === "January 2025"
        //     })
        //     await $('mwl-calendar-month-view div.cal-days > div:nth-of-type(2) mwl-calendar-month-cell:nth-of-type(2) span.cal-day-number').click()
        //     await $('mat-select[data-name="task-time-select"]').click() 
        //     await $('div.cdk-overlay-container').$('div.cdk-overlay-connected-position-bounding-box').$('span=10:00 AM').click()
        //     // Timezone
        //     await $('app-select-timezone div.dropdown-toggle').click()
        //     await $('span[data-name="task-timezone-select-Eastern Time"]').click()
        //     await $('label[data-name="repeat_tc"]').click()
        //     await $('select[name="duration"]').click()
        //     await $('select[name="duration"] option[data-name="task-recurring-select-item-Daily"]').click()
        //     await $('button[data-action="new-task-create"]').click()
        //     await $('app-task-create').waitForDisplayed({ reverse: true })
        //     await delay(3000)
        //     await expect($('table tbody tr:first-of-type td.mat-column-contact_name span')).toHaveText(testContactName)
        //     // await expect($('table tbody tr:first-of-type td.mat-column-subject i.i-task')).toExist()
        //     await expect($('table tbody tr:first-of-type td.mat-column-subject span')).toHaveText('key to success')
        //     await delay(3000)
        // })
    })
    describe.skip('Call', () => {
        it('Timezone', async () => {
            await goToPage('tasks')
            await $('button[data-action="create-new-task"]').click()
            await $('app-task-create').waitForDisplayed({ timeout: 2000 })
            await $('div[data-name="task-type-call"]').click()
            await $('input[id="content_tc"]').setValue('key to success')
            await $('input[data-name="task-contact-to-assign"]').setValue('j')
            await $('div=' + testContactName).waitForClickable({ timeout: 10000 })
            await $('div=' + testContactName).click()
            // Date Time
            await $('input[data-name="task-date-picker"]').click()
            await browser.waitUntil(async () => {
                await $('div.calendar-time div.calendar-controls i.i-chev-right').click()
                const text = await $('div.calendar-time div.date span').getText()
                return text === "January 2024" || text === "January 2025"
            })
            await $('mwl-calendar-month-view div.cal-days > div:nth-of-type(2) mwl-calendar-month-cell:nth-of-type(2) span.cal-day-number').click()
            await $('mat-select[data-name="task-time-select"]').click() 
            await $('div.cdk-overlay-container').$('div.cdk-overlay-connected-position-bounding-box').$('span=10:15 AM').click()
            // Timezone
            await $('app-select-timezone div.dropdown-toggle').click()
            await $('span[data-name="task-timezone-select-Eastern Time"]').click()
            await $('button[data-action="new-task-create"]').click()
            await $('app-task-create').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('table tbody tr:first-of-type td.mat-column-contact_name span')).toHaveText(testContactName)
            // await expect($('table tbody tr:first-of-type td.mat-column-subject i.i-phone')).toExist()
            await expect($('table tbody tr:first-of-type td.mat-column-subject span')).toHaveText('key to success')
        })
        it('All day', async () => {
            await goToPage('tasks')
            await $('button[data-action="create-new-task"]').click()
            await $('app-task-create').waitForDisplayed({ timeout: 2000 })
            await $('div[data-name="task-type-call"]').click()
            await $('input[id="content_tc"]').setValue('key to success')
            await $('input[data-name="task-contact-to-assign"]').setValue('j')
            await $('div=' + testContactName).waitForClickable({ timeout: 10000 })
            await $('div=' + testContactName).click()
            // Date Time
            await $('input[data-name="task-date-picker"]').click()
            await browser.waitUntil(async () => {
                await $('div.calendar-time div.calendar-controls i.i-chev-right').click()
                const text = await $('div.calendar-time div.date span').getText()
                return text === "January 2024" || text === "January 2025"
            })
            await $('mwl-calendar-month-view div.cal-days > div:nth-of-type(2) mwl-calendar-month-cell:nth-of-type(2) span.cal-day-number').click()
            await $('mat-select[data-name="task-time-select"]').click() 
            await $('div.cdk-overlay-container').$('div.cdk-overlay-connected-position-bounding-box').$('span=10:15 AM').click()
            // Timezone
            await $('app-select-timezone div.dropdown-toggle').click()
            await $('span[data-name="task-timezone-select-Eastern Time"]').click()
            await $('label[data-name="all_day_tc"]').click()
            await $('button[data-action="new-task-create"]').click()
            await $('app-task-create').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('table tbody tr:first-of-type td.mat-column-contact_name span')).toHaveText(testContactName)
            // await expect($('table tbody tr:first-of-type td.mat-column-subject i.i-phone')).toExist()
            await expect($('table tbody tr:first-of-type td.mat-column-subject span')).toHaveText('key to success')
        })
        // it('Recurring', async () => {
        //     await goToPage('tasks')
        //     await $('button[data-action="create-new-task"]').waitForClickable({ timeout: 5000 })
        //     await $('button[data-action="create-new-task"]').click()
        //     await $('app-task-create').waitForDisplayed({ timeout: 2000 })
        //     await $('div[data-name="task-type-call"]').click()
        //     await $('input[id="content_tc"]').setValue('key to success')
        //     await $('input[data-name="task-contact-to-assign"]').setValue('j')
        //     await $('div=' + testContactName).waitForClickable({ timeout: 10000 })
        //     await $('div=' + testContactName).click()
        //     // Date Time
        //     await $('input[data-name="task-date-picker"]').click()
        //     await browser.waitUntil(async () => {
        //         await $('div.calendar-time div.calendar-controls i.i-chev-right').click()
        //         const text = await $('div.calendar-time div.date span').getText()
        //         return text === "January 2024" || text === "January 2025"
        //     })
        //     await $('mwl-calendar-month-view div.cal-days > div:nth-of-type(2) mwl-calendar-month-cell:nth-of-type(2) span.cal-day-number').click()
        //     await $('mat-select[data-name="task-time-select"]').click() 
        //     await $('div.cdk-overlay-container').$('div.cdk-overlay-connected-position-bounding-box').$('span=10:15 AM').click()
        //     // Timezone
        //     await $('app-select-timezone div.dropdown-toggle').click()
        //     await $('span[data-name="task-timezone-select-Eastern Time"]').click()
        //     await $('label[data-name="repeat_tc"]').click()
        //     await $('select[name="duration"]').click()
        //     await $('select[name="duration"] option[data-name="task-recurring-select-item-Daily"]').click()
        //     await $('button[data-action="new-task-create"]').click()
        //     await $('app-task-create').waitForDisplayed({ reverse: true })
        //     await delay(3000)
        //     await expect($('table tbody tr:first-of-type td.mat-column-contact_name span')).toHaveText(testContactName)
        //     // await expect($('table tbody tr:first-of-type td.mat-column-subject i.i-phone')).toExist()
        //     await expect($('table tbody tr:first-of-type td.mat-column-subject span')).toHaveText('key to success')
        //     await delay(3000)
        // })
    })
    describe('Meeting', () => {
        it('Timezone', async () => {
            await goToPage('tasks')
            await $('button[data-action="create-new-task"]').click()
            await $('app-task-create').waitForDisplayed({ timeout: 2000 })
            await $('div[data-name="task-type-meeting"]').click()
            await $('input[id="content_tc"]').setValue('key to success')
            await $('input[data-name="task-contact-to-assign"]').setValue('j')
            await $('div=' + testContactName).waitForClickable({ timeout: 10000 })
            await $('div=' + testContactName).click()
            // Date Time
            await $('input[data-name="task-date-picker"]').click()
            await browser.waitUntil(async () => {
                await $('div.calendar-time div.calendar-controls i.i-chev-right').click()
                const text = await $('div.calendar-time div.date span').getText()
                return text === "January 2024" || text === "January 2025"
            })
            await $('mwl-calendar-month-view div.cal-days > div:nth-of-type(2) mwl-calendar-month-cell:nth-of-type(2) span.cal-day-number').click()
            await $('mat-select[data-name="task-time-select"]').click() 
            await $('div.cdk-overlay-container').$('div.cdk-overlay-connected-position-bounding-box').$('span=10:30 AM').click()
            // Timezone
            await $('app-select-timezone div.dropdown-toggle').click()
            await $('span[data-name="task-timezone-select-Eastern Time"]').click()
            await $('button[data-action="new-task-create"]').click()
            await $('app-task-create').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('table tbody tr:first-of-type td.mat-column-contact_name span')).toHaveText(testContactName)
            // await expect($('table tbody tr:first-of-type td.mat-column-subject i.i-lunch')).toExist()
            await expect($('table tbody tr:first-of-type td.mat-column-subject span')).toHaveText('key to success')
        })
        it('All day', async () => {
            await goToPage('tasks')
            await $('button[data-action="create-new-task"]').click()
            await $('app-task-create').waitForDisplayed({ timeout: 2000 })
            await $('div[data-name="task-type-meeting"]').click()
            await $('input[id="content_tc"]').setValue('key to success')
            await $('input[data-name="task-contact-to-assign"]').setValue('j')
            await $('div=' + testContactName).waitForClickable({ timeout: 10000 })
            await $('div=' + testContactName).click()
            // Date Time
            await $('input[data-name="task-date-picker"]').click()
            await browser.waitUntil(async () => {
                await $('div.calendar-time div.calendar-controls i.i-chev-right').click()
                const text = await $('div.calendar-time div.date span').getText()
                return text === "January 2024" || text === "January 2025"
            })
            await $('mwl-calendar-month-view div.cal-days > div:nth-of-type(2) mwl-calendar-month-cell:nth-of-type(2) span.cal-day-number').click()
            await $('mat-select[data-name="task-time-select"]').click() 
            await $('div.cdk-overlay-container').$('div.cdk-overlay-connected-position-bounding-box').$('span=10:30 AM').click()
            // Timezone
            await $('app-select-timezone div.dropdown-toggle').click()
            await $('span[data-name="task-timezone-select-Eastern Time"]').click()
            await $('label[data-name="all_day_tc"]').click()
            await $('button[data-action="new-task-create"]').click()
            await $('app-task-create').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('table tbody tr:first-of-type td.mat-column-contact_name span')).toHaveText(testContactName)
            // await expect($('table tbody tr:first-of-type td.mat-column-subject i.i-lunch')).toExist()
            await expect($('table tbody tr:first-of-type td.mat-column-subject span')).toHaveText('key to success')
        })
        // it('Recurring', async () => {
        //     await goToPage('tasks')
        //     await $('button[data-action="create-new-task"]').waitForClickable({ timeout: 5000 })
        //     await $('button[data-action="create-new-task"]').click()
        //     await $('app-task-create').waitForDisplayed({ timeout: 2000 })
        //     await $('div[data-name="task-type-meeting"]').click()
        //     await $('input[id="content_tc"]').setValue('key to success')
        //     await $('input[data-name="task-contact-to-assign"]').setValue('j')
        //     await $('div=' + testContactName).waitForClickable({ timeout: 10000 })
        //     await $('div=' + testContactName).click()
        //     // Date Time
        //     await $('input[data-name="task-date-picker"]').click()
        //     await browser.waitUntil(async () => {
        //         await $('div.calendar-time div.calendar-controls i.i-chev-right').click()
        //         const text = await $('div.calendar-time div.date span').getText()
        //         return text === "January 2024" || text === "January 2025"
        //     })
        //     await $('mwl-calendar-month-view div.cal-days > div:nth-of-type(2) mwl-calendar-month-cell:nth-of-type(2) span.cal-day-number').click()
        //     await $('mat-select[data-name="task-time-select"]').click() 
        //     await $('div.cdk-overlay-container').$('div.cdk-overlay-connected-position-bounding-box').$('span=10:30 AM').click()
        //     // Timezone
        //     await $('app-select-timezone div.dropdown-toggle').click()
        //     await $('span[data-name="task-timezone-select-Eastern Time"]').click()
        //     await $('label[data-name="repeat_tc"]').click()
        //     await $('select[name="duration"]').click()
        //     await $('select[name="duration"] option[data-name="task-recurring-select-item-Daily"]').click()
        //     await $('button[data-action="new-task-create"]').click()
        //     await $('app-task-create').waitForDisplayed({ reverse: true })
        //     await delay(3000)
        //     await expect($('table tbody tr:first-of-type td.mat-column-contact_name span')).toHaveText(testContactName)
        //     // await expect($('table tbody tr:first-of-type td.mat-column-subject i.i-lunch')).toExist()
        //     await expect($('table tbody tr:first-of-type td.mat-column-subject span')).toHaveText('key to success')
        //     await delay(3000)
        // })
    })
    describe('Email', () => {
        it('Timezone', async () => {
            await goToPage('tasks')
            await $('button[data-action="create-new-task"]').click()
            await $('app-task-create').waitForDisplayed({ timeout: 2000 })
            await $('div[data-name="task-type-email"]').click()
            await $('input[id="content_tc"]').setValue('key to success')
            await $('input[data-name="task-contact-to-assign"]').setValue('j')
            await $('div=' + testContactName).waitForClickable({ timeout: 10000 })
            await $('div=' + testContactName).click()
            // Date Time
            await $('input[data-name="task-date-picker"]').click()
            await browser.waitUntil(async () => {
                await $('div.calendar-time div.calendar-controls i.i-chev-right').click()
                const text = await $('div.calendar-time div.date span').getText()
                return text === "January 2024" || text === "January 2025"
            }, {
                timeout: 200000,
            })
            await $('mwl-calendar-month-view div.cal-days > div:nth-of-type(2) mwl-calendar-month-cell:nth-of-type(2) span.cal-day-number').click()
            await $('mat-select[data-name="task-time-select"]').click() 
            await $('div.cdk-overlay-container').$('div.cdk-overlay-connected-position-bounding-box').$('span=10:45 AM').click()
            // Timezone
            await $('app-select-timezone div.dropdown-toggle').click()
            await $('span[data-name="task-timezone-select-Eastern Time"]').click()
            await $('button[data-action="new-task-create"]').click()
            await $('app-task-create').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('table tbody tr:first-of-type td.mat-column-contact_name span')).toHaveText(testContactName)
            // await expect($('table tbody tr:first-of-type td.mat-column-subject i.i-message')).toExist()
            await expect($('table tbody tr:first-of-type td.mat-column-subject span')).toHaveText('key to success')
        })
        // it('Recurring', async () => {
        //     await goToPage('tasks')
        //     await $('button[data-action="create-new-task"]').waitForClickable({ timeout: 5000 })
        //     await $('button[data-action="create-new-task"]').click()
        //     await $('app-task-create').waitForDisplayed({ timeout: 2000 })
        //     await $('div[data-name="task-type-email"]').click()
        //     await $('input[id="content_tc"]').setValue('key to success')
        //     await $('input[data-name="task-contact-to-assign"]').setValue('j')
        //     await $('div=' + testContactName).waitForClickable({ timeout: 10000 })
        //     await $('div=' + testContactName).click()
        //     // Date Time
        //     await $('input[data-name="task-date-picker"]').click()
        //     await browser.waitUntil(async () => {
        //         await $('div.calendar-time div.calendar-controls i.i-chev-right').click()
        //         const text = await $('div.calendar-time div.date span').getText()
        //         return text === "January 2024" || text === "January 2025"
        //     })
        //     await $('mwl-calendar-month-view div.cal-days > div:nth-of-type(2) mwl-calendar-month-cell:nth-of-type(2) span.cal-day-number').click()
        //     await $('mat-select[data-name="task-time-select"]').click() 
        //     await $('div.cdk-overlay-container').$('div.cdk-overlay-connected-position-bounding-box').$('span=10:45 AM').click()
        //     // Timezone
        //     await $('app-select-timezone div.dropdown-toggle').click()
        //     await $('span[data-name="task-timezone-select-Eastern Time"]').click()
        //     await $('label[data-name="repeat_tc"]').click()
        //     await $('select[name="duration"]').click()
        //     await $('select[name="duration"] option[data-name="task-recurring-select-item-Daily"]').click()
        //     await $('button[data-action="new-task-create"]').click()
        //     await $('app-task-create').waitForDisplayed({ reverse: true })
        //     await delay(3000)
        //     await expect($('table tbody tr:first-of-type td.mat-column-contact_name span')).toHaveText(testContactName)
        //     // await expect($('table tbody tr:first-of-type td.mat-column-subject i.i-message')).toExist()
        //     await expect($('table tbody tr:first-of-type td.mat-column-subject span')).toHaveText('key to success')
        //     await delay(3000)
        // })
    })
    describe.skip('Text', () => {
        it('Timezone', async () => {
            await goToPage('tasks')
            await $('button[data-action="create-new-task"]').click()
            await $('app-task-create').waitForDisplayed({ timeout: 2000 })
            await $('div[data-name="task-type-text"]').click()
            await $('input[id="content_tc"]').setValue('key to success')
            await $('input[data-name="task-contact-to-assign"]').setValue('j')
            await $('div=' + testContactName).waitForClickable({ timeout: 10000 })
            await $('div=' + testContactName).click()
            // Date Time
            await $('input[data-name="task-date-picker"]').click()
            await browser.waitUntil(async () => {
                await $('div.calendar-time div.calendar-controls i.i-chev-right').click()
                const text = await $('div.calendar-time div.date span').getText()
                return text === "January 2024" || text === "January 2025"
            })
            await $('mwl-calendar-month-view div.cal-days > div:nth-of-type(2) mwl-calendar-month-cell:nth-of-type(2) span.cal-day-number').click()
            await $('mat-select[data-name="task-time-select"]').click() 
            await $('div.cdk-overlay-container').$('div.cdk-overlay-connected-position-bounding-box').$('span=11:00 AM').click()
            // Timezone
            await $('app-select-timezone div.dropdown-toggle').click()
            await $('span[data-name="task-timezone-select-Eastern Time"]').click()
            await $('button[data-action="new-task-create"]').click()
            await $('app-task-create').waitForDisplayed({ reverse: true })
            await expect($('table tbody tr:first-of-type td.mat-column-contact_name span')).toHaveText(testContactName)
            // await expect($('table tbody tr:first-of-type td.mat-column-subject i.i-sms-sent')).toExist()
            await expect($('table tbody tr:first-of-type td.mat-column-subject span')).toHaveText('key to success')
        })
        // it('Recurring', async () => {
        //     await goToPage('tasks')
        //     await $('button[data-action="create-new-task"]').waitForClickable({ timeout: 5000 })
        //     await $('button[data-action="create-new-task"]').click()
        //     await $('app-task-create').waitForDisplayed({ timeout: 2000 })
        //     await $('div[data-name="task-type-text"]').click()
        //     await $('input[id="content_tc"]').setValue('key to success')
        //     await $('input[data-name="task-contact-to-assign"]').setValue('j')
        //     await $('div=' + testContactName).waitForClickable({ timeout: 10000 })
        //     await $('div=' + testContactName).click()
        //     // Date Time
        //     await $('input[data-name="task-date-picker"]').click()
        //     await browser.waitUntil(async () => {
        //         await $('div.calendar-time div.calendar-controls i.i-chev-right').click()
        //         const text = await $('div.calendar-time div.date span').getText()
        //         return text === "January 2024" || text === "January 2025"
        //     })
        //     await $('mwl-calendar-month-view div.cal-days > div:nth-of-type(2) mwl-calendar-month-cell:nth-of-type(2) span.cal-day-number').click()
        //     await $('mat-select[data-name="task-time-select"]').click() 
        //     await $('div.cdk-overlay-container').$('div.cdk-overlay-connected-position-bounding-box').$('span=11:00 AM').click()
        //     // Timezone
        //     await $('app-select-timezone div.dropdown-toggle').click()
        //     await $('span[data-name="task-timezone-select-Eastern Time"]').click()
        //     await $('label[data-name="repeat_tc"]').click()
        //     await $('select[name="duration"]').click()
        //     await $('select[name="duration"] option[data-name="task-recurring-select-item-Daily"]').click()
        //     await $('button[data-action="new-task-create"]').click()
        //     await $('app-task-create').waitForDisplayed({ reverse: true })
        //     await expect($('table tbody tr:first-of-type td.mat-column-contact_name span')).toHaveText(testContactName)
        //     // await expect($('table tbody tr:first-of-type td.mat-column-subject i.i-sms-sent')).toExist()
        //     await expect($('table tbody tr:first-of-type td.mat-column-subject span')).toHaveText('key to success')
        //     await delay(3000)
        // })
    })
})
describe('Filter', () => {
    describe('Task Type Filter', () => {
        it('General', async () => {
            await goToPage('tasks')
            await $('div[data-name="task-filter"]').click()
            await $('div[data-name="task-filter-select-types"]').click() // Task Type filter
            await $('label[id="task-type-filter-select-0"]').click() // General
            await $('button[data-action="task-type-filter-apply-btn"]').click()
            await expect($('app-task-filter-options div.f-3 > span:first-of-type')).toHaveText('Task type')
            await expect($('app-task-filter-options div.f-3 > span:last-of-type span')).toHaveText('General')
            await $('span[id="task-filter-clear"]').waitForClickable({ timeout: 3000 })
            await $('span[id="task-filter-clear"]').click()
            await delay(5000)
        })
        it('Call', async () => {
            await goToPage('tasks')
            await $('div[data-name="task-filter"]').click()
            await $('div[data-name="task-filter-select-types"]').click() // Task Type filter
            await $('label[id="task-type-filter-select-1"]').click()
            await $('button[data-action="task-type-filter-apply-btn"]').click()
            await expect($('app-task-filter-options div.f-3 > span:first-of-type')).toHaveText('Task type')
            await expect($('app-task-filter-options div.f-3 > span:last-of-type span')).toHaveText('Call')
            await $('span[id="task-filter-clear"]').waitForClickable({ timeout: 3000 })
            await $('span[id="task-filter-clear"]').click()
            await delay(5000)
        })
        it('Meeting', async () => {
            await goToPage('tasks')
            await $('div[data-name="task-filter"]').click()
            await $('div[data-name="task-filter-select-types"]').click() // Task Type filter
            await $('label[id="task-type-filter-select-2"]').click()
            await $('button[data-action="task-type-filter-apply-btn"]').click()
            await expect($('app-task-filter-options div.f-3 > span:first-of-type')).toHaveText('Task type')
            await expect($('app-task-filter-options div.f-3 > span:last-of-type span')).toHaveText('Meeting')
            await $('span[id="task-filter-clear"]').waitForClickable({ timeout: 3000 })
            await $('span[id="task-filter-clear"]').click()
            await delay(5000)
        })
        it('Email', async () => {
            await goToPage('tasks')
            await $('div[data-name="task-filter"]').click()
            await $('div[data-name="task-filter-select-types"]').click() // Task Type filter
            await $('label[id="task-type-filter-select-3"]').click()
            await $('button[data-action="task-type-filter-apply-btn"]').click()
            await expect($('app-task-filter-options div.f-3 > span:first-of-type')).toHaveText('Task type')
            await expect($('app-task-filter-options div.f-3 > span:last-of-type span')).toHaveText('Email')
            await $('span[id="task-filter-clear"]').waitForClickable({ timeout: 3000 })
            await $('span[id="task-filter-clear"]').click()
            await delay(5000)
        })
        it('Text', async () => {
            await goToPage('tasks')
            await $('div[data-name="task-filter"]').click()
            await $('div[data-name="task-filter-select-types"]').click() // Task Type filter
            await $('label[id="task-type-filter-select-4"]').click()
            await $('button[data-action="task-type-filter-apply-btn"]').click()
            await expect($('app-task-filter-options div.f-3 > span:first-of-type')).toHaveText('Task type')
            await expect($('app-task-filter-options div.f-3 > span:last-of-type span')).toHaveText('Text')
            await $('span[id="task-filter-clear"]').waitForClickable({ timeout: 3000 })
            await $('span[id="task-filter-clear"]').click()
            await delay(5000)
        })
    })
    describe('Status of Task Filter', () => {
        it('To do', async () => {
            await goToPage('tasks')
            await $('div[data-name="task-filter"]').click()
            await $('div[data-name="task-filter-select-status"]').click() // Status of Task filter
            await $('div[id="task-status-filter-select-0"]').click()
            await $('button[data-action="task-status-filter-apply-btn"]').click()
            await expect($('app-task-filter-options div.f-3 > span:first-of-type')).not.toBeDisplayed()
            await expect($('app-task-filter-options div.f-3 > span:last-of-type span')).not.toBeDisplayed()
            await delay(2000)
        })
        it('All', async () => {
            await goToPage('tasks')
            await $('div[data-name="task-filter"]').click()
            await $('div[data-name="task-filter-select-status"]').click() // Status of Task filter
            await $('div[id="task-status-filter-select-1"]').click()
            await $('button[data-action="task-status-filter-apply-btn"]').click()
            await delay(2000)
            await expect($('app-task-filter-options div.f-3 > span:first-of-type')).toHaveText('Status of task')
            await expect($('app-task-filter-options div.f-3 > span:last-of-type span')).toHaveText('ALL')
            await delay(2000)
        })
        it('Completed', async () => {
            await goToPage('tasks')
            await $('div[data-name="task-filter"]').click()
            await $('div[data-name="task-filter-select-status"]').click() // Status of Task filter
            await $('div[id="task-status-filter-select-2"]').click()
            await $('button[data-action="task-status-filter-apply-btn"]').click()
            await expect($('app-task-filter-options div.f-3 > span:first-of-type')).toHaveText('Status of task')
            await expect($('app-task-filter-options div.f-3 > span:last-of-type span')).toHaveText('COMPLETED')
            await $('span[id="task-filter-clear"]').waitForClickable({ timeout: 3000 })
            await $('span[id="task-filter-clear"]').click()
            await delay(5000)
        })
    })
    describe('Other Filters', () => {
        it('Using Date and Time', async () => {
            await goToPage('tasks')
            await $('div[data-name="task-filter"]').click()
            await $('div[data-name="task-filter-select-datetime"]').click() // DateTime filter
            await $('mat-checkbox[id="task-filter-starttime-check"]').click()
            await $('mat-checkbox[id="task-filter-endtime-check"]').click()
            await $('button[data-action="task-filter-datetime-apply"]').click()
            await expect($('app-task-filter-options div.f-3 > span:first-of-type')).toHaveText('Datetime')
            await $('span[id="task-filter-clear"]').waitForClickable({ timeout: 3000 })
            await $('span[id="task-filter-clear"]').click()
            await delay(5000)
        })
        it('Global Search', async () => {
            await goToPage('tasks')
            await $('div[data-name="task-filter"]').click()
            await $('div[data-name="task-filter-select-search"]').click() // Global Search filter
            await $('input[data-name="task-global-filter"]').setValue('new')
            await $('button[data-action="task-global-filter-apply"]').click()
            await expect($('app-task-filter-options div.f-3 > span:first-of-type')).toHaveText('Global search')
            await $('span[id="task-filter-clear"]').waitForClickable({ timeout: 3000 })
            await $('span[id="task-filter-clear"]').click()
            await delay(5000)
        })
        it('Contact Status', async () => {
            await goToPage('tasks')
            await $('div[data-name="task-filter"]').click()
            await $('div[data-name="task-filter-select-contact_status"]').click() // Status of Contact
            await $('label[data-name="task-contact-filter-label-Hot"] span').click()
            await $('button[data-action="task-filter-contact-status-label-apply"]').click()
            await expect($('app-task-filter-options div.f-3 > span:first-of-type')).toHaveText('Label')
            await expect($('app-task-filter-options div.f-3 > span:last-of-type span')).toHaveText('Hot')
            await $('span[id="task-filter-clear"]').waitForClickable({ timeout: 3000 })
            await $('span[id="task-filter-clear"]').click()
            await delay(5000)
        })
        it('Task Description Contact', async () => {
            await goToPage('tasks')
            await $('div[data-name="task-filter"]').click()
            await $('div[data-name="task-filter-select-task_description_contact"]').click() // Task Description Contact
            await $('app-select-contact[data-name="contact-select"]').waitForClickable({ timeout: 3000 })
            await $('app-select-contact[data-name="contact-select"]').click()
            await delay(3000)
            await $('div.mat-select-search-inner input.mat-select-search-input').setValue('j')
            await $('div=' + testContactName).waitForClickable({ timeout: 9000 })
            await $('div=' + testContactName).click()
            await $('button[data-action="task-description-contact-filter-apply"]').click()
            await expect($('app-task-filter-options div.f-3 > span:first-of-type')).toHaveText('Contact')
            await expect($('app-task-filter-options div.f-3 > span:last-of-type span')).toHaveText(testContactName)
            await $('span[id="task-filter-clear"]').waitForClickable({ timeout: 3000 })
            await $('span[id="task-filter-clear"]').click()
            await delay(5000)
        })
        it('Country', async () => {
            await goToPage('tasks')
            await $('div[data-name="task-filter"]').click()
            await $('div[data-name="task-filter-select-country"]').click() // Country
            await $('app-advanced-filter-country app-input-country').click()
            await $('div=United States').click()
            await $('button[data-action="country-select-apply"]').click()
            await expect($('app-task-filter-options div.f-3 > span:first-of-type')).toHaveText('Country')
            await expect($('app-task-filter-options div.f-3 > span:last-of-type span')).toHaveText('US')
            await $('span[id="task-filter-clear"]').waitForClickable({ timeout: 3000 })
            await $('span[id="task-filter-clear"]').click()
            await delay(5000)
        })
        it('State', async () => {
            await goToPage('tasks')
            await $('div[data-name="task-filter"]').click()
            await $('div[data-name="task-filter-select-state"]').click() // State
            await $('app-advanced-filter-state app-input-state').click()
            await $('mat-option:first-of-type div.info').click()
            await $('button[data-action="state-select-apply"]').click()
            await expect($('app-task-filter-options div.f-3 > span:first-of-type')).toHaveText('State')
            await expect($('app-task-filter-options div.f-3 > span:last-of-type span')).toHaveText('Alabama')
            await $('span[id="task-filter-clear"]').waitForClickable({ timeout: 3000 })
            await $('span[id="task-filter-clear"]').click()
            await delay(5000)
        })
        it('Zipcode', async () => {
            await goToPage('tasks')
            await $('div[data-name="task-filter"]').click()
            await $('div[data-name="task-filter-select-zipcode"]').click() // Zipcode
            await $('input[data-name="input-zipcode"]').setValue(testZipcode)
            await $('button[data-action="zipcode-select-apply"]').click()
            await expect($('app-task-filter-options div.f-3 > span:first-of-type')).toHaveText('Zipcode')
            await expect($('app-task-filter-options div.f-3 > span:last-of-type span')).toHaveText(testZipcode)
            await $('span[id="task-filter-clear"]').waitForClickable({ timeout: 3000 })
            await $('span[id="task-filter-clear"]').click()
            await delay(5000)
        })
        it('Source', async () => {
            await goToPage('tasks')
            await $('div[data-name="task-filter"]').click()
            await $('div[data-name="task-filter-select-source"]').click() // Source
            await $('app-advanced-filter-source app-input-source[data-name="input-source"]').click()
            await $('div[data-name="no-source"]').click()
            await $('button[data-action="source-select-apply"]').click()
            await expect($('app-task-filter-options div.f-3 > span:first-of-type')).toHaveText('Source')
            await expect($('app-task-filter-options div.f-3 > span:last-of-type span')).toHaveText('No Source')
            await $('span[id="task-filter-clear"]').waitForClickable({ timeout: 3000 })
            await $('span[id="task-filter-clear"]').click()
            await delay(5000)
        })
        it('Company', async () => {
            await goToPage('tasks')
            await $('div[data-name="task-filter"]').click()
            await $('div[data-name="task-filter-select-company"]').click() // Company
            await $('app-advanced-filter-company app-input-company').click()
            await $('mat-option:first-of-type div.info').click()
            await $('button[data-action="company-select-apply"]').click()
            await expect($('app-task-filter-options div.f-3 > span:first-of-type')).toHaveText('Company')
            await $('span[id="task-filter-clear"]').waitForClickable({ timeout: 3000 })
            await $('span[id="task-filter-clear"]').click()
            await delay(5000)
        })
        it('Tag', async () => {
            await goToPage('tasks')
            await $('div[data-name="task-filter"]').click()
            await $('div[data-name="task-filter-select-tag"]').click() // Tag
            await $('app-advanced-filter-tag app-input-tag').click()
            await $('div[data-name="no-tag"]').click()
            await $('button[data-action="tag-select-apply"]').click()
            await expect($('app-task-filter-options div.f-3 > span:first-of-type')).toHaveText('Tag')
            await expect($('app-task-filter-options div.f-3 > span:last-of-type span')).toHaveText('')
            await delay(2000)
        })
    })
})
describe('Sort By', () => {
    it('Overdue', async () => {
        await goToPage('tasks')
        await $('span[id="task-sort-by"]').waitForClickable({ timeout: 5000 })
        await $('span[id="task-sort-by"]').click()
        await $('span[data-name="task-sort-deadline-Overdue"]').click()
        await delay(3000)
        await expect($('div.table-control-header > div:first-of-type span.pr-2 span')).toHaveText('Overdue tasks')
        await $('span[id="task-filter-clear"]').click()
        await delay(3000)
    })
    it('Today', async () => {
        await goToPage('tasks')
        await $('span[id="task-sort-by"]').waitForClickable({ timeout: 5000 })
        await $('span[id="task-sort-by"]').click()
        await $('span[data-name="task-sort-deadline-Today"]').click()
        await delay(3000)
        await expect($('div.table-control-header > div:first-of-type span.pr-2 span')).toHaveText('Today tasks')
        await $('span[id="task-filter-clear"]').click()
        await delay(3000)
    })
    it('Tomorrow', async () => {
        await goToPage('tasks')
        await $('span[id="task-sort-by"]').waitForClickable({ timeout: 5000 })
        await $('span[id="task-sort-by"]').click()
        await $('span[data-name="task-sort-deadline-Tomorrow"]').click()
        await delay(3000)
        await expect($('div.table-control-header > div:first-of-type span.pr-2 span')).toHaveText('Tomorrow tasks')
        await $('span[id="task-filter-clear"]').click()
        await delay(3000)
    })
    it('This week', async () => {
        await goToPage('tasks')
        await $('span[id="task-sort-by"]').waitForClickable({ timeout: 5000 })
        await $('span[id="task-sort-by"]').click()
        await $('span[data-name="task-sort-deadline-This week"]').click()
        await delay(3000)
        await expect($('div.table-control-header > div:first-of-type span.pr-2 span')).toHaveText('This week tasks')
        await $('span[id="task-filter-clear"]').click()
        await delay(3000)
    })
    it('Next week', async () => {
        await goToPage('tasks')
        await $('span[id="task-sort-by"]').waitForClickable({ timeout: 5000 })
        await $('span[id="task-sort-by"]').click()
        await $('span[data-name="task-sort-deadline-Next week"]').click()
        await delay(3000)
        await expect($('div.table-control-header > div:first-of-type span.pr-2 span')).toHaveText('Next week tasks')
        await $('span[id="task-filter-clear"]').click()
        await delay(3000)
    })
    it('Future', async () => {
        await goToPage('tasks')
        await $('span[id="task-sort-by"]').waitForClickable({ timeout: 5000 })
        await $('span[id="task-sort-by"]').click()
        await $('span[data-name="task-sort-deadline-Future"]').click()
        await delay(3000)
        await expect($('div.table-control-header > div:first-of-type span.pr-2 span')).toHaveText('Future tasks')
        await $('span[id="task-filter-clear"]').click()
        await delay(3000)
    })
    it('Custom', async () => {
        await goToPage('tasks')
        await $('span[id="task-sort-by"]').waitForClickable({ timeout: 5000 })
        await $('span[id="task-sort-by"]').click()
        await $('span[data-name="task-sort-deadline-Custom"]').click()
        await $('app-task-filter').waitForDisplayed({ timeout: 2000 })
        await $('mat-checkbox[name="check-start-date"]').click()
        await $('mat-checkbox[name="check-end-date"]').click()
        await delay(3000)
        await $('button[data-action="task-custom-filter-cancel"]').click()
        await $('app-task-filter').waitForDisplayed({ reverse: true })
        await expect($('app-task-filter-options div.chips div.f-3 > span')).toHaveText('Datetime')
        await $('span[id="task-filter-clear"]').click()
        await delay(3000)
    })
})
describe('Pagination', () => {
    describe('Tasks Pagination', () => {
        it('8', async () => {
            await goToPage('tasks')
            await delay(3000)
            const paginationExist = await $('span[id="task-show-count-page"]').isDisplayed()
            if(paginationExist) {
                await $('span[id="task-show-count-page"]').click()
                await $('span[id="page-count-select-0"]').click()
                await expect($('span[id="task-show-count-page"]')).toHaveText('Show 8 rows per page')
            }
        })
        it('50', async () => {
            await goToPage('tasks')
            await delay(3000)
            const paginationExist = await $('span[id="task-show-count-page"]').isDisplayed()
            if(paginationExist) {
                await $('span[id="task-show-count-page"]').click()
                await $('span[id="page-count-select-3"]').click()
                await expect($('span[id="task-show-count-page"]')).toHaveText('Show 50 rows per page')
            }
        })
    })
    describe('Dashboard Activity Pagination', () => {
        it('8', async () => {
            await goToPage('dashboard')
            await $('span[data-name="profile-tab-item-Activity"]').click()
            await delay(4000)
            const paginationExist = await $('span[id="activity-show-count-page"]').isDisplayed()
            if(paginationExist) {
                await $('span[id="activity-show-count-page"]').click()
                await $('span[id="activity-show-count-select-0"]').waitForClickable({ timeout: 3000 })
                await $('span[id="activity-show-count-select-0"]').click()
                await expect($('span[id="activity-show-count-page"]')).toHaveText('Show 8 rows per page')
            }
        })
        it('50', async () => {
            await goToPage('dashboard')
            await $('span[data-name="profile-tab-item-Activity"]').click()
            await delay(4000)
            const paginationExist = await $('span[id="activity-show-count-page"]').isDisplayed()
            if(paginationExist) {
                await $('span[id="activity-show-count-page"]').click()
                await $('span[id="activity-show-count-select-3"]').waitForClickable({ timeout: 3000 })
                await $('span[id="activity-show-count-select-3"]').click()
                await expect($('span[id="activity-show-count-page"]')).toHaveText('Show 50 rows per page')
            }
        })
    })
})
describe('Edit Task', () => {
    it('Task Type', async () => {
        await goToPage('tasks') // Tasks
        await $('app-tasks table tbody tr:first-of-type td.mat-column-select div.custom-checkbox').waitForClickable({ timeout: 6000 })
        await $('app-tasks table tbody tr:first-of-type td.mat-column-select div.custom-checkbox').click({ button: 0, x: -10, y: 0 })
        await $('div[data-name="material-action-item-Edit tasks"]').click()
        await $('app-task-edit').waitForDisplayed({ timeout: 2000 })
        await $('div[data-name="task-type-meeting"]').click()
        await delay(2000)
        await $('button[data-action="task-update-btn"]').click()
        await delay(3000)
        const recurringDialog = await $('app-task-recurring-dialog').isDisplayedInViewport()
        if(recurringDialog) {
            await $('app-task-recurring-dialog button[data-action="task-recurring-delete-confirm"]').click()
            await delay(1000)
        }
        await $('app-task-edit').waitForDisplayed({ reverse: true })
        await $('div[data-name="material-action-item-Deselect"]').waitForClickable({ timeout: 3000 })
        await $('div[data-name="material-action-item-Deselect"]').click()
        await delay(2000)
    })
    it('Task Description', async () => {
        await goToPage('tasks') // Tasks
        await $('app-tasks table tbody tr:first-of-type td.mat-column-select div.custom-checkbox').waitForClickable({ timeout: 6000 })
        await $('app-tasks table tbody tr:first-of-type td.mat-column-select div.custom-checkbox').click({ button: 0, x: -10, y: 0 })
        await $('div[data-name="material-action-item-Edit tasks"]').click()
        await $('app-task-edit').waitForDisplayed({ timeout: 2000 })
        await $('input[name="content"]').setValue('updated')
        await delay(2000)
        await $('button[data-action="task-update-btn"]').click()
        await delay(3000)
        const recurringDialog = await $('app-task-recurring-dialog').isDisplayedInViewport()
        if(recurringDialog) {
            await $('app-task-recurring-dialog button[data-action="task-recurring-delete-confirm"]').click()
            await delay(2000)
        }
        await $('app-task-edit').waitForDisplayed({ reverse: true })
        await $('div[data-name="material-action-item-Deselect"]').waitForClickable({ timeout: 3000 })
        await $('div[data-name="material-action-item-Deselect"]').click()
        await expect($('table tbody tr:first-of-type td.mat-column-subject span.c-dark')).toHaveText('updated')
        await delay(2000)
    })
    it('Task DateTime', async () => {
        await goToPage('tasks') // Tasks
        await $('app-tasks table tbody tr:first-of-type td.mat-column-select div.custom-checkbox').waitForClickable({ timeout: 6000 })
        await $('app-tasks table tbody tr:first-of-type td.mat-column-select div.custom-checkbox').click({ button: 0, x: -10, y: 0 })
        await $('div[data-name="material-action-item-Edit tasks"]').click()
        await $('app-task-edit').waitForDisplayed({ timeout: 5000 })
        await $('app-task-edit app-business-date-time-picker i.i-edit').click()
        await $('mat-select[data-name="task-time-select"]').click()
        await $('div.cdk-overlay-container').$('div.cdk-overlay-connected-position-bounding-box').$('span=2:00 PM').click()
        await delay(2000)
        await $('button[data-action="task-update-btn"]').click()
        await delay(3000)
        const recurringDialog = await $('app-task-recurring-dialog').isDisplayedInViewport()
        if(recurringDialog) {
            await $('app-task-recurring-dialog button[data-action="task-recurring-delete-confirm"]').click()
        }
        await $('app-task-edit').waitForDisplayed({ reverse: true })
        await $('div[data-name="material-action-item-Deselect"]').waitForClickable({ timeout: 3000 })
        await $('div[data-name="material-action-item-Deselect"]').click()
        await expect($('table tbody tr:first-of-type td.mat-column-deadline span.c-dark')).toHaveTextContaining('2:00 PM')
        await delay(2000)
    })
    it('Task Timezone', async () => {
        await goToPage('tasks') // Tasks
        await $('app-tasks table tbody tr:first-of-type td.mat-column-select div.custom-checkbox').waitForClickable({ timeout: 6000 })
        await $('app-tasks table tbody tr:first-of-type td.mat-column-select div.custom-checkbox').click({ button: 0, x: -10, y: 0 })
        await $('div[data-name="material-action-item-Edit tasks"]').click()
        await $('app-task-edit').waitForDisplayed({ timeout: 2000 })
        await $('app-task-edit app-business-date-time-picker i.i-edit').click()
        await $('app-select-timezone').click()
        await $('span[data-name="task-timezone-select-Eastern Time"]').click()
        await expect($('app-select-timezone').$('span=Eastern Time')).toBeDisplayed()
        await delay(2000)
        const anyChange = await $('button[data-action="task-update-btn"]').isClickable()
        if(anyChange) {
            await $('button[data-action="task-update-btn"]').click()
            await delay(3000)
            const recurringDialog = await $('app-task-recurring-dialog').isDisplayedInViewport()
            if(recurringDialog) {
                await $('app-task-recurring-dialog button[data-action="task-recurring-delete-confirm"]').click()
                await delay(1000)
            }
        }
        const noChange = await $('button[data-action="task-update-cancel-btn"]').isClickable()
        if(noChange) await $('button[data-action="task-update-cancel-btn"]').click() // Cancel
        await $('app-task-edit').waitForDisplayed({ reverse: true })
        await $('div[data-name="material-action-item-Deselect"]').waitForClickable({ timeout: 3000 })
        await $('div[data-name="material-action-item-Deselect"]').click()
        await delay(2000)
    })
    it('Task All Day', async () => {
        await goToPage('tasks') // Tasks
        await $('app-tasks table tbody tr:first-of-type td.mat-column-select div.custom-checkbox').waitForClickable({ timeout: 6000 })
        await $('app-tasks table tbody tr:first-of-type td.mat-column-select div.custom-checkbox').click({ button: 0, x: -10, y: 0 })
        await $('div[data-name="material-action-item-Edit tasks"]').click()
        await $('app-task-edit').waitForDisplayed({ timeout: 2000 })
        const allDayTask = await $('app-task-edit mat-dialog-content > div:nth-of-type(4) input[type="checkbox"]').isSelected()
        if(!allDayTask) await $('app-task-edit mat-dialog-content > div:nth-of-type(4) label[for="all_day_tc"]').click()
        await expect($('app-task-edit mat-dialog-content > div:nth-of-type(4) input[type="checkbox"]')).toBeSelected()
        await delay(2000)
        const anyChange = await $('button[data-action="task-update-btn"]').isClickable()
        if(anyChange) {
            await $('button[data-action="task-update-btn"]').click()
            await delay(3000)
            const recurringDialog = await $('app-task-recurring-dialog').isDisplayedInViewport()
            if(recurringDialog) {
                await $('app-task-recurring-dialog button[data-action="task-recurring-delete-confirm"]').click()
                await delay(1000)
            }
        }
        const noChange = await $('button[data-action="task-update-cancel-btn"]').isDisplayed()
        if(noChange) await $('button[data-action="task-update-cancel-btn"]').click() // Cancel
        await $('app-task-edit').waitForDisplayed({ reverse: true })
        await $('div[data-name="material-action-item-Deselect"]').waitForClickable({ timeout: 3000 })
        await $('div[data-name="material-action-item-Deselect"]').click()
        await delay(2000)
    })
})
describe('Edit Columns', () => {
    describe('Tasks', () => {
        it('Check Column', async () => {
            await goToPage('tasks')
            await $('div[id="editColumn"]').click()
            await $('app-column-edit').waitForDisplayed({ timeout: 2000 })
            await $('div[data-name="column-item-Company"] label').scrollIntoView()
            await $('div[data-name="column-item-Company"] label').click()
            await $('button[data-action="edit-column-apply"]').click()
            await $('app-column-edit').waitForDisplayed({ reverse: true })
            await delay(5000)
            await expect($('th=Company')).toBeDisplayed()
            await delay(2000)
        })
        it.skip('Reorganize', async () => {
            await goToPage('tasks')
            await $('div[id="editColumn"]').click()
            await $('app-column-edit').waitForDisplayed({ timeout: 2000 })
            const target = await $('div[data-name="task-column-item-Label"]')
            await $('div[data-name="task-column-item-Company"]').dragAndDrop(target)
            await $('button[data-action="edit-column-apply"]').click()
            await $('app-column-edit').waitForDisplayed({ reverse: true })
            await delay(2000)
            await expect($('table thead tr.table-header th:nth-of-type(4)')).toHaveAttribute('class', 'mat-column-company')
            await delay(2000)
        })
        it('Remove Column', async () => {
            await goToPage('tasks')
            await $('div[id="editColumn"]').click()
            await $('app-column-edit').waitForDisplayed({ timeout: 5000 })
            const companyColumnExist = await $('div[data-name="task-column-item-company"]').isExisting()
            if(companyColumnExist) {
                await $('div[data-name="task-column-item-company"]').scrollIntoView()
                await $('div[data-name="task-column-item-company"] i.i-close').click()
            }
            await $('button[data-action="edit-column-apply"]').click()
            await $('app-column-edit').waitForDisplayed({ reverse: true })
            await delay(2000)
            await expect($('table thead tr.table-header th.mat-column-company')).not.toExist()
            await delay(2000)
        })
    })
    describe('Dashboard Activity', () => {
        it('Check Column', async () => {
            await goToPage('dashboard')
            await $('span[data-name="profile-tab-item-Activity"]').click()
            await delay(3000)
            await $('div[id="editColumn"]').click()
            await $('app-column-edit').waitForDisplayed({ timeout: 2000 })
            await $('label[for="column-city"]').scrollIntoView()
            await $('label[for="column-city"]').click()
            await $('button[data-action="edit-column-apply"]').click()
            await $('app-column-edit').waitForDisplayed({ reverse: true })
            await expect($('table thead tr:nth-of-type(2) th.mat-column-city')).toHaveText('City')
            await delay(2000)
        })
        it.skip('Reorganize', async () => {
            await goToPage('dashboard') 
            await $('span[data-name="profile-tab-item-Activity"]').click()
            await delay(5000)
            await $('div[id="editColumn"]').click()
            await $('app-column-edit').waitForDisplayed({ timeout: 2000 })
            const target = await $('div[data-name="task-column-item-Label"]')
            await $('div[data-name="task-column-item-city"]').dragAndDrop(target)
            await $('button[data-action="edit-column-apply"]').click()
            await $('app-column-edit').waitForDisplayed({ reverse: true })
            await expect($('table thead tr:nth-of-type(2) th:nth-of-type(2)')).toHaveAttribute('class', 'mat-column-city')
            await delay(2000)
        })
        it('Remove Column', async () => {
            await goToPage('dashboard') 
            await $('span[data-name="profile-tab-item-Activity"]').click()
            await delay(5000)
            await $('div[id="editColumn"]').click()
            await $('app-column-edit').waitForDisplayed({ timeout: 2000 })
            await $('div[data-name="task-column-item-city"]').scrollIntoView()
            await $('div[data-name="task-column-item-city"] i.i-close').click()
            await $('button[data-action="edit-column-apply"]').click()
            await $('app-column-edit').waitForDisplayed({ reverse: true })
            await expect($('table thead tr:nth-of-type(2) th.mat-column-city')).not.toBeDisplayed()
            await delay(2000)
        })
    })
})
describe('Other', () => {
    it('Select All', async () => {
        await goToPage('tasks')
        const tasksTable = await $('app-tasks table tbody tr:first-of-type')
        await browser.execute(ele => {
            ele.querySelector('input[type="checkbox"]').click();
        }, tasksTable)
        await $('div[data-name="material-action-item-Select all"]').click()
        await $('table tbody tr:last-of-type td.mat-column-select').scrollIntoView()
        await expect($('table tbody tr:last-of-type td.mat-column-select div.custom-checkbox input[type="checkbox"]')).toBeChecked()
        await $('table thead tr:nth-of-type(2) div.custom-checkbox').click()
    })
    it('Deselect', async () => {
        await $('div[data-name="material-action-item-Deselect"]').scrollIntoView()
        await $('div[data-name="material-action-item-Deselect"]').click()
        await expect($('table thead tr:nth-of-type(2) th.mat-column-select div.custom-checkbox input[type="checkbox"]')).not.toBeChecked()
    })
    it('Complete', async () => {
        await goToPage('tasks')
        const firstTask = await $('app-tasks table tbody tr:first-of-type')
        await browser.execute(ele => {
            ele.querySelector('input[type="checkbox"]').click();
        }, firstTask)
        await $('div[data-name="material-action-item-Complete tasks"]').click() // Complete Tasks
        await $('button[data-action="confirm-downgrade"]').click()
        await delay(6000)
        await expect($('table tbody tr:first-of-type td.mat-column-select div.custom-checkbox input[type="checkbox"]')).not.toBeChecked()
    })
})
describe('Delete Tasks', () => {
    it('Delete', async () => {
        await goToPage('contacts')
        await $('span=' + testContactName).click()
        await delay(3000)
        await $('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type div.accordion-header i.i-task').click()
        const dataShow = await $('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type app-data-list').isDisplayed()
        if(!dataShow) {
            await $('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type div.accordion-header i.i-arrow-down').click()
        }
        await delay(7000)
        await browser.waitUntil(async () => {
            await $('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type app-data-list div.contact-data-task:first-of-type i.i-menu-more').click()
            await $('span=Delete').click()
            await delay(2000)
            const normal = await $('app-confirm').isDisplayedInViewport()
            if(normal) {
                await $('button[data-action="confirm-downgrade"]').click()
            } else {
                await $('span=All tasks').click()
                await $('button=OK').click()
            }
            await delay(6000)
            const stillRemaining = await $('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type app-data-list div.contact-data-task:first-of-type div.task-checkbox').isExisting()
            return !stillRemaining
        }, {
            timeout: 200000,
            timeoutMsg: 'expect to remove all tasks'
        })
        await delay(2000)
        await goToPage('tasks')
        await delay(5000)
        const anyTaskExist = await $('table tbody tr:first-of-type td.mat-column-contact_name span').isDisplayed()
        if(anyTaskExist) {
            await expect($('table tbody tr:first-of-type td.mat-column-contact_name span')).not.toHaveText(testContactName)
        }
    })
})
describe.skip('Dashboard Analytics', () => {
    describe('Missing', () => {
        it('Missing Email', async () => {
            await goToPage('contacts') // Contacts
            await $('button[data-action="create_new_contact"]').click()
            await $('input[data-name="contact-create-firstname"]').setValue(testContactFirstName)
            await $('input[data-name="contact-create-lastname"]').setValue(testContactLastName)
            await $('input[data-name="add-user-phone"]').setValue(testContactPhoneNumber)
            await $('button[data-action="create-contact-add-btn"]').click()
            await delay(5000)
            await goToPage('dashboard')
            await expect($('div[data-name="analytics-count-health-missing_email"]')).toHaveText("1")
            await goToPage('contacts') // Contacts
            await expect($('tr:last-of-type td:nth-of-type(2) > div span')).toHaveText(testContactFullName)
            await $('tr:last-of-type td:nth-of-type(2) > div').click()
            await $('div[data-name="contact-dropdown-toggle"]').waitForClickable({ timeout: 10000 })
            await $('div[data-name="contact-dropdown-toggle"]').click()
            await $('button[data-action="contact-delete"]').click()
            await $('button[data-action="confirm-downgrade"]').click() // Delete Confirm
            await goToPage('contacts') // Contacts
            // await expect($('tr:last-of-type td:nth-of-type(2) > div span')).toHaveText('Joe James')
        })
        it('Missing Phone number', async () => {
            await goToPage('contacts') // Contacts
            await $('button[data-action="create_new_contact"]').click()
            await $('input[data-name="contact-create-firstname"]').setValue(testContactFirstName)
            await $('input[data-name="contact-create-lastname"]').setValue(testContactLastName)
            await $('input[data-name="contact-create-email"]').setValue(testContactEmail)
            await $('button[data-action="create-contact-add-btn"]').click()
            await goToPage('dashboard')
            await expect($('div[data-name="analytics-count-health-missing_phone"]')).toHaveText("1")
            await goToPage('contacts') // Contacts
            await expect($('tr:last-of-type td:nth-of-type(2) > div span')).toHaveText(testContactFullName)
            await $('tr:last-of-type td:nth-of-type(2) > div').click()
            await $('div[data-name="contact-dropdown-toggle"]').waitForClickable({ timeout: 10000 })
            await $('div[data-name="contact-dropdown-toggle"]').click()
            await $('button[data-action="contact-delete"]').click()
            await $('button[data-action="confirm-downgrade"]').click() // Delete Confirm
            await goToPage('contacts') // Contacts
            // await expect($('tr:last-of-type td:nth-of-type(2) > div span')).toHaveText('Joe James')
        })
        it('Missing Email and Phone number', async () => {
            await goToPage('contacts') // Contacts
            await $('button[data-action="create_new_contact"]').click()
            await $('input[data-name="contact-create-firstname"]').setValue(testContactFirstName)
            await $('input[data-name="contact-create-lastname"]').setValue(testContactLastName)
            await $('button[data-action="create-contact-add-btn"]').click()
            await delay(5000)
            await goToPage('dashboard')
            await expect($('div[data-name="analytics-count-health-missing_email_phone"]')).toHaveText("1")
            await goToPage('contacts') // Contacts
            await expect($('tr:last-of-type td:nth-of-type(2) > div span')).toHaveText(testContactFullName)
            await $('tr:last-of-type td:nth-of-type(2) > div').click()
            await $('div[data-name="contact-dropdown-toggle"]').waitForClickable({ timeout: 10000 })
            await $('div[data-name="contact-dropdown-toggle"]').click()
            await $('button[data-action="contact-delete"]').click()
            await $('button[data-action="confirm-downgrade"]').click() // Delete Confirm
            await goToPage('contacts') // Contacts
            // await expect($('tr:last-of-type td:nth-of-type(2) > div span')).toHaveText('Joe James')
        })
    })
    describe('Automation', () => {
        it('Number of Contact that is on', async () => {
            await goToPage('dashboard')
            await $('span[id="tab-label-0"]').click()
            let oldOnCount = await $('div[id="analytics-count-automation-1"]').getValue()
        })
    })
    describe('Rating Chart', () => {
        it('No Star', async () => {
            await goToPage('contacts') // Contacts
            await $('button[data-action="create_new_contact"]').click()
            await $('input[data-name="contact-create-firstname"]').setValue(testContactFirstName)
            await $('input[data-name="contact-create-lastname"]').setValue(testContactLastName)
            await $('button[data-action="create-contact-add-btn"]').click()
            await delay(5000)
            await goToPage('dashboard')
            await expect($('div[id="Rating-Status-Info-5"]')).toHaveText('50%') // Not Rated
            // Delete Long Hao Contact
            await goToPage('contacts') // Contacts
            await expect($('tr:last-of-type td:nth-of-type(2) > div span')).toHaveText(testContactFullName)
            await $('tr:last-of-type td:nth-of-type(2) > div').click()
            await $('div[data-name="contact-dropdown-toggle"]').waitForClickable({ timeout: 10000 })
            await $('div[data-name="contact-dropdown-toggle"]').click()
            await $('button[data-action="contact-delete"]').click()
            await $('button[data-action="confirm-downgrade"]').click() // Delete Confirm
            await $('table[id="contact-table"]').waitForDisplayed({ timeout: 6000 })
            await goToPage('dashboard')
            await expect($('div[id="Rating-Status-Info-5"]')).toHaveText('0%') // Not Rated
        })
        it('One Star', async () => {
            await goToPage('contacts') // Contacts
            await $('button[data-action="create_new_contact"]').click()
            await $('input[data-name="contact-create-firstname"]').setValue(testContactFirstName)
            await $('input[data-name="contact-create-lastname"]').setValue(testContactLastName)
            await $('input[data-name="contact-create-email"]').setValue(testContactEmail)
            await $('button[data-action="create-contact-add-btn"]').click()
            await delay(5000)
            await goToPage('dashboard')
            await expect($('div[id="Rating-Status-Info-0"]')).toHaveText('50%') // One Star
            // Delete Long Hao Contact
            await goToPage('contacts') // Contacts
            await expect($('tr:last-of-type td:nth-of-type(2) > div span')).toHaveText(testContactFullName)
            await $('tr:last-of-type td:nth-of-type(2) > div').click()
            await $('div[data-name="contact-dropdown-toggle"]').waitForClickable({ timeout: 10000 })
            await $('div[data-name="contact-dropdown-toggle"]').click()
            await $('button[data-action="contact-delete"]').click()
            await $('button[data-action="confirm-downgrade"]').click() // Delete Confirm
            await $('table[id="contact-table"]').waitForDisplayed({ timeout: 6000 })
            await goToPage('dashboard')
            await expect($('div[id="Rating-Status-Info-0"]')).toHaveText('0%') // Not Rated
        })
        it('Two Star', async () => {
            await goToPage('contacts') // Contacts
            await $('button[data-action="create_new_contact"]').click()
            await $('input[data-name="contact-create-firstname"]').setValue(testContactFirstName)
            await $('input[data-name="contact-create-lastname"]').setValue(testContactLastName)
            await $('input[data-name="contact-create-email"]').setValue(testContactEmail)
            await $('input[data-name="add-user-phone"]').setValue(testContactPhoneNumber)
            await $('button[data-action="create-contact-add-btn"]').click()
            await delay(5000)
            await goToPage('dashboard')
            await expect($('div[id="Rating-Status-Info-1"]')).toHaveText('50%') // Two Star
            // Delete Long Hao Contact
            await goToPage('contacts') // Contacts
            await expect($('tr:last-of-type td:nth-of-type(2) > div span')).toHaveText(testContactFullName)
            await $('tr:last-of-type td:nth-of-type(2) > div').click()
            await $('div[data-name="contact-dropdown-toggle"]').waitForClickable({ timeout: 10000 })
            await $('div[data-name="contact-dropdown-toggle"]').click()
            await $('button[data-action="contact-delete"]').click()
            await $('button[data-action="confirm-downgrade"]').click() // Delete Confirm
            await $('table[id="contact-table"]').waitForDisplayed({ timeout: 6000 })
            await goToPage('dashboard')
            // await expect($('div[id="Rating-Status-Info-1"]')).toHaveText('0%') // Two Star
        })
    })
})

