
const { expect, browser } = require('@wdio/globals');
const path = require('path');
const { goToPage, goToSubmenu } = require('./sidebar');
const isVortex = require('../test-data/testdata').isVortex

const delay = (ms) => {
    return new Promise(res => {
       setTimeout(() => {
        res()
       }, ms) 
    })
}

const testingContact = '0Testing Contact';
const testingPhone = "8584991782"
const testingEmail = "testingcontact@crmgrow.com"
let testingContactElement;
const testTag = 'wang-tag';
const testTagText = 'Wang-Tag';
const testStatus = 'wang-status';
const testStatusText = 'Wang-Status';
const testCustomField = 'wang-custom-field';

const selectContact = async contactName => {
    const contactExist = await $(`span=${contactName}`).isExisting()
    if(contactExist) {
        const contact = await $(`span=${contactName}`)
        const Tr = await browser.custom$('closest', contact)
        const selectorEl = await Tr.$('td.mat-column-select')
        await browser.execute(ele => {
            ele.querySelector('input[type="checkbox"]').click();
        }, selectorEl)
    }
}

describe('Contact List', async () => {
    before (async () => {
        await goToPage('contacts');
    });
    describe('Test Data Setup', () => {
        it('Add Testing Contact', async () => {
            testingContactElement = await $('span=' + testingContact)
            const exists = await testingContactElement.isExisting()
            if(exists) {
                await delay(3000)
                await selectContact(testingContact)
                await $('div[data-name="material-action-item-More"]').waitForClickable({ timeout: 2000 })
                await $('div[data-name="material-action-item-More"]').click()
                await $('div[data-name="material-action-item-More-Delete"]').click()
                await $('button[data-action="confirm-downgrade"]').click()
                await delay(5000)
            }
            await $('button[data-action="create-new-contact"]').waitForClickable({ timeout: 10000 })
            await $('button[data-action="create-new-contact"]').click()
            await delay(5000)
            await $('input[data-name="contact-create-firstname"]').setValue("0Testing")
            await $('input[data-name="contact-create-lastname"]').setValue("Contact")
            await $('input[data-name="contact-create-email"]').setValue(testingEmail)
            await $('app-contact-create-edit app-phone-input input[data-name="add-user-phone"]').setValue(testingPhone)
            await delay(2000)
            await $('button[data-action="create-contact-add-btn"]').waitForClickable({ timeout: 3000 })
            await $('button[data-action="create-contact-add-btn"]').click()
            await $('app-contact-create-edit').waitForDisplayed({ reverse: true })
            await delay(5000)
            testingContactElement = await $('span=' + testingContact)
            await testingContactElement.waitForExist()
            if(testingContactElement) {
                await delay(3000)
                const testingContactTr = await browser.custom$('closest', testingContactElement)
                await expect(testingContactTr.$('td.mat-column-contact_name span')).toHaveText(testingContact)
            }
        })
    })
    
    describe('Filter', () => {
        beforeEach(async () => {
            await $('button[data-action="create-new-contact"]').scrollIntoView()
            await $('span[data-name="contact-list-filter"]').click()
        })
        describe('Status', () => {
            it('Status Inclusive', async () => {
                await $('div[data-name="contact-filter-item-Status"]').click()
                await $('app-advanced-filter-label').waitForDisplayed({ timeout: 3000 })
                await $('label[data-name="task-contact-filter-label-hot"]').click()
                await $('button[data-action="task-filter-contact-status-label-apply"]').click()
                await $('app-advanced-filter-label').waitForDisplayed({ reverse: true })
                await delay(3000)
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('Status')
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText('Hot')
                await $('app-filter-options a > i.i-close').click()
                await delay(3000)
            })
            it('Status Exclusive', async () => {
                await $('div[data-name="contact-filter-item-Status"]').click()
                await $('app-advanced-filter-label').waitForDisplayed({ timeout: 3000 })
                await $('div[data-name="contact-filter-label-exclusive"]').click()
                await $('label[data-name="task-contact-filter-label-hot"]').click()
                await $('button[data-action="task-filter-contact-status-label-apply"]').click()
                await $('app-advanced-filter-label').waitForDisplayed({ reverse: true })
                await delay(3000)
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('Status')
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:nth-of-type(2)')).toHaveText('Excludes')
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText('Hot')
                await $('app-filter-options a > i.i-close').click()
                await delay(3000)
            })
        })
        describe('Tag', () => {
            it('Tag Inclusive', async () => {
                await $('div[data-name="contact-filter-item-Tag"]').click()
                await $('app-advanced-filter-tag').waitForDisplayed({ timeout: 3000 })
                await $('app-input-tag mat-form-field').click()
                await $(`div=${testTag}`).click()
                await $('button[data-action="tag-select-apply"]').click()
                await $('app-advanced-filter-tag').waitForDisplayed({ reverse: true })
                await delay(3000)
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('Tag')
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText(testTagText)
                await $('app-filter-options a > i.i-close').click()
                await delay(3000)
            })
            it('Tag Exclusive', async () => {
                await $('div[data-name="contact-filter-item-Tag"]').click()
                await $('app-advanced-filter-tag').waitForDisplayed({ timeout: 3000 })
                await $('div=Exclude').click()
                await $('app-input-tag mat-form-field').click()
                await $(`div=${testTag}`).click()
                await $('button[data-action="tag-select-apply"]').click()
                await $('app-advanced-filter-tag').waitForDisplayed({ reverse: true })
                await delay(3000)
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('Tag')
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:nth-of-type(2)')).toHaveText('Excludes')
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText(testTagText)
                await $('app-filter-options a > i.i-close').click()
                await delay(3000)
            })
        })
        describe('Source', () => {
            it('Source Inclusive', async () => {
                await $('div[data-name="contact-filter-item-Source"]').click()
                await $('app-advanced-filter-source').waitForDisplayed({ timeout: 3000 })
                await $('app-input-source mat-form-field').click()
                await $('div[data-name="no-source"]').click()
                await $('button[data-action="source-select-apply"]').click()
                await $('app-advanced-filter-source').waitForDisplayed({ reverse: true })
                await delay(3000)
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('Source')
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText('No Source')
                await $('app-filter-options a > i.i-close').click()
                await delay(3000)
            })
            it('Source Exclusive', async () => {
                await $('div[data-name="contact-filter-item-Source"]').click()
                await $('app-advanced-filter-source').waitForDisplayed({ timeout: 3000 })
                await $('div=Exclude').click()
                await $('app-input-source mat-form-field').click()
                await $('div[data-name="no-source"]').click()
                await $('button[data-action="source-select-apply"]').click()
                await $('app-advanced-filter-source').waitForDisplayed({ reverse: true })
                await delay(3000)
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('Source')
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:nth-of-type(2)')).toHaveText('Excludes')
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText('No Source')
                await $('app-filter-options a > i.i-close').click()
                await delay(3000)
            })
        })
        describe('Company', () => {
            it('Company Inclusive', async () => {
                await $('div[data-name="contact-filter-item-Company"]').click()
                await $('app-advanced-filter-company').waitForDisplayed({ timeout: 3000 })
                await $('app-input-company mat-form-field').click()
                await $('div[data-name="no-company"]').click()
                await $('button[data-action="company-select-apply"]').click()
                await $('app-advanced-filter-company').waitForDisplayed({ reverse: true })
                await delay(3000)
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('Company')
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText('')
                await $('app-filter-options a > i.i-close').click()
                await delay(3000)
            })
            it('Company Exclusive', async () => {
                await $('div[data-name="contact-filter-item-Company"]').click()
                await $('app-advanced-filter-company').waitForDisplayed({ timeout: 3000 })
                await $('div=Exclude').click()
                await $('app-input-company mat-form-field').click()
                await $('div[data-name="no-company"]').click()
                await $('button[data-action="company-select-apply"]').click()
                await $('app-advanced-filter-company').waitForDisplayed({ reverse: true })
                await delay(3000)
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('Company')
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:nth-of-type(2)')).toHaveText('Excludes')
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText('')
                await $('app-filter-options a > i.i-close').click()
                await delay(3000)
            })
        })
        describe('Unsubscribed', () => {
            it('Unsubscribed Inclusive', async () => {
                await $('div[data-name="contact-filter-item-Unsubscribed"]').click()
                await $('app-advanced-filter-unsubscribed').waitForDisplayed({ timeout: 3000 })
                await $('span=Email Unsubscribed').click()
                await $('app-advanced-filter-unsubscribed button.btn-primary').click()
                await $('app-advanced-filter-unsubscribed').waitForDisplayed({ reverse: true })
                await delay(3000)
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('Unsubscribed')
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText('Email')
                await $('app-filter-options a > i.i-close').click()
                await delay(3000)
            })
            it('Unsubscribed Exclusive', async () => {
                await $('div[data-name="contact-filter-item-Unsubscribed"]').click()
                await $('app-advanced-filter-unsubscribed').waitForDisplayed({ timeout: 3000 })
                await $('div=Exclude').click()
                await $('span=Email Unsubscribed').click()
                await $('app-advanced-filter-unsubscribed button.btn-primary').click()
                await $('app-advanced-filter-unsubscribed').waitForDisplayed({ reverse: true })
                await delay(3000)
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('Unsubscribed')
                // await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:nth-of-type(2)')).toHaveText('Excludes')
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText('Email')
                await $('app-filter-options a > i.i-close').click()
                await delay(3000)
            })
        })
        describe('Other', () => {
            it('Country', async () => {
                await $('div[data-name="contact-filter-item-Country"]').click()
                await $('app-advanced-filter-country').waitForDisplayed({ timeout: 3000 })
                await $('app-input-country').waitForClickable({ timeout: 3000 })
                await $('app-input-country').click()
                await $('body app-root > div.cdk-overlay-container div.cdk-overlay-connected-position-bounding-box div.mat-autocomplete-panel > mat-option:first-of-type div.info').waitForClickable({ timeout: 3000 })            
                await $('body app-root > div.cdk-overlay-container div.cdk-overlay-connected-position-bounding-box div.mat-autocomplete-panel > mat-option:first-of-type div.info').click()            
                await delay(2000)
                await $('app-advanced-filter-country button').click()
                await $('app-advanced-filter-country').waitForDisplayed({ reverse: true })
                await delay(3000)
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('Country')
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText('US')
                await $('app-filter-options a > i.i-close').click()
                await delay(3000)
            })
            it('State', async () => {
                await $('div[data-name="contact-filter-item-State"]').click()
                await $('app-advanced-filter-state').waitForDisplayed({ timeout: 3000 })
                await $('app-input-state').waitForClickable({ timeout: 3000 })
                await $('app-input-state').click()
                await $('body app-root > div.cdk-overlay-container div.cdk-overlay-connected-position-bounding-box div.mat-autocomplete-panel > mat-option:first-of-type div.info').waitForClickable({ timeout: 3000 })            
                await $('body app-root > div.cdk-overlay-container div.cdk-overlay-connected-position-bounding-box div.mat-autocomplete-panel > mat-option:first-of-type div.info').click()            
                await delay(2000)
                await $('button[data-action="state-select-apply"]').click()
                await $('app-advanced-filter-state').waitForDisplayed({ reverse: true })
                await delay(3000)
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('State')
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText('Alabama')
                await $('app-filter-options a > i.i-close').click()
                await delay(3000)
            })
            it('City', async () => {
                await $('div[data-name="contact-filter-item-City"]').click()
                await $('app-advanced-filter-city').waitForDisplayed({ timeout: 3000 })
                await $('app-advanced-filter-city input[name="city"]').setValue('Madrid')
                await $('button[data-action="contact-filter-city-apply"]').click()
                await $('app-advanced-filter-city').waitForDisplayed({ reverse: true })
                await delay(3000)
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('City')
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText('Madrid')
                await $('app-filter-options a > i.i-close').click()
                await delay(3000)
            })
            it('Zipcode', async () => {
                await $('div[data-name="contact-filter-item-Zipcode"]').click()
                await $('app-advanced-filter-zipcode').waitForDisplayed({ timeout: 3000 })
                await $('app-advanced-filter-zipcode input[data-name="input-zipcode"]').setValue('12345')
                await $('button[data-action="zipcode-select-apply"]').click()
                await $('app-advanced-filter-zipcode').waitForDisplayed({ reverse: true })
                await delay(3000)
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('Zipcode')
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText('12345')
                await $('app-filter-options a > i.i-close').click()
                await delay(3000)
            })
            it('Assigned To', async () => {
                await $('div[data-name="contact-filter-item-Assigned To"]').click()
                await $('app-advanced-filter-assignee').waitForDisplayed({ timeout: 3000 })
                await $('app-input-assignee mat-checkbox:nth-of-type(2) label').click();
                await $('app-advanced-filter-assignee button.btn-primary').click()
                await $('app-advanced-filter-assignee').waitForDisplayed({ reverse: true })
                await delay(3000)
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('Assignee')
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText('joe james')
                await $('app-filter-options a > i.i-close').click()
                await delay(3000)
            })
            it('Custom Field', async () => {
                await $('span=Add Custom Fields').click()
                await $(`span=${testCustomField}`).click()
                await $('app-advanced-filter-custom-field').waitForDisplayed({ timeout: 3000 })
                await $('app-advanced-filter-custom-field input[name="custome_input"]').setValue('Football');
                await $('app-advanced-filter-custom-field button.btn-primary').click()
                await $('app-advanced-filter-custom-field').waitForDisplayed({ reverse: true })
                await delay(3000)
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText(testCustomField)
                await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText('Football')
                await $('app-filter-options a > i.i-close').click()
                await delay(3000)
            })
        })
    })
    
    describe('Change assignee', () => {
        it('Change assignee', async () => {
            await $('button[data-action="create-new-contact"]').scrollIntoView()
            await $('div[data-name="contacts-edit-column"]').click()
            await $('app-column-edit').waitForDisplayed({ timeout: 3000 })
            await $('div[data-name="column-item-Assignee"] label div').click()
            await $('button[data-action="edit-column-apply"]').click()
            await $('app-column-edit').waitForDisplayed({ reverse: true })
            await delay(5000)
            testingContactElement = await $('span=' + testingContact)
            await testingContactElement.waitForDisplayed()
            if(testingContactElement) {
                await delay(3000)
                const testingContactTr = await browser.custom$('closest', testingContactElement)
                await testingContactTr.$('td app-assignee-select').scrollIntoView()
                await testingContactTr.$('td app-assignee-select').click()
                await $('div.mat-autocomplete-panel.form-label-panel mat-option:last-of-type').click()
                await delay(3000)
                await expect(testingContactTr.$('td app-assignee-select div.avartar-icon div.contact-avatar')).toHaveText('jj')
            }
        })
    })
    
    describe('Sorted By', () => {
        const sort_types = ['Alphabetical Z-A', 'Last added', 'Last activity', 'Alphabetical A-Z'];
        for(const sort of sort_types){
            it(sort, async () => {
                await $('button[data-action="create-new-contact"]').scrollIntoView()
                await $('span[data-name="contact-sortby"]').click()
                await $(`div[data-name="contact-sortby-${sort}"]`).click()
                await delay(3000)
                await expect($('span[data-name="contact-sortby"]')).toHaveText(sort === 'Alphabetical A-Z' ? 'Sort by' : sort)
            })
        }
    })
    
    describe('Change status', () => {
        it('Change status', async () => {
            await $('button[data-action="create-new-contact"]').scrollIntoView()
            testingContactElement = await $('span=' + testingContact)
            await testingContactElement.waitForExist()
            if(testingContactElement) {
                await delay(3000)
                const testingContactTr = await browser.custom$('closest', testingContactElement)
                await testingContactTr.$('td.mat-column-contact_label mat-form-field[data-name="contact-label-select"]').scrollIntoView()
                await testingContactTr.$('td.mat-column-contact_label mat-form-field[data-name="contact-label-select"]').click()
                await delay(3000)
            }
            await $(`mat-option[data-name="contact-label-${testStatus}"]`).waitForClickable({ timeout: 3000 })
            await $(`mat-option[data-name="contact-label-${testStatus}"]`).click()
            await goToPage('contacts')
            testingContactElement = await $('span=' + testingContact)
            await testingContactElement.waitForExist()
            if(testingContactElement) {
                await delay(3000)
                const testingContactTr = await browser.custom$('closest', testingContactElement)
                await testingContactTr.$('td.mat-column-contact_label span.label-name').scrollIntoView()
                await expect(testingContactTr.$('td.mat-column-contact_label span.label-name')).toHaveText(testStatusText)
            }
        })
    })
    
    describe('Edit Columns', () => {
        it('Add Column', async () => {
            await $('div[data-name="contacts-edit-column"]').click()
            await $('app-column-edit').waitForDisplayed({ timeout: 3000 })
            await $('div[data-name="column-item-Company"] label div').scrollIntoView()
            await $('div[data-name="column-item-Company"] label div').click()
            await $('button[data-action="edit-column-apply"]').click()
            await $('app-column-edit').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('th.mat-column-company')).toExist();
        })
        it('Remove Column', async () => {
            await $('div[data-name="contacts-edit-column"]').click()
            await $('app-column-edit').waitForDisplayed({ timeout: 3000 })
            await $('div[data-name="column-item-Company"] label div').scrollIntoView()
            await $('div[data-name="column-item-Company"] label div').click()
            await $('button[data-action="edit-column-apply"]').click()
            await $('app-column-edit').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('th.mat-column-company')).not.toExist();
        })
    })
    
    describe('Import CSV', () => {
        it('import', async () => {
            await $('app-contacts input[aria-label="search"]').setValue("Lionel Messi");
            await delay(5000)
            const messi = await $('span=Lionel Messi').isDisplayed()
            if(messi) {
                const messiElement = await $('span=Lionel Messi')
                const messiTr = await browser.custom$('closest', messiElement)
                await browser.execute(ele => {
                    ele.querySelector('input[type="checkbox"]').click();
                }, messiTr)
                await $('div[data-name="material-action-item-More"]').waitForClickable({ timeout: 3000 })
                await $('div[data-name="material-action-item-More"]').click()
                await $('div[data-name="material-action-item-More-Delete"]').click()
                await $('app-confirm').waitForDisplayed({ timeout: 3000 })
                await $('app-confirm').$('button=Delete').click()
                await delay(3000)
            }
            await $('button[data-action="import-contact"]').click()
            await $('div[data-name="import-contact-csv"]').click()
            const fileUpload = await $('app-upload-contacts div.upload-input-area input[type="file"]')
            const filePath = await path.join(__dirname, '../../assets/contact/contact1.csv')
            await fileUpload.addValue(filePath)
            await $('button[data-action="contact-upload-next"]').waitForClickable({ timeout: 3000 })
            await $('button[data-action="contact-upload-next"]').click()
            await $('button[data-action="contact-import-save-continue"]').click()
            await $('button[data-action="import-contact-upload"]').click()
            await $('app-upload-imported-contacts').waitForDisplayed({ timeout: 5000 })
            await $('button[data-action="contact-import-back-to-crmgrow"]').click()
            await delay(3000)
            await expect($('span=Lionel Messi')).toBeDisplayed()
            await $('app-contacts div.search-form i.i-close').click();
            await delay(2000)
        })
    })
    
    describe('Select some contacts', () => {
        beforeEach(async () => {
            await goToPage('contacts');            
            testingContactElement = await $('span=' + testingContact)
            await testingContactElement.waitForExist()
            if(testingContactElement) {
                await delay(3000)
                await selectContact(testingContact)
            }
            await delay(3000)
        })
        describe('New Task', () => {
            it('Create', async () => {
                await $('div[data-name="material-action-item-New Task"]').click()
                await $('app-task-create').waitForDisplayed({ timeout: 3000 })
                await $('div[data-name="task-type-general"]').click()
                await $('input[name="content"]').setValue('To Do Task')
                // Date Time
                await $('input[data-name="task-date-picker"]').click()
                await browser.waitUntil(async () => {
                    await $('div.calendar-time div.calendar-controls i.i-chev-right').click()
                    const text = await $('div.calendar-time div.date span').getText()
                    return text === "January 2026" || text === "January 2027"
                })
                await $('mwl-calendar-month-view div.cal-days > div:nth-of-type(2) mwl-calendar-month-cell:nth-of-type(2) span.cal-day-number').click()
                await $('mat-select[data-name="task-time-select"]').click() 
                await $('div.cdk-overlay-container div.cdk-overlay-connected-position-bounding-box').$('span=10:00 AM').click()
                // Timezone
                await $('app-select-timezone div.dropdown-toggle').click()
                await $('span[data-name="task-timezone-select-Eastern Time"]').click()
                await $('button[data-action="new-task-create"]').click()
                await $('app-task-create').waitForDisplayed({ reverse: true })
                await delay(3000)
                testingContactElement = await $('span=' + testingContact)
                await testingContactElement.waitForExist()
                if(testingContactElement) {
                    await delay(3000)
                    const testingContactTr = await browser.custom$('closest', testingContactElement)
                    await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').scrollIntoView()
                    await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').click()
                }
                await delay(5000)
                await $('app-contact-main-info-v2').$('span=Back to Contacts').scrollIntoView()
                await $('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type i.i-arrow-down').click()
                await delay(3000)
                await expect($('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type app-data-list div.contact-data-task:first-of-type').$('div=To Do Task')).toExist()
                await $('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type app-data-list div.contact-data-task:first-of-type i.i-menu-more').click()
                await $('body > div.dropdown').$('span=Delete').click()
                await $('button[data-action="confirm-downgrade"]').click()
                await delay(3000)
            })
            it('All Day', async () => {
                await $('div[data-name="material-action-item-New Task"]').click()
                await $('app-task-create').waitForDisplayed({ timeout: 3000 })
                await $('div[data-name="task-type-general"]').click()
                await $('input[name="content"]').setValue('To Do Task')
                // Date Time
                await $('input[data-name="task-date-picker"]').click()
                await browser.waitUntil(async () => {
                    await $('div.calendar-time div.calendar-controls i.i-chev-right').click()
                    const text = await $('div.calendar-time div.date span').getText()
                    return text === "January 2026" || text === "January 2027"
                })
                await $('mwl-calendar-month-view div.cal-days > div:nth-of-type(2) mwl-calendar-month-cell:nth-of-type(2) span.cal-day-number').click()
                await $('mat-select[data-name="task-time-select"]').click() 
                await $('div.cdk-overlay-container div.cdk-overlay-connected-position-bounding-box').$('span=10:00 AM').click()
                // Timezone
                await $('app-select-timezone div.dropdown-toggle').click()
                await $('span[data-name="task-timezone-select-Eastern Time"]').click()
                await $('label[data-name="all_day_tc"]').click()
                await $('button[data-action="new-task-create"]').click()
                await $('app-task-create').waitForDisplayed({ reverse: true })
                await delay(3000)
                testingContactElement = await $('span=' + testingContact)
                await testingContactElement.waitForExist()
                if(testingContactElement) {
                    await delay(3000)
                    const testingContactTr = await browser.custom$('closest', testingContactElement)
                    await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').click()
                }
                await delay(5000)
                await $('app-contact-main-info-v2').$('span=Back to Contacts').scrollIntoView()
                await $('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type i.i-arrow-down').click()
                await delay(3000)
                await expect($('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type app-data-list div.contact-data-task:first-of-type').$('div=To Do Task')).toExist()
                await $('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type app-data-list div.contact-data-task:first-of-type i.i-menu-more').click()
                await $('body > div.dropdown').$('span=Delete').click()
                await $('button[data-action="confirm-downgrade"]').click()
                await delay(3000)
            })
        })
        describe('New Email', () => {
            it('Send', async () => {
                await $('div[data-name="material-action-item-New Email"]').click()
                await $('app-send-email').waitForDisplayed({ timeout: 3000 })
                await delay(3000)
                await $('input[data-name="deal-send-email-subject"]').setValue('To Send Email')
                await delay(3000)
                // if(!isVortex) {
                //     await browser.execute((text) => {
                //         document.querySelector('quill-editor[data-name="deal-action-description"] .ql-editor > div').innerHTML = text;
                //     }, '<div>How are you?</div>');
                // } else {
                //     await browser.execute((text) => {
                //         document.querySelector('quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
                //     }, 'How are you?');
                // }
                await browser.execute((text) => {
                    document.querySelector('app-send-email quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
                }, 'How are you?');
                await delay(3000)
                await $('button[data-action="deal-email-send"]').click()
                await delay(3000)
                const businessHourDialog = await $('app-confirm-business-hour').isDisplayed()
                if(businessHourDialog) {
                    await $('app-confirm-business-hour').$('label=I understand. Do not show it again.').click()
                    await $('app-confirm-business-hour').$('button=Ok').click()
                }
                await delay(3000)
                await $('app-send-email').waitForDisplayed({ reverse: true })
                await delay(3000)
                await goToPage('contacts')
                testingContactElement = await $('span=' + testingContact)
                await testingContactElement.waitForExist()
                if(testingContactElement) {
                    await delay(3000)
                    const testingContactTr = await browser.custom$('closest', testingContactElement)
                    await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').scrollIntoView()
                    await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').click()
                }
                await delay(5000)
                await $('app-contact-main-info-v2').$('span=Back to Contacts').scrollIntoView()
                await $('span[data-name="deal-tab-item-Emails"]').click()
                await expect($('app-contact-action-list app-contact-activity-super-item:first-of-type div.subject')).toHaveText('To Send Email')
            })
            it('Schedule', async () => {
                await $('div[data-name="material-action-item-New Email"]').click()
                await $('app-send-email').waitForDisplayed({ timeout: 3000 })
                await delay(3000)
                await $('input[data-name="deal-send-email-subject"]').setValue('To Schedule Email')
                await delay(3000)
                // if(!isVortex) {
                //     await browser.execute((text) => {
                //         document.querySelector('quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
                //     }, '<div>How are you?</div>');
                // } else {
                //     await browser.execute((text) => {
                //         document.querySelector('quill-editor[data-name="deal-action-description"] .ql-editor > div').innerHTML = text;
                //     }, 'How are you?');
                // }
                await browser.execute((text) => {
                    document.querySelector('app-send-email quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
                }, 'How are you?');
                await delay(3000)
                await $('i.i-schedule-send').click()
                await delay(3000)
                await $('tr[data-name="schedule-time-select-2"]').click()
                await delay(3000)
                await $('button[data-action="contact-item-schedule"]').click()
                await delay(3000)
                await $('app-send-email').waitForDisplayed({ reverse: true })
                await delay(3000)
                await goToPage('contacts')
                testingContactElement = await $('span=' + testingContact)
                await testingContactElement.waitForExist()
                if(testingContactElement) {
                    await delay(3000)
                    const testingContactTr = await browser.custom$('closest', testingContactElement)
                    await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').scrollIntoView()
                    await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').click()
                }
                await delay(5000)
                await $('app-contact-main-info-v2').$('span=Back to Contacts').scrollIntoView()
                await $('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type i.i-arrow-down').click()
                await delay(3000)
                await expect($('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type app-task-list div.px-3:first-of-type').$('span*=To Schedule Email')).toExist()
            })
        })
        describe('New Note', () => {
            it('New Note', async () => {
                await $('div[data-name="material-action-item-New Note"]').click()
                await $('app-note-create').waitForDisplayed({ timeout: 3000 })
                await delay(2000)
                if(!isVortex) {
                    await browser.execute((text) => {
                        document.querySelector('app-note-create quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
                    }, '<div>I added a note</div>');
                } else {
                    await browser.execute((text) => {
                        document.querySelector('app-note-create quill-editor[data-name="deal-action-description"] .ql-editor > div').innerHTML = text;
                    }, 'I added a note');
                }
                await delay(3000)
                await $('button[data-action="deal-note-create"]').click()
                await $('app-note-create').waitForDisplayed({ reverse: true })
                await goToPage('contacts')
                testingContactElement = await $('span=' + testingContact)
                await testingContactElement.waitForExist()
                if(testingContactElement) {
                    await delay(3000)
                    const testingContactTr = await browser.custom$('closest', testingContactElement)
                    await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').scrollIntoView()
                    await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').click()
                }
                await delay(5000)
                await $('app-contact-main-info-v2').$('span=Back to Contacts').scrollIntoView()
                await $('span[data-name="deal-tab-item-Notes"]').click()
                await expect($('app-contact-action-list app-contact-activity-super-item:first-of-type span.note-content > div:first-of-type')).toHaveText('I added a note')
            })
        })
        describe('New Meeting', () => {
            it('Create', async () => {
                await $('div[data-name="material-action-item-More"]').click()
                await $('div[data-name="material-action-item-More-New Meeting"]').click()
                await $('app-calendar-event-dialog').waitForDisplayed({ timeout: 3000 })
                await $('input[data-name="deal-meeting-title"]').setValue('Good Meeting')
                await $('app-select-calendar div.dropdown-toggle').click()
                await $('span=test5052').click()
                await $('select[data-name="deal-time-select"]').selectByVisibleText('10:00 AM')
                await $('app-select-timezone div.dropdown-toggle').click()
                await $('span[data-name="task-timezone-select-Eastern Time"]').click()
                await $('input[name="address"]').setValue('Paris')
                if(!isVortex) {
                    await browser.execute((text) => {
                        document.querySelector('app-calendar-event-dialog quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
                    }, '<div>Congratulations!</div>');
                } else {
                    await browser.execute((text) => {
                        document.querySelector('app-calendar-event-dialog quill-editor[data-name="deal-action-description"] .ql-editor > div').innerHTML = text;
                    }, 'Congratulations!');
                }
                await delay(1000);
                await $('button[data-action="deal-action-create"]').click()
                await $('app-calendar-event-dialog').waitForDisplayed({ reverse: true })
                await delay(5000)
                await goToPage('contacts')
                testingContactElement = await $('span=' + testingContact)
                await testingContactElement.waitForExist()
                if(testingContactElement) {
                    await delay(3000)
                    const testingContactTr = await browser.custom$('closest', testingContactElement)
                    await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').scrollIntoView()
                    await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').click()
                }
                await delay(5000)
                await $('app-contact-main-info-v2').$('span=Back to Contacts').scrollIntoView()
                await $('app-contact-data-list-container div.data-sections-container div.accordion-item:nth-of-type(4) i.i-arrow-down').click()
                await delay(3000)
                await expect($('app-contact-data-list-container div.data-sections-container div.accordion-item:nth-of-type(4) app-data-list div.contact-data-appointment:first-of-type').$('div=Good Meeting')).toExist()
                await $('app-contact-data-list-container div.data-sections-container div.accordion-item:nth-of-type(4) app-data-list div.contact-data-appointment:first-of-type i.i-menu-more').click()
                await $('body > div.dropdown').$('span=Remove').click()
                await $('button[data-action="confirm-downgrade"]').click()
                await delay(3000)
            })
            it('All Day', async () => {
                await $('div[data-name="material-action-item-More"]').click()
                await $('div[data-name="material-action-item-More-New Meeting"]').click()
                await $('app-calendar-event-dialog').waitForDisplayed({ timeout: 3000 })
                await $('input[data-name="deal-meeting-title"]').setValue('Good Meeting')
                await $('app-select-calendar div.dropdown-toggle').click()
                await $('span=test5052').click()
                await $('select[data-name="deal-time-select"]').selectByVisibleText('10:00 AM')
                await $('app-select-timezone div.dropdown-toggle').click()
                await $('span[data-name="task-timezone-select-Eastern Time"]').click()
                await $('label[for="customControlInline"]').click()
                await $('input[name="address"]').setValue('Paris')
                if(!isVortex) { 
                    await browser.execute((text) => {
                        document.querySelector('app-calendar-event-dialog quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
                    }, '<div>Congratulations!</div>');
                } else {
                    await browser.execute((text) => {
                        document.querySelector('app-calendar-event-dialog quill-editor[data-name="deal-action-description"] .ql-editor > div').innerHTML = text;
                    }, 'Congratulations!');
                }
                await $('button[data-action="deal-action-create"]').click()
                await $('app-calendar-event-dialog').waitForDisplayed({ reverse: true })
                await delay(5000)
                await goToPage('contacts')
                testingContactElement = await $('span=' + testingContact)
                await testingContactElement.waitForExist()
                if(testingContactElement) {
                    await delay(3000)
                    const testingContactTr = await browser.custom$('closest', testingContactElement)
                    await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').scrollIntoView()
                    await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').click()
                }
                await delay(5000)
                await $('app-contact-main-info-v2').$('span=Back to Contacts').scrollIntoView()
                await $('app-contact-data-list-container div.data-sections-container div.accordion-item:nth-of-type(4) i.i-arrow-down').click()
                await delay(3000)
                await expect($('app-contact-data-list-container div.data-sections-container div.accordion-item:nth-of-type(4) app-data-list div.contact-data-appointment:first-of-type').$('div=Good Meeting')).toExist()
                await $('app-contact-data-list-container div.data-sections-container div.accordion-item:nth-of-type(4) app-data-list div.contact-data-appointment:first-of-type i.i-menu-more').click()
                await $('body > div.dropdown').$('span=Remove').click()
                await $('button[data-action="confirm-downgrade"]').click()
                await delay(3000)
            })
        })
        describe('Assign To', () => {
            it('Assign To', async () => {
                await $('div[data-name="material-action-item-More"]').click()
                await $('div[data-name="material-action-item-More-Assign To"]').click()
                await $('app-assignment-dialog').waitForDisplayed({ timeout: 3000 })
                await $('app-assignment-dialog mat-form-field').click()
                await $('div.mat-autocomplete-panel.form-label-panel mat-option:last-of-type').click()
                await delay(2000)
                await $('button[data-action="assign-btn"]').click()
                await $('app-assignment-dialog').waitForDisplayed({ reverse: true })
                await delay(2000)
                await goToPage('contacts')
                testingContactElement = await $('span=' + testingContact)
                await testingContactElement.waitForExist()
                if(testingContactElement) {
                    selectContact(testingContact);
                    await delay(3000)
                    const testingContactTr = await browser.custom$('closest', testingContactElement)
                    await expect(testingContactTr.$('td app-assignee-select div.avartar-icon div.contact-avatar')).toHaveText('jj')
                }
            })
        })
    })
    
    describe('Select All and Deselect', () => {
        it('Select All', async () => {
            const firstContactSelect = await $('app-contacts table tbody tr:first-of-type td.mat-column-select')
            await browser.execute(ele => {
                ele.querySelector('input[type="checkbox"]').click();
            }, firstContactSelect)
            await $('div[data-name="material-action-item-More"]').click()
            await $('div[data-name="material-action-item-More-Select all"]').click()
            await delay(6000)
            await expect($('table tbody tr:last-of-type td.mat-column-select input[type="checkbox"]')).toBeChecked()
            await delay(2000)
        })
        it('Deselect', async () => {
            const moreDisplay = await $('div[data-name="material-action-item-More-Deselect"]').isDisplayed()
            if(!moreDisplay) await $('div[data-name="material-action-item-More"]').click()
            await $('div[data-name="material-action-item-More-Deselect"]').click()
            await delay(2000)
            await expect($('table tbody tr:first-of-type td.mat-column-select input[type="checkbox"]')).not.toBeChecked()
            await expect($('table tbody tr:last-of-type td.mat-column-select input[type="checkbox"]')).not.toBeChecked()
        })
    })
})

