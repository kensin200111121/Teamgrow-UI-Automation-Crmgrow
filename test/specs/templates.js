
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

const mainLink = require('../test-data/testLink').Link.TEMPLATES_LINK;

const testContactName = require('../test-data/testdata').testPrepare.contact.name;
const testContactCompany = require('../test-data/testdata').testPrepare.contact.company;

const testTokens = [
    'Test token1',
    'Test token2',
    'Test token3',
    'Test token4'
];

describe('Test Data Setup', () => {
    describe('Preparation', async () => {
        it('Merged Field Reset', async () => {
            await goToSubmenu('mergedFieldManager')
            // Remove
            const testToken1Exist = await $('div=' + testTokens[0]).isDisplayed()
            if(testToken1Exist) {
                const testToken1Element = await $('div=' + testTokens[0])
                const testToken1FieldItem = await browser.custom$('closest_field-item', testToken1Element)
                await testToken1FieldItem.$('div.custom-checkbox').click()
                await $('div[data-name="material-action-item-Delete"]').waitForClickable({ timeout: 3000 })
                await $('div[data-name="material-action-item-Delete"]').scrollIntoView()
                await $('div[data-name="material-action-item-Delete"]').click()
                await $('app-custom-toast').waitForDisplayed({ timeout: 6000 })
                await expect($('app-custom-toast div.custom-message')).toHaveText('Tokens removed successfully')
                await delay(3000)
            }
            const testToken2Exist = await $('div=' + testTokens[1]).isDisplayed()
            if(testToken2Exist) {
                const testToken2Element = await $('div=' + testTokens[1])
                const testToken2FieldItem = await browser.custom$('closest_field-item', testToken2Element)
                await testToken2FieldItem.$('div.custom-checkbox').click()
                await $('div[data-name="material-action-item-Delete"]').waitForClickable({ timeout: 3000 })
                await $('div[data-name="material-action-item-Delete"]').scrollIntoView()
                await $('div[data-name="material-action-item-Delete"]').click()
                await $('app-custom-toast').waitForDisplayed({ timeout: 6000 })
                await expect($('app-custom-toast div.custom-message')).toHaveText('Tokens removed successfully')
                await delay(3000)
            }
            const testToken3Exist = await $('div=' + testTokens[2]).isDisplayed()
            if(testToken3Exist) {
                const testToken3Element = await $('div=' + testTokens[2])
                const testToken3FieldItem = await browser.custom$('closest_field-item', testToken3Element)
                await testToken3FieldItem.$('div.custom-checkbox').click()
                await $('div[data-name="material-action-item-Delete"]').waitForClickable({ timeout: 3000 })
                await $('div[data-name="material-action-item-Delete"]').scrollIntoView()
                await $('div[data-name="material-action-item-Delete"]').click()
                await $('app-custom-toast').waitForDisplayed({ timeout: 6000 })
                await expect($('app-custom-toast div.custom-message')).toHaveText('Tokens removed successfully')
                await delay(3000)
            }
            const testToken4Exist = await $('div=' + testTokens[3]).isDisplayed()
            if(testToken4Exist) {
                const testToken4Element = await $('div=' + testTokens[3])
                const testToken4FieldItem = await browser.custom$('closest_field-item', testToken4Element)
                await testToken4FieldItem.$('div.custom-checkbox').click()
                await $('div[data-name="material-action-item-Delete"]').waitForClickable({ timeout: 3000 })
                await $('div[data-name="material-action-item-Delete"]').scrollIntoView()
                await $('div[data-name="material-action-item-Delete"]').click()
                await $('app-custom-toast').waitForDisplayed({ timeout: 6000 })
                await expect($('app-custom-toast div.custom-message')).toHaveText('Tokens removed successfully')
                await delay(3000)
            }
        })
    })
})
describe('Token Manager', () => {
    it('Contact Type Email Test', async () => {
        await goToSubmenu('mergedFieldManager')
        await $('button[data-action="templates-create-new-token"]').click()
        await $('app-create-token').waitForDisplayed({ timeout: 3000 })
        await $('input[name="token_name"]').setValue('Test token1')
        await $('select[name="value_type"]').selectByVisibleText('Contact')
        await $('select[name="token_match_field"]').selectByVisibleText('Company')
        await delay(2000)
        await $('button[data-action="token-create-add"]').click()
        await $('app-create-token').waitForDisplayed({ reverse: true })
        await $('app-custom-toast').waitForDisplayed({ timeout: 6000 })
        await expect($('app-custom-toast div.custom-message')).toHaveText('New token created successfully')
        // Use token
        await goToPage('contacts')
        await $('span=' + testContactName).click()
        await $('div[data-name="contact-dropdown-toggle"]').waitForClickable({ timeout: 7000 })
        await $('div[data-name="contact-dropdown-toggle"]').click()
        await $('button[data-action="contact-action-new-email"]').click()
        await $('app-send-email').waitForDisplayed({ timeout: 5000 })
        await $('input[data-name="deal-send-email-subject"]').setValue('Which Company')
        if(!isVortex) {
            await browser.execute((text) => {
                document.querySelector('app-send-email quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
            }, '<div>My company is &nbsp</div>');
        } else {
            await browser.execute((text) => {
                document.querySelector('app-send-email quill-editor[data-name="deal-action-description"] .ql-editor > div').innerHTML = text;
            }, 'My company is &nbsp');
        }
        await $('app-token-selector div.token').click()
        await $('app-token-selector div.token div.menu-item:last-of-type').scrollIntoView()
        await expect($('app-send-email app-token-selector div.token div.menu-item:last-of-type')).toHaveText('Test token1')
        await $('app-send-email app-token-selector div.token div.menu-item:last-of-type').click()
        await $('button[data-action="deal-email-send"]').click()
        await $('app-send-email').waitForDisplayed({ reverse: true })
        await delay(5000)
        await goToPage('contacts')
        await $('span=' + testContactName).click()
        await delay(7000)
        await $('span[data-name="deal-tab-item-Emails"]').click()
        await delay(17000)
        // await expect($('app-contact-activities app-contact-activity-super-item:first-of-type span.email-content div')).toHaveText('My company is ' + testContactCompany)    
        // Delete Token
        await goToSubmenu('mergedFieldManager')
        const testToken1Exist = await $('div=' + testTokens[0]).isDisplayed()
        if(testToken1Exist) {
            const testToken1Element = await $('div=' + testTokens[0])
            const testToken1FieldItem = await browser.custom$('closest_field-item', testToken1Element)
            await testToken1FieldItem.$('div.custom-checkbox').click()
            await $('div[data-name="material-action-item-Delete"]').waitForClickable({ timeout: 3000 })
            await $('div[data-name="material-action-item-Delete"]').scrollIntoView()
            await $('div[data-name="material-action-item-Delete"]').click()
            await $('app-custom-toast').waitForDisplayed({ timeout: 6000 })
            await expect($('app-custom-toast div.custom-message')).toHaveText('Tokens removed successfully')
            await delay(3000)
            await goToSubmenu('mergedFieldManager')
        }
    })
    it.skip('Contact Type Text Test', async () => {
        let tokenManager = await $('li[data-name="sidebar-submenu-item-merged_field_manager"]').isDisplayedInViewport()
        if(!tokenManager) await goToPage('templates')
        await $('li[data-name="sidebar-submenu-item-merged_field_manager"]').click()
        await delay(5000)
        await $('button[data-action="templates-create-new-token"]').click()
        await $('app-create-token').waitForDisplayed({ timeout: 3000 })
        await $('input[name="token_name"]').setValue('Test token2')
        await $('select[name="value_type"]').selectByVisibleText('Contact')
        await $('select[name="token_match_field"]').selectByVisibleText('Company')
        await $('button[data-action="token-create-add"]').click()
        await $('app-create-token').waitForDisplayed({ reverse: true })
        await $('app-custom-toast').waitForDisplayed({ timeout: 6000 })
        await expect($('app-custom-toast div.custom-message')).toHaveText('New token created successfully')
        // Use token
        await goToPage('contacts')
        await $('span=' + testContactName).click()
        await $('div[data-name="contact-dropdown-toggle"]').waitForClickable({ timeout: 7000 })
        await $('div[data-name="contact-dropdown-toggle"]').click()
        await $('button[data-action="contact-action-new-text"]').click()
        await $('app-send-text').waitForDisplayed({ timeout: 5000 })
        await $('app-send-text textarea[data-name="deal-text-description"]').setValue('My company is&nbsp')
        await $('app-send-text app-token-selector div.token').click()
        await $('app-send-text app-token-selector div.token div.menu-item:last-of-type').scrollIntoView()
        await expect($('app-send-text app-token-selector div.token div.menu-item:last-of-type')).toHaveText('Test token2')
        await $('app-send-text app-token-selector div.token div.menu-item:last-of-type').click()
        await $('button[data-action="template-contact-text-send"]').click()
        await $('app-send-text').waitForDisplayed({ reverse: true })
        await delay(3000)
        await $('span[data-name="deal-tab-item-Texts"]').click()
        await delay(5000)
        await expect($('div.history-detail:first-of-type app-text-timelines span.text-content')).toHaveText('My company is ' + testContactCompany)  
        // Delete Token
        await goToPage('templates')
        await delay(3000)
        await $('li[data-name="sidebar-submenu-item-merged_field_manager"]').click()
        const testToken2Exist = await $('div=' + testTokens[1]).isDisplayed()
        if(testToken2Exist) {
            const testToken2Element = await $('div=' + testTokens[1])
            const testToken2FieldItem = await browser.custom$('closest_field-item', testToken2Element)
            await testToken2FieldItem.$('div.custom-checkbox').click()
            await $('div[data-name="material-action-item-Delete"]').waitForClickable({ timeout: 3000 })
            await $('div[data-name="material-action-item-Delete"]').scrollIntoView()
            await $('div[data-name="material-action-item-Delete"]').click()
            await $('app-custom-toast').waitForDisplayed({ timeout: 6000 })
            await expect($('app-custom-toast div.custom-message')).toHaveText('Tokens removed successfully')
            await delay(3000)
            await goToPage('templates')
            await $('li[data-name="sidebar-submenu-item-merged_field_manager"] > a').click()
            await delay(3000)
        }
    })
    it('Custom Type Email Test', async () => {
        await goToSubmenu('mergedFieldManager')
        await $('button[data-action="templates-create-new-token"]').click()
        await $('app-create-token').waitForDisplayed({ timeout: 3000 })
        await $('input[name="token_name"]').setValue('Test token3')
        await $('select[name="value_type"]').selectByVisibleText('Custom Static Value')
        await $('input[name="token_value"]').setValue('test123')
        await $('button[data-action="token-create-add"]').click()
        await $('app-create-token').waitForDisplayed({ reverse: true })
        await $('app-custom-toast').waitForDisplayed({ timeout: 6000 })
        await expect($('app-custom-toast div.custom-message')).toHaveText('New token created successfully')
        // Use token
        await goToPage('contacts')
        await $('span=' + testContactName).click()
        await $('div[data-name="contact-dropdown-toggle"]').waitForClickable({ timeout: 7000 })
        await $('div[data-name="contact-dropdown-toggle"]').click()
        await $('button[data-action="contact-action-new-email"]').click()
        await $('app-send-email').waitForDisplayed({ timeout: 5000 })
        await $('input[data-name="deal-send-email-subject"]').setValue('Token Test')
        if(!isVortex) {
            await browser.execute((text) => {
                document.querySelector('app-send-email quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
            }, '<div>Token is &nbsp</div>');
        } else {
            await browser.execute((text) => {
                document.querySelector('app-send-email quill-editor[data-name="deal-action-description"] .ql-editor > div').innerHTML = text;
            }, 'Token is &nbsp');
        }
        await $('app-send-email app-token-selector div.token').click()
        await $('app-send-email app-token-selector div.token div.menu-item:last-of-type').scrollIntoView()
        await expect($('app-send-email app-token-selector div.token div.menu-item:last-of-type')).toHaveText('Test token3')
        await $('app-send-email app-token-selector div.token div.menu-item:last-of-type').click()
        await delay(2000)
        await $('button[data-action="deal-email-send"]').click()
        // await $('button[data-action="create-schedule-item"]').click()
        await $('app-send-email').waitForDisplayed({ reverse: true })
        await delay(5000)
        await goToPage('contacts')
        await $('span=' + testContactName).click()
        await delay(7000)
        await $('span[data-name="deal-tab-item-Emails"]').click()
        await delay(17000)
        // await expect($('app-contact-activities app-contact-activity-super-item:first-of-type span.email-content div')).toHaveText('Token is test123')    
        // Delete Token
        await goToSubmenu('mergedFieldManager')
        const testToken3Exist = await $('div=' + testTokens[2]).isDisplayed()
        if(testToken3Exist) {
            const testToken3Element = await $('div=' + testTokens[2])
            const testToken3FieldItem = await browser.custom$('closest_field-item', testToken3Element)
            await testToken3FieldItem.$('div.custom-checkbox').click()
            await $('div[data-name="material-action-item-Delete"]').waitForClickable({ timeout: 3000 })
            await $('div[data-name="material-action-item-Delete"]').scrollIntoView()
            await $('div[data-name="material-action-item-Delete"]').click()
            await $('app-custom-toast').waitForDisplayed({ timeout: 6000 })
            await expect($('app-custom-toast div.custom-message')).toHaveText('Tokens removed successfully')
            await delay(3000)
            await goToSubmenu('mergedFieldManager')
        }
    })
    it.skip('Custom Type Text Test', async () => {
        let tokenManager = await $('li[data-name="sidebar-submenu-item-merged_field_manager"]').isDisplayedInViewport()
        if(!tokenManager) await goToPage('templates')
        await $('li[data-name="sidebar-submenu-item-merged_field_manager"]').waitForClickable({ timeout: 3000 })
        await $('li[data-name="sidebar-submenu-item-merged_field_manager"]').click()
        await $('button[data-action="templates-create-new-token"]').click()
        await $('app-create-token').waitForDisplayed({ timeout: 3000 })
        await $('input[name="token_name"]').setValue('Test token4')
        await $('select[name="value_type"]').click()
        await $('option[value="static"]').click()
        await $('input[name="token_value"]').setValue('test123')
        await $('button[data-action="token-create-add"]').click()
        await $('app-create-token').waitForDisplayed({ reverse: true })
        await $('app-custom-toast').waitForDisplayed({ timeout: 6000 })
        await expect($('app-custom-toast div.custom-message')).toHaveText('New token created successfully')
        // Use token
        await goToPage('contacts')
        await $('span=' + testContactName).click()
        await $('div[data-name="contact-dropdown-toggle"]').waitForClickable({ timeout: 7000 })
        await $('div[data-name="contact-dropdown-toggle"]').click()
        await $('button[data-action="contact-action-new-text"]').click()
        await $('app-send-text').waitForDisplayed({ timeout: 5000 })
        await $('textarea').setValue('Token is&nbsp')
        await $('div.token').click()
        await $('div.token div.menu-item:last-of-type').scrollIntoView()
        await expect($('div.token div.menu-item:last-of-type')).toHaveText('Test token4')
        await $('div.token div.menu-item:last-of-type').click()
        await $('button[data-action="template-contact-text-send"]').click()
        await $('app-send-text').waitForDisplayed({ reverse: true })
        await delay(3000)
        await $('span[data-name="deal-tab-item-Texts"]').click()
        await delay(5000)
        await expect($('div.history-detail:first-of-type app-text-timelines span.text-content')).toHaveText('Token is test123')   
        // Delete Token
        await goToPage('templates')
        await delay(3000)
        await $('li[data-name="sidebar-submenu-item-merged_field_manager"]').click()
        const testToken4Exist = await $('div=' + testTokens[3]).isDisplayed()
        if(testToken4Exist) {
            const testToken4Element = await $('div=' + testTokens[3])
            const testToken4FieldItem = await browser.custom$('closest_field-item', testToken4Element)
            await testToken4FieldItem.$('div.custom-checkbox').click()
            await $('div[data-name="material-action-item-Delete"]').waitForClickable({ timeout: 3000 })
            await $('div[data-name="material-action-item-Delete"]').scrollIntoView()
            await $('div[data-name="material-action-item-Delete"]').click()
            await $('app-custom-toast').waitForDisplayed({ timeout: 6000 })
            await expect($('app-custom-toast div.custom-message')).toHaveText('Tokens removed successfully')
            await delay(3000)
            await goToPage('templates')
            await $('li[data-name="sidebar-submenu-item-merged_field_manager"] > a').click()
            await delay(3000)
        }
    })
})
describe('Templates List Pagination', () => {
    it('8 Rows', async () => {
        await goToPage('templates')
        await $('span[data-name="profile-tab-item-My Templates List"]').click()
        await delay(2000)
        const paginationExist = await $('span[data-name="template-list-pagesize"]').isExisting()
        if(paginationExist) {
            await $('span[data-name="template-list-pagesize"]').click()
            await $('div[data-name="template-list-pagesize-8"]').click()
            await expect($('span[data-name="template-list-pagesize"]')).toHaveText('Show 8 rows per page')
        }
    })
    it('50 Rows', async () => {
        await goToPage('templates')
        await $('span[data-name="profile-tab-item-My Templates List"]').click()
        await delay(2000)
        const paginationExist = await $('span[data-name="template-list-pagesize"]').isExisting()
        if(paginationExist) {
            await $('span[data-name="template-list-pagesize"]').click()
            await $('div[data-name="template-list-pagesize-50"]').click()
            await expect($('span[data-name="template-list-pagesize"]')).toHaveText('Show 50 rows per page')
        }
    })
})
describe('Templates Library Pagination', () => {
    it('8 Rows', async () => {
        await goToPage('templates')
        await $('span[data-name="profile-tab-item-Templates Library"]').click()
        await delay(2000)
        const paginationExist = await $('span[data-name="template-library-pagesize"]').isExisting()
        if(paginationExist) {
            await $('span[data-name="template-library-pagesize"]').click()
            await $('div[data-name="template-library-pagesize-8"]').click()
            await expect($('span[data-name="template-library-pagesize"]')).toHaveText('Show 8 rows per page')
        }
    })
    it('50 Rows', async () => {
        await goToPage('templates')
        await $('span[data-name="profile-tab-item-Templates Library"]').click()
        await delay(2000)
        const paginationExist = await $('span[data-name="template-library-pagesize"]').isExisting()
        if(paginationExist) {
            await $('span[data-name="template-library-pagesize"]').click()
            await $('div[data-name="template-library-pagesize-50"]').click()
            await expect($('span[data-name="template-library-pagesize"]')).toHaveText('Show 50 rows per page')
        }
    })
})
describe('Sort', () => {
    if(!isVortex) describe('Templates List', () => {
        it('Sort by Title', async () => {
            await goToPage('templates')
            await $('span[data-name="profile-tab-item-My Templates List"]').click()
            await delay(3000)
            await $('app-templates-own table thead tr.table-header th.name-col div.head-sort span').click()
            await delay(2000)
            await expect($('app-templates-own table thead tr.table-header th.name-col div.head-sort i.i-sort-down')).toBeDisplayed()
            await $('app-templates-own table thead tr.table-header th.name-col div.head-sort span').click()
            await delay(2000)
            await expect($('app-templates-own table thead tr.table-header th.name-col div.head-sort i.i-sort-up')).toBeDisplayed()
        })
        it('Sort by Type', async () => {
            await goToPage('templates')
            await $('span[data-name="profile-tab-item-My Templates List"]').click()
            await delay(3000)
            await $('app-templates-own table thead tr.table-header th.type-col div.head-sort span').click()
            await delay(2000)
            await expect($('app-templates-own table thead tr.table-header th.type-col div.head-sort i.i-sort-down')).toBeDisplayed()
            await $('app-templates-own table thead tr.table-header th.type-col div.head-sort span').click()
            await delay(2000)
            await expect($('app-templates-own table thead tr.table-header th.type-col div.head-sort i.i-sort-up')).toBeDisplayed()
        })
    })
    if(!isVortex) describe('Templates Library', () => {
        it('Sort by Title', async () => {
            await goToPage('templates')
            await $('span[data-name="profile-tab-item-Templates Library"]').click()
            await $('app-templates-library table thead tr.table-header th.name-col div.head-sort span').click()
            await expect($('app-templates-library table thead tr.table-header th.name-col div.head-sort i.i-sort-down')).toBeDisplayed()
            await $('app-templates-library table thead tr.table-header th.name-col div.head-sort span').click()
            await expect($('app-templates-library table thead tr.table-header th.name-col div.head-sort i.i-sort-up')).toBeDisplayed()
        })
        it('Sort by Type', async () => {
            await goToPage('templates')
            await $('span[data-name="profile-tab-item-Templates Library"]').click()
            await $('app-templates-library table thead tr.table-header th.type-col div.head-sort span').click()
            await expect($('app-templates-library table thead tr.table-header th.type-col div.head-sort i.i-sort-down')).toBeDisplayed()
            await $('app-templates-library table thead tr.table-header th.type-col div.head-sort span').click()
            await expect($('app-templates-library table thead tr.table-header th.type-col div.head-sort i.i-sort-up')).toBeDisplayed()
        })
        it.skip('Sort by Owner', async () => {
            await goToPage('templates')
            await $('span[data-name="profile-tab-item-Templates Library"]').click()
            await $('app-templates-library table thead tr.table-header th.type-col div.head-sort span').click()
            await expect($('app-templates-library table thead tr.table-header th.type-col div.head-sort i.i-sort-down')).toBeDisplayed()
            await $('app-templates-library table thead tr.table-header th.type-col div.head-sort span').click()
            await expect($('app-templates-library table thead tr.table-header th.type-col div.head-sort i.i-sort-up')).toBeDisplayed()
        })
        it('Sort by Download', async () => {
            await goToPage('templates')
            await $('span[data-name="profile-tab-item-Templates Library"]').click()
            await $('app-templates-library table thead tr.table-header th.time-col div.head-sort span').click()
            await expect($('app-templates-library table thead tr.table-header th.time-col div.head-sort i.i-sort-down')).toBeDisplayed()
            await $('app-templates-library table thead tr.table-header th.time-col div.head-sort span').click()
            await expect($('app-templates-library table thead tr.table-header th.time-col div.head-sort i.i-sort-up')).toBeDisplayed()
        })
    })
    describe('Remove test templates', () => {
        it('Clear List', async () => {
            await goToPage('templates')
            await $('span[data-name="profile-tab-item-My Templates List"]').waitForClickable({ timeout: 5000 })
            await $('span[data-name="profile-tab-item-My Templates List"]').click()
            await delay(3000)
            await browser.waitUntil(async () => {
                const stillExist = await $('app-templates-own table tbody tr:first-of-type div.material-actions i.i-trash').isExisting()
                if(stillExist) {
                    await $('table tbody tr:first-of-type div.material-actions i.i-trash').click()
                    await delay(2000)
                    await $('app-confirm button[data-action="confirm-downgrade"]').click()
                    await delay(5000)
                }
                return !stillExist
            }, {
                timeout: 200000,
                timeoutMsg: 'expect to remove all test templates'
            })
        })
    }) 
})
