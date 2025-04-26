
const { expect, browser } = require('@wdio/globals');

// let email = require('../test-data/testdata').user.email;
// let password = require('../test-data/testdata').user.password;
// let newPassword = 'course'

const delay = (ms) => {
    return new Promise(res => {
       setTimeout(() => {
        res()
       }, ms) 
    })
}

const knowledgeLink = require('../test-data/testLink').Link.KNOWLEDGE_BASE_LINK;
const askLink = require('../test-data/testLink').Link.ASK_QUESTION_LINK;
const reportBugLink = require('../test-data/testLink').Link.REPORT_BUG_LINK;

const { LOGIN_LINK, HOME_LINK } = require('../test-data/testLink').Link;
const { goToPage, goToSubmenu } = require('./sidebar');
const isVortex = require('../test-data/testdata').isVortex
const testCommunityName = require('../test-data/testdata').testPrepare.community.name;
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
    it('Remove Fake Email', async () => {
        await delay(10000)
        const hourglassExist = await $('div.navbar-nav i.i-hour-glass').isDisplayed()
        if(hourglassExist) {
            await delay(2000)
            await $('div.navbar-nav i.i-hour-glass').click()
            await delay(5000)
            await $('app-task-manager div.tasks-list > div.email-task').click()
            const fakeEmailExist = await $('span=fake email').isDisplayed()
            if(fakeEmailExist) {
                await $('span=fake email').click()
                await delay(5000)
                await $('app-email-queue i.i-menu-more').click()
                await delay(3000)
                await $('div[data-name="schedule-cancel"]').click()
                await delay(5000)
                await $('div.email-task').click()
                await delay(5000)
                await expect($('span=fake email')).not.toExist()
                await delay(2000)
            }
        }
    })
})
describe('Magnifying Glass Icon', () => {
    it('Search', async () => {
        await $('div[data-name="search-provider"]').click()
        await $('aria/search').setValue(testCommunityName)
        await delay(5000)
        await $('div.search-page-inner').waitForDisplayed({ timeout: 5000 })
        await expect($('span=' + testCommunityName)).toBeDisplayed()
        await delay(2000)
        await $('span=' + testCommunityName).click()
        await $('app-team div.team-title-wrapper h5').waitForDisplayed({ timeout: 10000 })
        await expect($('app-team div.team-title-wrapper h5')).toHaveText(testCommunityName)
        await delay(2000)
        await goToPage('dashboard')
    })
})
describe('Question Mark Icon', () => {
    it('Knowledge Base', async () => {
        await $('div[data-name="question-mark"]').waitForClickable({ timeout: 10000 })
        await $('div[data-name="question-mark"]').click()
        await $('a[data-name="knowledge-base-link"]').click()
        await delay(5000)
        await browser.switchWindow(knowledgeLink)
        await expect(browser).toHaveUrl(knowledgeLink)
        // await browser.switchWindow(HOME_LINK)
        await browser.closeWindow()
    })
    it('Ask a Question', async () => {
        await $('div[data-name="question-mark"]').waitForClickable({ timeout: 10000 })
        await $('div[data-name="question-mark"]').click()
        await $('a[data-name="ask-question-link"]').click()
        await delay(5000)
        await accessPartialUrl(askLink)
        await expect(browser).toHaveUrlContaining(askLink)
        // await browser.switchWindow(HOME_LINK)
        await browser.closeWindow()
    })
    it('Report a Bug', async () => {
        await $('div[data-name="question-mark"]').waitForClickable({ timeout: 10000 })
        await $('div[data-name="question-mark"]').click()
        await $('a[data-name="report-bug-link"]').click()
        await delay(5000)
        await browser.switchWindow(reportBugLink)
        await expect(browser).toHaveUrl(reportBugLink)
        // await browser.switchWindow(HOME_LINK)
        await browser.closeWindow()
    })
    it.skip('Live Training', async () => {
        await $('div[data-name="question-mark"]').waitForClickable({ timeout: 10000 })
        await $('div[data-name="question-mark"]').click()
        await $('a[data-name="live-training-link"]').click()
        await delay(5000)
        await browser.switchWindow(HOME_LINK)
        // await expect(browser).toHaveUrl(HOME_LINK)
        await browser.closeWindow()
    })
    it.skip('Facebook Group', async () => {
        await $('div[data-name="question-mark"]').waitForClickable({ timeout: 10000 })
        await $('div[data-name="question-mark"]').click()
        await $('a[data-name="facebook-group-link"]').click()
        await delay(5000)
        // await browser.switchWindow(HOME_LINK)
        await browser.closeWindow()
    })
})
describe('Help Quick Links', () => {
    it('Bell Reminder', async () => {
        await $('div.navbar-nav i.i-notification').click()
        await delay(5000)
        await expect($('app-notifications-list')).toExist()
    })
    it('Text Icon', async () => {
        await $('div.navbar-nav i.i-sms-sent').click()
        await delay(5000)
        await expect($('h4.page-title')).toHaveText('Messages')
    })
})
describe('Profile Info', () => {
    describe('Time Zone', () => {
        it('Change', async () => {
            await $('div[data-name="profile-entrance"]').waitForClickable({ timeout: 5000 })
            await $('div[data-name="profile-entrance"]').click()
            await $('a[data-name="my-profile-link"]').click()
            await $('span[data-name="deal-tab-item-Info"]').click()
            await $('#time_zone_info').click()
            await $('span=Eastern Time').click()
            await expect($('#time_zone_info span.mat-select-min-line')).toHaveTextContaining('Eastern Time')
        })
    })  
    describe('Crmgrow Logo', () => {
        it('Dashboard', async () => {
            if(!isVortex) await goToPage('bulkEmail')
            await $('div.navbar-container img[alt="CRMGROW"]').click()
            await expect($('h1=Dashboard')).toBeDisplayedInViewport()
        })
    })
    describe('Company Change', () => {
        it('Your Company', async () => {
            await $('div[data-name="profile-entrance"]').waitForClickable({ timeout: 5000 })
            await $('div[data-name="profile-entrance"]').click()
            await $('a[data-name="my-profile-link"]').click()
            await $('span[data-name="deal-tab-item-Info"]').click()
            await $('select[data-name="company"]').waitForDisplayed({ timeout: 5000 })
            await $('select[data-name="company"]').selectByVisibleText('Choose other')
            await $('div.cdk-overlay-container app-select-company').waitForDisplayed({ timeout: 5000 })
            await $('div.cdk-overlay-container app-select-company span[data-name="company-realtor"]').click()
            await delay(2000)
            const selected_company = await $('#other-companies-0').getText()
            await $("#other-companies-0").click()
            await delay(5000)
            await $('button[data-action="profile-change-save"]').click()
            await delay(5000)
            await expect(selected_company).toEqual('eXp Realty')
        })
    })
})
describe('Signature', () => {
    it('Signature Layouts', async () => {
        await $('div[data-name="profile-entrance"]').waitForClickable({ timeout: 5000 })
        await $('div[data-name="profile-entrance"]').click()
        await $('a[data-name="my-profile-link"]').click()
        await $('span[data-name="deal-tab-item-Signature"]').click()
        await $('app-signature').waitForDisplayed({ timeout: 5000 })
        await $('app-signature div.email-templates div[id="signature-layout-2"]').click()
        await delay(2000)
        await expect($('app-signature div.email-templates div[id="signature-layout-2"] i.i-check')).toBeDisplayed()
        await $('button=Save changes').click()
        await delay(5000)
    })
})
describe.skip('Sub-Profile for Elite Users', () => {
    it('Team', async () => {
        // Buy Profile
        await $('div[data-name="profile-entrance"]').click()
        await $('a[data-name="my-profile-link"]').click()
        await $('span[data-name="deal-tab-item-Security"]').click()
        await $('button[data-action="team-new-user"]').click()
        await $('input[data-name="add-user-username"]').setValue('Long Hao')
        await $('input[data-name="add-user-email"]').setValue('test@crmgrow.com')
        await $('input[data-name="add-user-phone"]').setValue('3124479728')
        await $('select[name="company"]').click()
        await $('select[name="company"] option:first-of-type').click()
        await $('mat-select[name="time_zone_info"]').click()
        await $('mat-option[id="timezone-select-0"]').click()
        await $('button[data-action="add-user-save-continue"]').click()
        await $('button[data-action="add-user-save"]').click()
        await $('button[data-action="start-new-profile"]').click()
        // Add Team
        await $('div[data-name="profile-entrance"]').click()
        await $('div[data-name="create-switch-business-div"]').click()
        await $('a[data-name="add-new-team"]').click()
    })
})
describe('Flag Icon', () => {
    it('Spanish', async () => {
        await $('div.navbar-container i[data-name="flag-icon-select"]').click()
        await $('div.navbar-container i[data-name="flag-icon-select-Spanish"]').waitForClickable({ timeout: 3000 })
        await $('div.navbar-container i[data-name="flag-icon-select-Spanish"]').click()
        await delay(3000)
        await expect($('div[data-name="sidebar-item-dashboard"] span.menu-label')).toHaveText('Salpicadero')
    })
    it('French', async () => {
        await $('div.navbar-container i[data-name="flag-icon-select"]').click()
        await $('div.navbar-container i[data-name="flag-icon-select-French"]').waitForClickable({ timeout: 3000 })
        await $('div.navbar-container i[data-name="flag-icon-select-French"]').click()
        await delay(3000)
        await expect($('div[data-name="sidebar-item-dashboard"] span.menu-label')).toHaveText('Le tableau')
    })
    it('English', async () => {
        await $('div.navbar-container i[data-name="flag-icon-select"]').click()
        await $('div.navbar-container i[data-name="flag-icon-select-English"]').waitForClickable({ timeout: 3000 })
        await $('div.navbar-container i[data-name="flag-icon-select-English"]').click()
        await delay(3000)
        await expect($('div[data-name="sidebar-item-dashboard"] span.menu-label')).toHaveText('Dashboard')
    })
})
describe('Hour Glass Icon', () => {
    describe('Scheduled Items', () => {
        it('Add New Scheduled Item', async () => {
            await goToPage('contacts')
            await $('app-contacts div.contact-list-controls i.i-list').click()
            await $('span=Assigned To Me').click()
            await delay(5000)
            await $('#contact-table tbody tr:first-of-type td.mat-column-contact_name div.contact-avatar').waitForClickable({ timeout: 5000 })
            await $('#contact-table tbody tr:first-of-type td.mat-column-contact_name div.contact-avatar').click()
            await delay(5000)
            await $('div[data-name="contact-dropdown-toggle"]').waitForClickable({ timeout: 19000 })
            await $('div[data-name="contact-dropdown-toggle"]').click()
            await $('button[data-action="contact-action-new-email"]').waitForClickable({ timeout: 3000 })
            await $('button[data-action="contact-action-new-email"]').click()
            await $('app-send-email').waitForDisplayed({ timeout: 5000 })     
            await delay(3000)
            await $('input[data-name="deal-send-email-subject"]').setValue("fake email")
            await delay(3000)
            await browser.execute((text) => {
                // Access the Quill instance and set text
                document.querySelector('app-send-email quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
            }, '<div>Did you have a good weekend?</div>');
            await delay(2000)
            await $('i.i-schedule-send').click()
            await $('app-schedule-send').waitForDisplayed({ timeout: 3000 })
            await $('app-schedule-send div.datepicker').click()
            await $('app-schedule-select').waitForDisplayed({ timeout: 3000 })
            await browser.waitUntil(async () => {
                await $('app-business-date-time-picker div.calendar-time div.calendar-controls i.i-chev-right').click()
                const text = await $('div.calendar-time div.date span').getText()
                return text.includes('January')
            })
            await $('mwl-calendar-month-view div.cal-days > div:nth-of-type(2) mwl-calendar-month-cell:nth-of-type(2) span.cal-day-number').click()
            await $('app-schedule-select button[data-action="deal-schedule-select-ok"]').click()
            await $('app-schedule-select').waitForDisplayed({ reverse: true })
            await $('button[data-action="contact-item-schedule"]').click()
            await delay(2000)
            const confirmBusinessHour = await $('app-confirm-business-hour').isDisplayed()
            if(confirmBusinessHour) await $('button[data-action="create-schedule-item"]').click()
            await delay(5000)
            await $('a[data-name="hour-glass"]').waitForClickable({ timeout: 5000 })
            await $('a[data-name="hour-glass"]').click()
            await $('div.email-task').waitForClickable({ timeout: 3000 })
            await $('div.email-task').click()
            await delay(5000)
            await expect($('span=fake email')).toBeDisplayed()
            await delay(5000)
        })
    })
    describe('After Scheduled Item Exist', () => {
        it.skip('Pause Schedule', async () => {
            await $('a[data-name="hour-glass"]').click()
            await delay(3000)
            await $('div.email-task').click()
            await delay(5000)
            await $('span=fake email').click()
            await delay(3000)
            await $('div[data-name="scheduled-item-menu-more"]').waitForClickable({ timeout: 6000 })
            await $('div[data-name="scheduled-item-menu-more"]').click()
            await $('div[data-name="scheduled-item-record-pause"]').waitForExist({ timeout: 6000 })
            await $('div[data-name="scheduled-item-record-pause"]').click()
            await $('div.awaiting').waitForExist({ reverse: true, timeout: 9000 })
            await expect($('div.page-status div.task-status')).toHaveText('Paused')
        })
        it.skip('Resume Schedule', async () => {
            await $('div[data-name="scheduled-item-menu-more"]').waitForClickable({ timeout: 6000 })
            await $('div[data-name="scheduled-item-menu-more"]').click()
            await $('div[data-name="scheduled-item-record-play"]').waitForExist({ timeout: 6000 })
            await $('div[data-name="scheduled-item-record-play"]').click()
            await $('div.awaiting').waitForExist({ reverse: false, timeout: 9000 })
            await expect($('div.page-status div.task-status')).toHaveText('Awaiting')
        })
        it('Reschedule', async () => {
            await $('a[data-name="hour-glass"]').click()
            await delay(5000)
            await $('div.email-task').click()
            await delay(5000)
            await $('span=fake email').click()
            await delay(5000)
            await $('div[data-name="scheduled-item-menu-more"]').click()
            await $('div[data-name="reschedule-due-time"]').waitForClickable({ timeout: 3000 })
            await $('div[data-name="reschedule-due-time"]').click()
            await $('app-schedule-setting').waitForDisplayed({ timeout: 3000 })
            await $('app-business-date-time-picker i.i-edit').click()
            await delay(3000)
            await browser.waitUntil(async () => {
                await $('app-business-date-time-picker div.calendar-time div.calendar-controls i.i-chev-right').click()
                const text = await $('div.calendar-time div.date span').getText()
                return text.includes('January')
            })
            await $('app-schedule-setting mwl-calendar-month-view div.cal-days > div:nth-of-type(2) mwl-calendar-month-cell:nth-of-type(2) span.cal-day-number').click()
            await $('div.mat-select-arrow-wrapper').click()
            await delay(3000)
            await $('span=9:15 AM').scrollIntoView()
            await $('span=9:15 AM').click()
            await $('app-schedule-setting button[data-action="schedule-change"]').click()
            await $('app-schedule-setting').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('app-email-queue div.page-status div.task-time')).toHaveTextContaining('09:15 am')
        })
        it('Schedule-cancel', async () => {
            await $('a[data-name="hour-glass"]').click()
            await delay(3000)
            await $('div.email-task').click()
            await delay(5000)
            await $('span=fake email').click()
            await $('div[data-name="scheduled-item-menu-more"]').click()
            await $('div[data-name="scheduled-item-menu-more"]').waitForClickable({ timeout: 3000 })
            await $('div[data-name="schedule-cancel"]').click()
            await delay(5000)
            await $('div.email-task').click()
            await delay(5000)
            await expect($('span=fake email')).not.toExist()
        })
    })
})



