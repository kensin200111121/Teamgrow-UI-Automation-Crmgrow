
const { expect, browser, $ } = require('@wdio/globals');

let email = require('../test-data/testdata').user.email;

let accountName;
let eventCount;
let removeFlag;

const googleCalendarEmail = require('../test-data/testdata').user.googleCalendarEmail;
const delay = (ms) => {
    return new Promise(res => {
       setTimeout(() => {
        res()
       }, ms) 
    })
}

const mainLink = require('../test-data/testLink').Link.LEAD_HUB_LINK;
const schedulerLink = require('../test-data/testLink').Link.SCHEDULER_BOOKING_LINK;
const meetingLink = require('../test-data/testLink').Link.MEETING_LINK;
const { goToPage, goToSubmenu } = require('./sidebar');
const isVortex = require('../test-data/testdata').isVortex

const testScheduler = {
    eventName: [
        'simple event 1',
        'simple event 2',
        'simple event 3',
        'in person metting one',
        'in person metting group',
        'phone call inbound one',
        'phone call inbound group',
        'phone call outbound one',
        'phone call outbound group',
        'online meeting one',
        'online meeting group',
        'google meeting one',
        'google meeting group'
    ],
    eventCount: 13,
    bookingLink: [
        'simple-event-1',
        'simple-event-2',
        'simple-event-3',
        'in-person-metting-one',
        'in-person-metting-group',
        'phone-call-inbound-one',
        'phone-call-inbound-group',
        'phone-call-outbound-one',
        'phone-call-outbound-group',
        'online-meeting-one',
        'online-meeting-group',
        'google-meeting-one',
        'google-meeting-group'
    ]
}
const testLeadCaptureName = 'Feedback'
const eventDescription = "Who is the best football player in real world ?"

const accessPartialUrl = async partialUrl => {
    const tabs = await browser.getWindowHandles();
    let currentUrl;
    for(let tab of tabs) {
        await browser.switchToWindow(tab);
        currentUrl = await browser.getUrl();
        if(currentUrl.includes(partialUrl)) {
            break;
        }
    }
    await browser.switchWindow(currentUrl);
} 

describe('Test Data Setup', () => {
    describe('Lead Hub', () => {
        it('Scheduler', async () => {
            await goToSubmenu('scheduler')
            eventCount = 0;
            accountName = email.split('@')[0]
        })
        it('Update Link name', async () => {
            await goToSubmenu('scheduler')
            await $('span=My Link').click()
            await delay(3000)
            await $('input[name="my_link"]').setValue(accountName)
            await delay(3000)
            const anyUpdates = await $('span=Save').isDisplayed()
            if(anyUpdates) {
                await $('span=Save').click()
                await delay(5000)
            }
        })
    })
    describe('Preparation', async () => {
        it('Remove All Test Events', async () => {
            removeFlag = false;
            await browser.waitUntil(async () => {
                await goToSubmenu('scheduler')
                await $('span[data-name="profile-tab-item-Event Types"]').waitForClickable({ timeout: 3000 })
                await $('span[data-name="profile-tab-item-Event Types"]').click()
                await delay(3000)
                const eventExist = await $('app-schedule-types div.event_types div.event-type:last-of-type div.title').isDisplayed()
                if(!eventExist) return true
                const title = await $('app-schedule-types div.event_types div.event-type:last-of-type div.title').getText()
                for(let i = 0; i < testScheduler.eventCount; i++) {
                    if(title === testScheduler.eventName[i]) {
                        removeFlag = true;
                        // Remove
                        await $('app-schedule-types div.event_types div.event-type:last-of-type i.i-menu-more').click()
                        await $('span=Delete').waitForClickable({ timeout: 2000 })
                        await $('span=Delete').click()
                        await $('button[data-action="confirm-downgrade"]').waitForClickable({ timeout: 2000 })
                        await $('button[data-action="confirm-downgrade"]').click()
                        await delay(2000)
                        // Break
                        await goToPage('bulkEmail')
                        break;
                    }
                }
                if(!removeFlag) return true
            }, {
                timeout: 200000,
                timeoutMsg: 'expect to remove all event types'
            })
        })
        it('Remove Lead Capture Form', async () => {
            await goToSubmenu('leadCaptureForm')
            const sportExist = await $('span=sport').isDisplayed()
            if(sportExist) {
                const sportElement = await $('span=sport')
                const sportForm = await browser.custom$('closest_form', sportElement)
                await sportForm.$('i.i-menu-more').waitForClickable({ timeout: 3000 })
                await sportForm.$('i.i-menu-more').click()
                await sportForm.$('div.material-actions div.dropdown-menu button[data-action="lead-capture-delete"]').click()
                await $('app-confirm').waitForDisplayed({ timeout: 2000 })
                await $('app-confirm button[data-action="confirm-downgrade"]').click()
                await $('app-confirm').waitForDisplayed({ reverse: true })
                await delay(3000)
                await expect($('span=sport')).not.toExist()
            }
            const feedbackExist = await $('span=' + testLeadCaptureName).isDisplayed()
            if(feedbackExist) {
                const feedbackElement = await $('span=' + testLeadCaptureName)
                const feedbackForm = await browser.custom$('closest_form', feedbackElement)
                await feedbackForm.$('i.i-menu-more').waitForClickable({ timeout: 3000 })
                await feedbackForm.$('i.i-menu-more').click()
                await feedbackForm.$('div.material-actions div.dropdown-menu button[data-action="lead-capture-delete"]').click()
                await $('app-confirm').waitForDisplayed({ timeout: 2000 })
                await $('app-confirm button[data-action="confirm-downgrade"]').click()
                await $('app-confirm').waitForDisplayed({ reverse: true })
                await delay(3000)
                await expect($('span=' + testLeadCaptureName)).not.toExist()
            }
        })
        if(!isVortex) it('Remove Test Smart Code', async () => {
            await goToSubmenu('smartCode')
            const angularExist = await $('span=angular').isDisplayed()
            if(angularExist) {
                const angularElement = await $('span=angular')
                const angularTr = await browser.custom$('closest', angularElement)
                await angularTr.$('td:last-of-type i.i-trash').click()
                await $('button[data-action="confirm-downgrade"]').click()
                await delay(3000)
                await expect($('span=angular')).not.toExist()
            }
        })
    })
})
describe('Create Event', () => {
    describe('Simple Event', () => {
        it('Create', async () => {
            await goToSubmenu('scheduler')
            await $('button[data-action="leadHub-new-event"]').waitForClickable({ timeout: 5000 })
            await $('button[data-action="leadHub-new-event"]').click()
            await delay(2000)
            await $('input[name="title"]').waitForDisplayed({ timeout: 5000 })
            await $('input[name="title"]').setValue(testScheduler.eventName[0])
            await $('input[name="address"]').setValue('Barcelona')
            await delay(2000)
            await browser.execute((text) => {
                document.querySelector('quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
            }, '<div>' + eventDescription + '</div>');
            await delay(2000)
            await $('button[data-action="leadHub-event-type-next"]').click()
            await $('input[name="days"]').setValue('30')
            await delay(2000)
            const customDuration = await $('app-schedule-type-create div.duration input[type="checkbox"]').isSelected()
            if(!customDuration) await $('app-schedule-type-create div.duration').$('span=Custom duration').click()
            await $('app-schedule-type-create div.duration input[type="number"]').setValue(30)
            await $('button[data-action="leadHub-event-type-next1"]').click()
            await $('button[data-action="leadHub-event-type-add-save"]').click()
            await $('div.event_types').waitForDisplayed({ timeout: 15000 })
            await expect($('div=' + testScheduler.eventName[0])).toBeDisplayed()
            eventCount++;
        })
        it('Automation', async () => {
            await goToSubmenu('scheduler')
            await $('button[data-action="leadHub-new-event"]').click()
            await delay(2000)
            await $('input[name="title"]').setValue(testScheduler.eventName[1])
            await $('input[name="address"]').setValue('Barcelona')
            await delay(2000)
            await browser.execute((text) => {
                document.querySelector('quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
            }, '<div>' + eventDescription + '</div>');
            await delay(2000)
            await $('button[data-action="leadHub-event-type-next"]').click()
            await $('input[name="days"]').setValue('30')
            await delay(2000)
            const customDuration = await $('app-schedule-type-create div.duration input[type="checkbox"]').isSelected()
            if(!customDuration) await $('app-schedule-type-create div.duration').$('span=Custom duration').click()
            await $('app-schedule-type-create div.duration input[type="number"]').setValue(30)
            await $('button[data-action="leadHub-event-type-next1"]').click()
            await $('app-input-tag mat-form-field').click()
            await $('div.mat-autocomplete-panel mat-option:first-of-type div.chip').click()
            const automationCheck = await $('mat-checkbox[name="automation-checkbox"]')
            await browser.execute(ele => {
                ele.querySelector('input[type="checkbox"]').click();
            }, automationCheck)
            await $('mat-select[name="remind-event"]').click()
            await $('div.mat-select-panel mat-option:first-of-type').click()
            await $('app-input-automation mat-form-field[data-name="contact-input-automation-select"]').click()
            await $('div.mat-select-panel').waitForDisplayed({ timeout: 5000 })
            await $('div.mat-select-panel mat-option[role="option"]:last-of-type div.automation-name').scrollIntoView()
            browser.pause(2000)
            await $('div.mat-select-panel mat-option[role="option"]:last-of-type div.automation-name').click()
            await $('button[data-action="leadHub-event-type-add-save"]').click()
            await $('div.event_types').waitForDisplayed({ timeout: 15000 })
            await expect($('div=' + testScheduler.eventName[1])).toBeDisplayed()
            eventCount++;
        })
        it('booking page', async () => {
            await goToSubmenu('scheduler')
            await $('button[data-action="leadHub-new-event"]').click()
            await delay(2000)
            await $('input[name="title"]').setValue(testScheduler.eventName[2])
            await $('input[name="address"]').setValue('Barcelona')
            await delay(2000)
            await browser.execute((text) => {
                document.querySelector('quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
            }, '<div>' + eventDescription + '</div>');
            await delay(2000)
            await $('button[data-action="leadHub-event-type-next"]').click()
            await $('input[name="days"]').setValue('40')
            await delay(2000)
            const customDuration = await $('app-schedule-type-create div.duration input[type="checkbox"]').isSelected()
            if(!customDuration) await $('app-schedule-type-create div.duration').$('span=Custom duration').click()
            await $('app-schedule-type-create div.duration input[type="number"]').setValue(30)
            await $('button[data-action="leadHub-event-type-next1"]').click()
            await $('app-input-tag mat-form-field').click()
            await $('div.mat-autocomplete-panel mat-option:first-of-type div.chip').click()
            const automationCheck = await $('mat-checkbox[name="automation-checkbox"]')
            await browser.execute(ele => {
                ele.querySelector('input[type="checkbox"]').click();
            }, automationCheck)
            await $('mat-select[name="remind-event"]').click()
            await $('div.mat-select-panel mat-option:first-of-type').click()
            await $('app-input-automation mat-form-field[data-name="contact-input-automation-select"]').click()
            await $('div[role="listbox"]').waitForDisplayed({ timeout: 5000 })
            await $('div[role="listbox"] mat-option:last-of-type div.automation-name').scrollIntoView()
            await browser.pause(2000)
            await $('div[role="listbox"] mat-option:last-of-type div.automation-name').click()
            await $('button[data-action="leadHub-event-type-add-save"]').click()
            await delay(5000)
            const eventElement = await $('div=' + testScheduler.eventName[2])
            await expect(eventElement).toBeDisplayed()
            const eventLink = await browser.custom$('closest_event', eventElement)
            await eventLink.$('div.link').click()
            await delay(5000)
            await accessPartialUrl(schedulerLink + accountName + '/' + testScheduler.bookingLink[2] + '/')
            await delay(5000)
            await expect($('div=' + eventDescription)).toBeDisplayed()
            await browser.switchWindow(mainLink)
            await delay(2000)
            eventCount++;
        })
    })
    describe('In-person Meeting', () => {
        it('One-on-one', async () => {
            await goToSubmenu('scheduler')
            await $('button[data-action="leadHub-new-event"]').click()
            await delay(2000)
            await $('span=One-on-One').click()
            await $('input[name="title"]').setValue(testScheduler.eventName[3])
            await $('mat-select[name="location"]').click()
            await $('mat-option[data-name="meeting-type-In-person meeting"] span.mat-option-text').click()
            await $('input[name="address"]').setValue('Barcelona')
            await delay(2000)
            await browser.execute((text) => {
                document.querySelector('quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
            }, '<div>' + eventDescription + '</div>');
            await delay(2000)
            await $('button[data-action="leadHub-event-type-next"]').click()
            await $('input[name="days"]').setValue('40')
            await delay(2000)
            const customDuration = await $('app-schedule-type-create div.duration input[type="checkbox"]').isSelected()
            if(!customDuration) await $('app-schedule-type-create div.duration').$('span=Custom duration').click()
            await $('app-schedule-type-create div.duration input[type="number"]').setValue(30)
            await $('button[data-action="leadHub-event-type-next1"]').click()
            await $('app-input-tag mat-form-field').click()
            await $('div.mat-autocomplete-panel mat-option:first-of-type div.chip').click()
            const automationCheck = await $('mat-checkbox[name="automation-checkbox"]')
            await browser.execute(ele => {
                ele.querySelector('input[type="checkbox"]').click();
            }, automationCheck)
            await $('mat-select[name="remind-event"]').click()
            await $('div.mat-select-panel mat-option:first-of-type').click()
            await $('app-input-automation mat-form-field[data-name="contact-input-automation-select"]').click()
            await $('div[role="listbox"]').waitForDisplayed({ timeout: 5000 })
            await $('div[role="listbox"] mat-option:last-of-type div.automation-name').scrollIntoView()
            await browser.pause(2000)
            await $('div[role="listbox"] mat-option:last-of-type div.automation-name').click()
            await $('button[data-action="leadHub-event-type-add-save"]').click()
            await delay(5000)
            const eventElement = await $('div=' + testScheduler.eventName[3])
            await expect(eventElement).toBeDisplayed()
            const eventLink = await browser.custom$('closest_event', eventElement)
            await eventLink.$('div.link').click()
            await delay(5000)
            await accessPartialUrl(schedulerLink + accountName + '/' + testScheduler.bookingLink[3] + '/')
            await delay(5000)
            await expect($('div=' + eventDescription)).toBeDisplayed()
            await browser.switchWindow(mainLink)
            await delay(2000)
            eventCount++;
        })
        it('Group', async () => {
            await goToSubmenu('scheduler')
            await $('button[data-action="leadHub-new-event"]').click()
            await delay(2000)
            await $('span=Group').click()
            await $('input[name="title"]').setValue(testScheduler.eventName[4])
            await $('mat-select[name="location"]').click()
            await $('mat-option[data-name="meeting-type-In-person meeting"] span.mat-option-text').click()
            await $('input[name="address"]').setValue('Barcelona')
            await delay(2000)
            await browser.execute((text) => {
                document.querySelector('quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
            }, '<div>' + eventDescription + '</div>');
            await delay(2000)
            await $('button[data-action="leadHub-event-type-next"]').click()
            await $('input[name="days"]').setValue('40')
            await delay(2000)
            const customDuration = await $('app-schedule-type-create div.duration input[type="checkbox"]').isSelected()
            if(!customDuration) await $('app-schedule-type-create div.duration').$('span=Custom duration').click()
            await $('app-schedule-type-create div.duration input[type="number"]').setValue(30)
            await $('button[data-action="leadHub-event-type-next1"]').click()
            await $('app-input-tag mat-form-field').click()
            await $('div.mat-autocomplete-panel mat-option:first-of-type div.chip').click()
            const automationCheck = await $('mat-checkbox[name="automation-checkbox"]')
            await browser.execute(ele => {
                ele.querySelector('input[type="checkbox"]').click();
            }, automationCheck)
            await $('mat-select[name="remind-event"]').click()
            await $('div.mat-select-panel mat-option:first-of-type').click()
            await $('app-input-automation mat-form-field[data-name="contact-input-automation-select"]').click()
            await $('div[role="listbox"]').waitForDisplayed({ timeout: 5000 })
            await $('div[role="listbox"] mat-option:last-of-type div.automation-name').scrollIntoView()
            await browser.pause(2000)
            await $('div[role="listbox"] mat-option:last-of-type div.automation-name').click()
            await $('button[data-action="leadHub-event-type-add-save"]').click()
            await delay(5000)
            const eventElement = await $('div=' + testScheduler.eventName[4])
            await expect(eventElement).toBeDisplayed()
            const eventLink = await browser.custom$('closest_event', eventElement)
            await eventLink.$('div.link').click()
            await delay(5000)
            await accessPartialUrl(schedulerLink + accountName + '/' + testScheduler.bookingLink[4] + '/')
            await delay(5000)
            await expect($('div=' + eventDescription)).toBeDisplayed()
            await browser.switchWindow(mainLink)
            await delay(2000)
            eventCount++;
        })
    })
    describe('Phone Call Inbound', () => {
        it('One-on-one', async () => {
            await goToSubmenu('scheduler')
            await $('button[data-action="leadHub-new-event"]').click()
            await delay(2000)
            await $('span=One-on-One').click()
            await $('input[name="title"]').setValue(testScheduler.eventName[5])
            await $('mat-select[name="location"]').click()
            await $('mat-option[data-name="meeting-type-Phone Call (inbound)"] span.mat-option-text').click()
            await $('input[data-name="add-user-phone"]').setValue('3014479728')
            await delay(2000)
            await browser.execute((text) => {
                document.querySelector('quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
            }, '<div>' + eventDescription + '</div>');
            await delay(2000)
            await $('button[data-action="leadHub-event-type-next"]').click()
            await $('input[name="days"]').setValue('40')
            await delay(2000)
            const customDuration = await $('app-schedule-type-create div.duration input[type="checkbox"]').isSelected()
            if(!customDuration) await $('app-schedule-type-create div.duration').$('span=Custom duration').click()
            await $('app-schedule-type-create div.duration input[type="number"]').setValue(30)
            await $('button[data-action="leadHub-event-type-next1"]').click()
            await $('app-input-tag mat-form-field').click()
            await $('div.mat-autocomplete-panel mat-option:first-of-type div.chip').click()
            const automationCheck = await $('mat-checkbox[name="automation-checkbox"]')
            await browser.execute(ele => {
                ele.querySelector('input[type="checkbox"]').click();
            }, automationCheck)
            await $('mat-select[name="remind-event"]').click()
            await $('div.mat-select-panel mat-option:first-of-type').click()
            await $('app-input-automation mat-form-field[data-name="contact-input-automation-select"]').click()
            await $('div[role="listbox"]').waitForDisplayed({ timeout: 5000 })
            await $('div[role="listbox"] mat-option:last-of-type div.automation-name').scrollIntoView()
            await browser.pause(2000)
            await $('div[role="listbox"] mat-option:last-of-type div.automation-name').click()
            await $('button[data-action="leadHub-event-type-add-save"]').click()
            await delay(5000)
            const eventElement = await $('div=' + testScheduler.eventName[5])
            await expect(eventElement).toBeDisplayed()
            const eventLink = await browser.custom$('closest_event', eventElement)
            await eventLink.$('div.link').click()
            await delay(5000)
            await accessPartialUrl(schedulerLink + accountName + '/' + testScheduler.bookingLink[5] + '/')
            await delay(5000)
            await expect($('div=' + eventDescription)).toBeDisplayed()
            await browser.switchWindow(mainLink)
            await delay(2000)
            eventCount++;
        })
        it('Group', async () => {
            await goToSubmenu('scheduler')
            await $('button[data-action="leadHub-new-event"]').click()
            await delay(2000)
            await $('span=Group').click()
            await $('input[name="title"]').setValue(testScheduler.eventName[6])
            await $('mat-select[name="location"]').click()
            await $('mat-option[data-name="meeting-type-Phone Call (inbound)"] span.mat-option-text').click()
            await $('input[data-name="add-user-phone"]').setValue('3014479728')
            await delay(2000)
            await browser.execute((text) => {
                document.querySelector('quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
            }, '<div>' + eventDescription + '</div>');
            await delay(2000)
            await $('button[data-action="leadHub-event-type-next"]').click()
            await $('input[name="days"]').setValue('40')
            await delay(2000)
            const customDuration = await $('app-schedule-type-create div.duration input[type="checkbox"]').isSelected()
            if(!customDuration) await $('app-schedule-type-create div.duration').$('span=Custom duration').click()
            await $('app-schedule-type-create div.duration input[type="number"]').setValue(30)
            await $('button[data-action="leadHub-event-type-next1"]').click()
            await $('app-input-tag mat-form-field').click()
            await $('div.mat-autocomplete-panel mat-option:first-of-type div.chip').click()
            const automationCheck = await $('mat-checkbox[name="automation-checkbox"]')
            await browser.execute(ele => {
                ele.querySelector('input[type="checkbox"]').click();
            }, automationCheck)
            await $('mat-select[name="remind-event"]').click()
            await $('div.mat-select-panel mat-option:first-of-type').click()
            await $('app-input-automation mat-form-field[data-name="contact-input-automation-select"]').click()
            await $('div[role="listbox"]').waitForDisplayed({ timeout: 5000 })
            await $('div[role="listbox"] mat-option:last-of-type div.automation-name').scrollIntoView()
            await browser.pause(2000)
            await $('div[role="listbox"] mat-option:last-of-type div.automation-name').click()
            await $('button[data-action="leadHub-event-type-add-save"]').click()
            await delay(5000)
            const eventElement = await $('div=' + testScheduler.eventName[6])
            await expect(eventElement).toBeDisplayed()
            const eventLink = await browser.custom$('closest_event', eventElement)
            await eventLink.$('div.link').click()
            await delay(5000)
            await accessPartialUrl(schedulerLink + accountName + '/' + testScheduler.bookingLink[6] + '/')
            await delay(5000)
            await expect($('div=' + eventDescription)).toBeDisplayed()
            await browser.switchWindow(mainLink)
            await delay(2000)
            eventCount++;
        })
    })
    describe('Phone Call Outbound', () => {
        it('One-on-one', async () => {
            await goToSubmenu('scheduler')
            await $('button[data-action="leadHub-new-event"]').click()
            await delay(2000)
            await $('span=One-on-One').click()
            await $('input[name="title"]').setValue(testScheduler.eventName[7])
            await $('mat-select[name="location"]').click()
            await $('mat-option[data-name="meeting-type-Phone Call (outbound)"] span.mat-option-text').click()
            await delay(2000)
            await browser.execute((text) => {
                document.querySelector('quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
            }, '<div>' + eventDescription + '</div>');
            await delay(2000)
            await $('button[data-action="leadHub-event-type-next"]').click()
            await $('input[name="days"]').setValue('40')
            await delay(2000)
            const customDuration = await $('app-schedule-type-create div.duration input[type="checkbox"]').isSelected()
            if(!customDuration) await $('app-schedule-type-create div.duration').$('span=Custom duration').click()
            await $('app-schedule-type-create div.duration input[type="number"]').setValue(30)
            await $('button[data-action="leadHub-event-type-next1"]').click()
            await $('app-input-tag mat-form-field').click()
            await $('div.mat-autocomplete-panel mat-option:first-of-type div.chip').click()
            const automationCheck = await $('mat-checkbox[name="automation-checkbox"]')
            await browser.execute(ele => {
                ele.querySelector('input[type="checkbox"]').click();
            }, automationCheck)
            await $('mat-select[name="remind-event"]').click()
            await $('div.mat-select-panel mat-option:first-of-type').click()
            await $('app-input-automation mat-form-field[data-name="contact-input-automation-select"]').click()
            await $('div[role="listbox"]').waitForDisplayed({ timeout: 5000 })
            await $('div[role="listbox"] mat-option:last-of-type div.automation-name').scrollIntoView()
            await browser.pause(2000)
            await $('div[role="listbox"] mat-option:last-of-type div.automation-name').click()
            await $('button[data-action="leadHub-event-type-add-save"]').click()
            await delay(5000)
            const eventElement = await $('div=' + testScheduler.eventName[7])
            await expect(eventElement).toBeDisplayed()
            const eventLink = await browser.custom$('closest_event', eventElement)
            await eventLink.$('div.link').click()
            await delay(5000)
            await accessPartialUrl(schedulerLink + accountName + '/' + testScheduler.bookingLink[7] + '/')
            await delay(5000)
            await expect($('div=' + eventDescription)).toBeDisplayed()
            await browser.switchWindow(mainLink)
            await delay(2000)
            eventCount++;
        })
        it('Group', async () => {
            await goToSubmenu('scheduler')
            await $('button[data-action="leadHub-new-event"]').click()
            await delay(2000)
            await $('span=Group').click()
            await $('input[name="title"]').setValue(testScheduler.eventName[8])
            await $('mat-select[name="location"]').click()
            await $('mat-option[data-name="meeting-type-Phone Call (outbound)"] span.mat-option-text').click()
            await delay(2000)
            await browser.execute((text) => {
                document.querySelector('quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
            }, '<div>' + eventDescription + '</div>');
            await delay(2000)
            await $('button[data-action="leadHub-event-type-next"]').click()
            await $('input[name="days"]').setValue('40')
            await delay(2000)
            const customDuration = await $('app-schedule-type-create div.duration input[type="checkbox"]').isSelected()
            if(!customDuration) await $('app-schedule-type-create div.duration').$('span=Custom duration').click()
            await $('app-schedule-type-create div.duration input[type="number"]').setValue(30)
            await $('button[data-action="leadHub-event-type-next1"]').click()
            await $('app-input-tag mat-form-field').click()
            await $('div.mat-autocomplete-panel mat-option:first-of-type div.chip').click()
            const automationCheck = await $('mat-checkbox[name="automation-checkbox"]')
            await browser.execute(ele => {
                ele.querySelector('input[type="checkbox"]').click();
            }, automationCheck)
            await $('mat-select[name="remind-event"]').click()
            await $('div.mat-select-panel mat-option:first-of-type').click()
            await $('app-input-automation mat-form-field[data-name="contact-input-automation-select"]').click()
            await $('div[role="listbox"]').waitForDisplayed({ timeout: 5000 })
            await $('div[role="listbox"] mat-option:last-of-type div.automation-name').scrollIntoView()
            await browser.pause(2000)
            await $('div[role="listbox"] mat-option:last-of-type div.automation-name').click()
            await $('button[data-action="leadHub-event-type-add-save"]').click()
            await delay(5000)
            const eventElement = await $('div=' + testScheduler.eventName[8])
            await expect(eventElement).toBeDisplayed()
            const eventLink = await browser.custom$('closest_event', eventElement)
            await eventLink.$('div.link').click()
            await delay(5000)
            await accessPartialUrl(schedulerLink + accountName + '/' + testScheduler.bookingLink[8] + '/')
            await delay(5000)
            await expect($('div=' + eventDescription)).toBeDisplayed()
            await browser.switchWindow(mainLink)
            await delay(2000)
            eventCount++;
        })
    })
    describe('Online Meeting', () => {
        it('One-on-one', async () => {
            await goToSubmenu('scheduler')
            await $('button[data-action="leadHub-new-event"]').click()
            await delay(2000)
            await $('span=One-on-One').click()
            await $('input[name="title"]').setValue(testScheduler.eventName[9])
            await $('mat-select[name="location"]').click()
            await $('mat-option[data-name="meeting-type-Online Meeting"] span.mat-option-text').click()
            await $('input[name="address"]').setValue(meetingLink)
            await delay(2000)
            await browser.execute((text) => {
                document.querySelector('quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
            }, '<div>' + eventDescription + '</div>');
            await delay(2000)
            await $('button[data-action="leadHub-event-type-next"]').click()
            await $('input[name="days"]').setValue('40')
            await delay(2000)
            const customDuration = await $('app-schedule-type-create div.duration input[type="checkbox"]').isSelected()
            if(!customDuration) await $('app-schedule-type-create div.duration').$('span=Custom duration').click()
            await $('app-schedule-type-create div.duration input[type="number"]').setValue(30)
            await $('button[data-action="leadHub-event-type-next1"]').click()
            await $('app-input-tag mat-form-field').click()
            await $('div.mat-autocomplete-panel mat-option:first-of-type div.chip').click()
            const automationCheck = await $('mat-checkbox[name="automation-checkbox"]')
            await browser.execute(ele => {
                ele.querySelector('input[type="checkbox"]').click();
            }, automationCheck)
            await $('mat-select[name="remind-event"]').click()
            await $('div.mat-select-panel mat-option:first-of-type').click()
            await $('app-input-automation mat-form-field[data-name="contact-input-automation-select"]').click()
            await $('div[role="listbox"]').waitForDisplayed({ timeout: 5000 })
            await $('div[role="listbox"] mat-option:last-of-type div.automation-name').scrollIntoView()
            await browser.pause(2000)
            await $('div[role="listbox"] mat-option:last-of-type div.automation-name').click()
            await $('button[data-action="leadHub-event-type-add-save"]').click()
            await delay(5000)
            const eventElement = await $('div=' + testScheduler.eventName[9])
            await expect(eventElement).toBeDisplayed()
            const eventLink = await browser.custom$('closest_event', eventElement)
            await eventLink.$('div.link').click()
            await delay(5000)
            await accessPartialUrl(schedulerLink + accountName + '/' + testScheduler.bookingLink[9] + '/')
            await delay(5000)
            await expect($('div=' + eventDescription)).toBeDisplayed()
            await browser.switchWindow(mainLink)
            await delay(2000)
            eventCount++;
        })
        it('Group', async () => {
            await goToSubmenu('scheduler')
            await $('button[data-action="leadHub-new-event"]').click()
            await delay(2000)
            await $('span=Group').click()
            await $('input[name="title"]').setValue(testScheduler.eventName[10])
            await $('mat-select[name="location"]').click()
            await $('mat-option[data-name="meeting-type-Online Meeting"] span.mat-option-text').click()
            await $('input[name="address"]').setValue(meetingLink)
            await delay(2000)
            await browser.execute((text) => {
                document.querySelector('quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
            }, '<div>' + eventDescription + '</div>');
            await delay(2000)
            await $('button[data-action="leadHub-event-type-next"]').click()
            await $('input[name="days"]').setValue('40')
            await delay(2000)
            const customDuration = await $('app-schedule-type-create div.duration input[type="checkbox"]').isSelected()
            if(!customDuration) await $('app-schedule-type-create div.duration').$('span=Custom duration').click()
            await $('app-schedule-type-create div.duration input[type="number"]').setValue(30)
            await $('button[data-action="leadHub-event-type-next1"]').click()
            await $('app-input-tag mat-form-field').click()
            await $('div.mat-autocomplete-panel mat-option:first-of-type div.chip').click()
            const automationCheck = await $('mat-checkbox[name="automation-checkbox"]')
            await browser.execute(ele => {
                ele.querySelector('input[type="checkbox"]').click();
            }, automationCheck)
            await $('mat-select[name="remind-event"]').click()
            await $('div.mat-select-panel mat-option:first-of-type').click()
            await $('app-input-automation mat-form-field[data-name="contact-input-automation-select"]').click()
            await $('div[role="listbox"]').waitForDisplayed({ timeout: 5000 })
            await $('div[role="listbox"] mat-option:last-of-type div.automation-name').scrollIntoView()
            await browser.pause(2000)
            await $('div[role="listbox"] mat-option:last-of-type div.automation-name').click()
            await $('button[data-action="leadHub-event-type-add-save"]').click()
            await delay(5000)
            const eventElement = await $('div=' + testScheduler.eventName[10])
            await expect(eventElement).toBeDisplayed()
            const eventLink = await browser.custom$('closest_event', eventElement)
            await eventLink.$('div.link').click()
            await delay(5000)
            await accessPartialUrl(schedulerLink + accountName + '/' + testScheduler.bookingLink[10] + '/')
            await delay(5000)
            await expect($('div=' + eventDescription)).toBeDisplayed()
            await browser.switchWindow(mainLink)
            await delay(2000)
            eventCount++;
        })
    })
    describe('Google Meeting', () => {
        it('Google Calendar Select', async () => {
            await $('span[data-name="profile-tab-item-Integrated Calendars"]').click()
            await $(`div.calendar-types div.calendar-type:last-of-type label[for="calendar-add-${googleCalendarEmail}"]`).click()
            await $('span[data-name="profile-tab-item-Event Types"]').click()
            await $('button[data-action="leadHub-new-event"]').waitForClickable({ timeout: 5000 })
        })
        it('One-on-one', async () => {
            await goToSubmenu('scheduler')
            await $('button[data-action="leadHub-new-event"]').click()
            await delay(2000)
            await $('span=One-on-One').click()
            await $('input[name="title"]').setValue(testScheduler.eventName[11])
            await $('mat-select[name="location"]').click()
            await $('mat-option[data-name="meeting-type-Google Meeting"] span.mat-option-text').click()
            await delay(2000)
            await browser.execute((text) => {
                document.querySelector('quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
            }, '<div>' + eventDescription + '</div>');
            await delay(2000)
            await $('button[data-action="leadHub-event-type-next"]').click()
            await $('input[name="days"]').setValue('40')
            await delay(2000)
            const customDuration = await $('app-schedule-type-create div.duration input[type="checkbox"]').isSelected()
            if(!customDuration) await $('app-schedule-type-create div.duration').$('span=Custom duration').click()
            await $('app-schedule-type-create div.duration input[type="number"]').setValue(30)
            await $('button[data-action="leadHub-event-type-next1"]').click()
            await $('app-input-tag mat-form-field').click()
            await $('div.mat-autocomplete-panel mat-option:first-of-type div.chip').click()
            const automationCheck = await $('mat-checkbox[name="automation-checkbox"]')
            await browser.execute(ele => {
                ele.querySelector('input[type="checkbox"]').click();
            }, automationCheck)
            await $('mat-select[name="remind-event"]').click()
            await $('div.mat-select-panel mat-option:first-of-type').click()
            await $('app-input-automation mat-form-field[data-name="contact-input-automation-select"]').click()
            await $('div[role="listbox"]').waitForDisplayed({ timeout: 5000 })
            await $('div[role="listbox"] mat-option:last-of-type div.automation-name').scrollIntoView()
            await browser.pause(2000)
            await $('div[role="listbox"] mat-option:last-of-type div.automation-name').click()
            await $('button[data-action="leadHub-event-type-add-save"]').click()
            await delay(5000)
            const eventElement = await $('div=' + testScheduler.eventName[11])
            await expect(eventElement).toBeDisplayed()
            const eventLink = await browser.custom$('closest_event', eventElement)
            await eventLink.$('div.link').click()
            await delay(5000)
            await accessPartialUrl(schedulerLink + accountName + '/' + testScheduler.bookingLink[11] + '/')
            await delay(5000)
            await expect($('div=' + eventDescription)).toBeDisplayed()
            await browser.switchWindow(mainLink)
            await delay(2000)
            eventCount++;
        })
        it('Group', async () => {
            await goToSubmenu('scheduler')
            await $('button[data-action="leadHub-new-event"]').click()
            await delay(2000)
            await $('span=Group').click()
            await $('input[name="title"]').setValue(testScheduler.eventName[12])
            await $('mat-select[name="location"]').click()
            await $('mat-option[data-name="meeting-type-Google Meeting"] span.mat-option-text').click()
            await delay(2000)
            await browser.execute((text) => {
                document.querySelector('quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
            }, '<div>' + eventDescription + '</div>');
            await delay(2000)
            await $('button[data-action="leadHub-event-type-next"]').click()
            await $('input[name="days"]').setValue('40')
            await delay(2000)
            const customDuration = await $('app-schedule-type-create div.duration input[type="checkbox"]').isSelected()
            if(!customDuration) await $('app-schedule-type-create div.duration').$('span=Custom duration').click()
            await $('app-schedule-type-create div.duration input[type="number"]').setValue(30)
            await $('button[data-action="leadHub-event-type-next1"]').click()
            await $('app-input-tag mat-form-field').click()
            await $('div.mat-autocomplete-panel mat-option:first-of-type div.chip').click()
            const automationCheck = await $('mat-checkbox[name="automation-checkbox"]')
            await browser.execute(ele => {
                ele.querySelector('input[type="checkbox"]').click();
            }, automationCheck)
            await $('mat-select[name="remind-event"]').click()
            await $('div.mat-select-panel mat-option:first-of-type').click()
            await $('app-input-automation mat-form-field[data-name="contact-input-automation-select"]').click()
            await $('div[role="listbox"]').waitForDisplayed({ timeout: 5000 })
            await $('div[role="listbox"] mat-option:last-of-type div.automation-name').scrollIntoView()
            await browser.pause(2000)
            await $('div[role="listbox"] mat-option:last-of-type div.automation-name').click()
            await $('button[data-action="leadHub-event-type-add-save"]').click()
            await delay(5000)
            const eventElement = await $('div=' + testScheduler.eventName[12])
            await expect(eventElement).toBeDisplayed()
            const eventLink = await browser.custom$('closest_event', eventElement)
            await eventLink.$('div.link').click()
            await delay(5000)
            await accessPartialUrl(schedulerLink + accountName + '/' + testScheduler.bookingLink[12] + '/')
            await delay(5000)
            await expect($('div=' + eventDescription)).toBeDisplayed()
            await browser.switchWindow(mainLink)
            await delay(2000)
            eventCount++;
        })
    })
    describe('Event Types Clear', () => {
        it('Remove All Events', async () => {
            removeFlag = false;
            await browser.waitUntil(async () => {
                await goToSubmenu('scheduler')
                await $('span[data-name="profile-tab-item-Event Types"]').click()
                await delay(3000)
                const eventExist = await $('app-schedule-types div.event_types div.event-type:last-of-type div.title').isDisplayed()
                if(!eventExist) return true
                const title = await $('app-schedule-types div.event_types div.event-type:last-of-type div.title').getText()
                for(let i = 0; i < testScheduler.eventCount; i++) {
                    if(title === testScheduler.eventName[i]) {
                        removeFlag = true
                        // Remove
                        await $('app-schedule-types div.event_types div.event-type:last-of-type i.i-menu-more').click()
                        await $('span=Delete').waitForClickable({ timeout: 2000 })
                        await $('span=Delete').click()
                        await $('button[data-action="confirm-downgrade"]').waitForClickable({ timeout: 2000 })
                        await $('button[data-action="confirm-downgrade"]').click()
                        await delay(3000)
                        break;
                    }
                }
                if(!removeFlag) return true
            }, {
                timeout: 200000,
                timeoutMsg: 'expect to remove all event types'
            })
        })
    })
})
describe('Scheduled Events', () => {
    it('Sort By', async () => {
        await $('span[data-name="profile-tab-item-Scheduled Events"]').waitForClickable({ timeout: 5000 })
        await $('span[data-name="profile-tab-item-Scheduled Events"]').click()
        await $('div[data-name="scheduled-events-sortby"]').waitForClickable({ timeout: 5000 })
        await $('div[data-name="scheduled-events-sortby"]').click()
        await $('span[data-name="scheduled-events-sortby-Upcoming"]').click()
        await delay(5000)
        await expect($('div[data-name="scheduled-events-sortby"]')).toHaveText('Upcoming')
        await expect($('div.events-container')).toBePresent()
    })
    describe('Pagination', async () => {
        it('8 Rows', async () => {
            await $('span[data-name="profile-tab-item-Scheduled Events"]').waitForClickable({ timeout: 5000 })
            await $('span[data-name="profile-tab-item-Scheduled Events"]').click()
            const paginationExist = await $('div[data-name="scheduled-events-pagination-show"]').isDisplayed()
            if(paginationExist) {
                await $('div[data-name="scheduled-events-pagination-show"]').scrollIntoView()
                await $('div[data-name="scheduled-events-pagination-show"]').click()
                await $('span[data-name="scheduled-events-pagination-show-8"]').click()
                await expect($('div[data-name="scheduled-events-pagination-show"] span')).toHaveText('Show 8 rows per page')
            }
        })
        it('50 Rows', async () => {
            await $('span[data-name="profile-tab-item-Scheduled Events"]').waitForClickable({ timeout: 5000 })
            await $('span[data-name="profile-tab-item-Scheduled Events"]').click()
            const paginationExist = await $('div[data-name="scheduled-events-pagination-show"]').isDisplayed()
            if(paginationExist) {
                await $('div[data-name="scheduled-events-pagination-show"]').scrollIntoView()
                await $('div[data-name="scheduled-events-pagination-show"]').click()
                await $('span[data-name="scheduled-events-pagination-show-50"]').click()
                await expect($('div[data-name="scheduled-events-pagination-show"] span')).toHaveText('Show 50 rows per page')
            }
        })
    })
})
describe('Lead Capture Form', () => {
    describe('New Form', () => {
        it('Uncheck Name', async () => {
            await goToSubmenu('leadCaptureForm')
            await $('a[data-action="create-lead-capture-form"]').click()
            await $('app-lead-capture-form-add').waitForDisplayed({ timeout: 2000 })
            await $('input[name="field_name"]').setValue(testLeadCaptureName)
            const firstName = await $('input[id="First Name-required"]').isSelected()
            const lastName = await $('input[id="Last Name-required"]').isSelected()
            if(firstName) await $('div[data-name="add-lead-capture-field-First Name"] input[type="checkbox"]').click()
            if(lastName) await $('div[data-name="add-lead-capture-field-Last Name"] input[type="checkbox"]').click()
            await expect($('input[id="First Name-required"]')).not.toBeSelected()
            await expect($('input[id="Last Name-required"]')).not.toBeSelected()
            await $('button=Save').click()
            await $('app-lead-capture-form-add').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('span=' + testLeadCaptureName)).toBePresent()
        })
        it.skip('Material, Automation, Tag', async () => {
            await goToSubmenu('leadCaptureForm')
            await $('button[data-action="create-lead-capture-form"]').click()
            await $('app-lead-capture-form-add').waitForDisplayed({ timeout: 2000 })
            await $('input[name="field_name"]').setValue('Feedback-Material')
            await $('app-input-tag mat-form-field').click()
            await $('mat-option:last-of-type span.mat-option-text').scrollIntoView()
            await $('mat-option:last-of-type span.mat-option-text').click()
            await $('app-input-automation mat-form-field').click()
            await $('div[role="listbox"] mat-option:last-of-type div.automation-name').click()
            await $('button[data-action="lead-capture-form-upload-video"]').click()
            await delay(2000)
            const fileUpload = await $('input[type="file"]')
            // const fileUpload = await $('app-lead-capture-form-add div.video-wrapper video source')
            const filePath = await path.join(__dirname, '../../assets/video/caf-object-selection-tool.mp4')
            await fileUpload.addValue(filePath)
            await $('button=Save').click()
            await $('app-lead-capture-form-add').waitForDisplayed({ reverse: true })
            await expect($('app-lead-capture div.page-wrapper div.forms:last-of-type span.f-22')).toHaveText('Feedback-Material')
        })
    })
    describe('Edit and Delete', () => {
        it('Edit Form', async () => {
            await goToSubmenu('leadCaptureForm')
            const feedbackExist = await $('span=' + testLeadCaptureName).isDisplayed()
            if(feedbackExist) {
                const feedbackElement = await $('span=' + testLeadCaptureName)
                const feedbackForm = await browser.custom$('closest_form', feedbackElement)
                await feedbackForm.$('i.i-menu-more').waitForClickable({ timeout: 3000 })
                await feedbackForm.$('i.i-menu-more').click()
                await feedbackForm.$('i.i-menu-more').click({ button: 0, x: -10, y: 40 })
                await $('app-lead-capture-form-add').waitForDisplayed({ timeout: 2000 })
                await $('input[name="field_name"]').setValue('sport')
                await $('button=Save').click()
                await $('app-lead-capture-form-add').waitForDisplayed({ reverse: true })
                await delay(3000)
                await expect($('span=sport')).toBePresent()
            }
        })
        it('Delete Form', async () => {
            await goToSubmenu('leadCaptureForm')
            const sportExist = await $('span=sport').isDisplayed()
            if(sportExist) {
                const sportElement = await $('span=sport')
                const sportForm = await browser.custom$('closest_form', sportElement)
                await sportForm.$('i.i-menu-more').waitForClickable({ timeout: 3000 })
                await sportForm.$('i.i-menu-more').click()
                await sportForm.$('div.material-actions div.dropdown-menu button[data-action="lead-capture-delete"]').click()
                await $('app-confirm').waitForDisplayed({ timeout: 2000 })
                await $('app-confirm button[data-action="confirm-downgrade"]').click()
                await $('app-confirm').waitForDisplayed({ reverse: true })
                await delay(3000)
                await expect($('span=sport')).not.toExist()
            }
        })
    })
})
if(!isVortex) describe('Smart Codes', () => {
    it('Add Code', async () => {
        await goToSubmenu('smartCode')
        const angularExist = await $('app-smart-code').$('span=angular').isDisplayed()
        if(!angularExist) {
            await $('button[data-action="add-new-smart-code"]').click()
            await $('app-smart-code-add').waitForDisplayed({ timeout: 2000 })
            await $('app-smart-code-add #code').setValue('angular')
            await $('app-smart-code-add textarea[name="message"]').setValue('Angular is one of the most popular Frontend framework ')
            await $('app-smart-code-add button[data-action="new-smart-code-add"]').click()
            await $('app-smart-code-add').waitForDisplayed({ reverse: true })
            await delay(3000)
        }
        await expect($('span=angular')).toBeDisplayed()
    })
    it('Edit Code', async () => {
        await goToSubmenu('smartCode')
        const angularExist = await $('app-smart-code').$('span=angular').isDisplayed()
        if(angularExist) {
            const angularElement = await $('app-smart-code').$('span=angular')
            const angularTr = await browser.custom$('closest', angularElement)
            await angularTr.$('td.mat-column-actions i.i-edit').click()
            await $('app-smart-code-add').waitForDisplayed({ timeout: 2000 })
            await $('textarea[name="message"]').setValue('Angular is one of the most popular Frontend framework and my favourite one ')
            await delay(2000)
            await $('button[data-action="new-smart-code-add"]').click()
            await $('app-smart-code-add').waitForDisplayed({ reverse: true })
            await expect($('span=Angular is one of the most popular Frontend framework and my favourite one')).toBeDisplayed()
        }
    })
    it('Search', async () => {
        await goToSubmenu('smartCode')
        await $('div.search-form input[type="text"]').setValue('angular')
        await expect($('table tbody tr:first-of-type td:first-of-type span')).toHaveText('angular')
        await expect($('table tbody tr:last-of-type td:first-of-type span')).toHaveText('angular')
        await $('div.search-form div.cancel-action i.i-close').click()
    })
    it('Delete Code', async () => {
        await goToSubmenu('smartCode')
        const angularExist = await $('span=angular').isDisplayed()
        if(angularExist) {
            const angularElement = await $('span=angular')
            const angularTr = await browser.custom$('closest', angularElement)
            await angularTr.$('td:last-of-type i.i-trash').click()
            await $('button[data-action="confirm-downgrade"]').click()
            await delay(3000)
            await expect($('span=angular')).not.toExist()
        }
    })
})
if(!isVortex) describe('Smart Code Pagination', () => {
    it('8 Rows', async () => {
        await goToSubmenu('smartCode')
        const smartCodePaginationExist = await $('span[data-name="smart-code-pagination-show"]').isDisplayed()
        if(smartCodePaginationExist) {
            await $('span[data-name="smart-code-pagination-show"]').click()
            await $('div[data-name="smart-code-pagination-show-8"]').click()
            await expect($('span[data-name="smart-code-pagination-show"]')).toHaveText('Show 8 rows per page')
        }
    })
    it('50 Rows', async () => {
        await goToSubmenu('smartCode')
        const smartCodePaginationExist = await $('span[data-name="smart-code-pagination-show"]').isDisplayed()
        if(smartCodePaginationExist) {
            await $('span[data-name="smart-code-pagination-show"]').click()
            await $('div[data-name="smart-code-pagination-show-50"]').click()
            await expect($('span[data-name="smart-code-pagination-show"]')).toHaveText('Show 50 rows per page')
        }
    })
})
describe('Integrated Calendar', () => {
    it('Conflict Check', async () => {
        await goToSubmenu('scheduler')
        await $('span[data-name="profile-tab-item-Integrated Calendars"]').waitForClickable({ timeout: 3000 })
        await $('span[data-name="profile-tab-item-Integrated Calendars"]').click()
        await $('label[for="calendar-conflict-0"]').click()
    })
    it('Add Calendar Check', async () => {
        await goToSubmenu('scheduler')
        await $('span[data-name="profile-tab-item-Integrated Calendars"]').waitForClickable({ timeout: 3000 })
        await $('span[data-name="profile-tab-item-Integrated Calendars"]').click()
        await $(`label[for="calendar-add-${googleCalendarEmail}"]`).click()
        await expect($(`input[id="calendar-add-${googleCalendarEmail}"]`)).toBeSelected()
    })
})

