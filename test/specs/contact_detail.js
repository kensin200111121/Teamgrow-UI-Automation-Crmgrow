
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
const testFirstName = '0Testing';
const testLastName = 'Contact';
const testAssignee = 'joe james';
const testCompany = 'Test Company';
const testWebsite = 'https://test6.com';
const testSource = 'test source';
const testAddress = {
    address: '123 st',
    country: 'US',
    city: 'town',
    state: 'Alabama',
    zip: 1234,
    fullAddress: '123 st town Alabama US 1234'
};
const testBirthday = {
    year: 2000,
    month: 1,
    day: 12,
    fullBirthday: '01/12/2000'
};
const testCustomFieldValue = 'custom-value';
const testMergeContact = '0a test';
const testMergeContactFirstname = '0a';
const testMergeContactLastname = 'test';

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

describe('Test Data Setup', () => {
    before (async () => {
        await goToPage('contacts');
        await delay(3000)
    });
    it('Add Testing Contact', async () => {
        testingContactElement = await $('span=' + testingContact)
        const exists = await testingContactElement.isExisting()
        await delay(3000)
        if(exists) {
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
        await $('input[data-name="contact-create-firstname"]').setValue(testFirstName)
        await $('input[data-name="contact-create-lastname"]').setValue(testLastName)
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
    it('Add Test Merge Contact', async () => {
        testingContactElement = await $('span=' + testMergeContact)
        const exists = await testingContactElement.isExisting()
        await delay(3000)
        if(exists) {
            await selectContact(testMergeContact)
            await $('div[data-name="material-action-item-More"]').waitForClickable({ timeout: 2000 })
            await $('div[data-name="material-action-item-More"]').click()
            await $('div[data-name="material-action-item-More-Delete"]').click()
            await $('button[data-action="confirm-downgrade"]').click()
            await delay(5000)
        }
        await $('button[data-action="create-new-contact"]').waitForClickable({ timeout: 10000 })
        await $('button[data-action="create-new-contact"]').click()
        await delay(5000)
        await $('input[data-name="contact-create-firstname"]').setValue(testMergeContactFirstname)
        await $('input[data-name="contact-create-lastname"]').setValue(testMergeContactLastname)
        await delay(2000)
        await $('button[data-action="create-contact-add-btn"]').waitForClickable({ timeout: 3000 })
        await $('button[data-action="create-contact-add-btn"]').click()
        await $('app-contact-create-edit').waitForDisplayed({ reverse: true })
        await delay(5000)
        testingContactElement = await $('span=' + testMergeContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await expect(testingContactTr.$('td.mat-column-contact_name span')).toHaveText(testMergeContact)
        }
    })
})

describe('Contact Detail', async () => {
    before (async () => {
        await goToPage('contacts');
        await delay(3000)
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').scrollIntoView()
            await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').click()
            await delay(3000)
        }
    });
    describe('Change in Card Header', () => {
        it('Change Label', async () => {
            await $('app-label-select mat-form-field[data-name="contact-label-select"]').click()
            await $(`mat-option[data-name="contact-label-${testStatus}"]`).click()
            await delay(3000)
            await expect($('div.card-header').$(`span=${testStatus}`)).toExist()
        })
        it('Change Assignee', async () => {
            await $('app-assignee-select mat-form-field').click()
            await $('div.form-label-panel').$(`span=${testAssignee}`).click()
            await delay(3000)
            await expect($('app-assignee-select div.empty-avatar')).not.toExist()
        })
    })
    describe('Edit Contact Form', () => {
        beforeEach (async () => {
            await delay(3000)
            await $('app-contact-main-info-v2').$('span=Back to Contacts').scrollIntoView()
            await $('span=Edit contact').click()
            await $('app-contact-create-edit').waitForDisplayed({ timeout: 3000 })
            await delay(2000)
        });
        it('Update Name', async () => { 
            await $('app-contact-create-edit input[data-name="contact-create-lastname"]').setValue(testLastName)
            await $('app-contact-create-edit input[data-name="contact-create-firstname"]').setValue(testFirstName)
            await delay(3000)
            await $('button[data-action="create-contact-add-btn"]').click()
            await delay(3000)
            await $('app-contact-create-edit').waitForDisplayed({ reverse: true })
            await expect($('div.card-body span.full-name')).toHaveText(testingContact)
        })
        it('Create and Change Label', async () => {
            await $('app-contact-create-edit').$('mat-form-field[data-name="contact-label-select"]').click()
            await $('span=Create Status').click()
            await $('app-manage-label').waitForDisplayed({ timeout: 3000 })
            await delay(3000)
            let testStatusElement = await $('app-manage-label').$('span=' + testStatus)
            const exists = await testStatusElement.isExisting()
            if(exists) {
                await testStatusElement.parentElement().parentElement().$('span=Remove').click();
                await $('app-confirm button[data-action="confirm-downgrade"]').click();
                await delay(2000)
            }
            await $('input[name="edit_label_name"]').setValue(testStatus)
            await delay(3000)
            await $('mat-drawer app-manage-label button.color-picker-button').click()
            await $('app-label-edit-color').waitForDisplayed({ timeout: 5000 })
            await $('app-label-edit-color color-swatches div.swatches-body color-swatches-group:first-of-type color-swatches-color:first-of-type div.swatch').click()
            await $('button=Apply').click()
            await delay(3000)
            await $('button.save-btn').click()
            await delay(5000)
            await $('button[data-action="label-manage-close"]').click()
            await $('app-manage-label').waitForDisplayed({ reverse: true })
            await $('app-contact-create-edit').$('mat-form-field[data-name="contact-label-select"]').click()
            await delay(3000)
            await $(`mat-option[data-name="contact-label-${testStatus}"]`).click()
            await delay(3000)
            await $('button[data-action="create-contact-add-btn"]').click()
            await delay(3000)
            await $('app-contact-create-edit').waitForDisplayed({ reverse: true })
            await expect($('div.card-header').$(`span=${testStatus}`)).toExist()
        })
        it('Update Phone number', async () => {
            await $('app-contact-create-edit app-phone-input input[data-name="add-user-phone"]').setValue(testingPhone)
            await delay(3000)
            await $('button[data-action="create-contact-add-btn"]').click()
            await $('app-contact-edit').waitForDisplayed({ reverse: true })
            await delay(5000)
            await expect($(`span=+1${testingPhone}`)).toBeDisplayed()
        })
        it('Update Email Address', async () => {
            await $('app-contact-create-edit input[data-name="contact-create-email"]').setValue(testingEmail)
            await delay(3000)
            await $('button[data-action="create-contact-add-btn"]').click()
            await $('app-contact-create-edit').waitForDisplayed({ reverse: true })
            await delay(5000)
            await expect($(`span=${testingEmail}`)).toBeDisplayed()
        })
        it('Update Address', async () => {
            if (await $('app-contact-create-edit #address_cc_').isExisting() == false) {
                await $('app-contact-create-edit').$('span*=Address').click()
            }
            await $('app-contact-create-edit #address_cc_').waitForExist(3000);
            await $('app-contact-create-edit input[name="address"]').setValue(testAddress.address)
            await $('app-contact-create-edit select[name="country"]').click()
            await $(`app-contact-create-edit select[name="country"] option[value="${testAddress.country}"]`).click()
            await $('app-contact-create-edit input[name="city_cc"]').setValue(testAddress.city)
            await $('app-contact-create-edit select[name="state"]').click()
            await $(`app-contact-create-edit select[name="state"] option[value="${testAddress.state}"]`).click()
            await $('app-contact-create-edit input[name="zip"]').setValue(testAddress.zip)
            await delay(3000)
            await $('button[data-action="create-contact-add-btn"]').click()
            await $('app-contact-create-edit').waitForDisplayed({ reverse: true })
            await delay(5000)
            await expect($(`span=${testAddress.fullAddress}`)).toBeDisplayed()
        })
        it('Update Company', async () => {
            if (await $('app-contact-create-edit #company_cc').isExisting() == false) {
                const testElement = $('app-contact-create-edit').$('span*=Company');
                await testElement.scrollIntoView();
                await testElement.click()
            }
            await $('app-contact-create-edit #company_cc').waitForExist(3000);
            await $('app-contact-create-edit input[name="company_cc"]').setValue(testCompany)
            await delay(3000)
            await $('button[data-action="create-contact-add-btn"]').click()
            await $('app-contact-create-edit').waitForDisplayed({ reverse: true })
            await delay(5000)
            await expect($(`span=${testCompany}`)).toBeDisplayed()
        })
        it('Update Website', async () => {
            if (await $('app-contact-create-edit #website_cc').isExisting() == false) {
                const testElement = $('app-contact-create-edit').$('span*=Website');
                await testElement.scrollIntoView();
                await testElement.click()
            }
            await $('app-contact-create-edit #website_cc').waitForExist(3000);
            await $('app-contact-create-edit input[name="website_cc"]').setValue(testWebsite)
            await delay(3000)
            await $('button[data-action="create-contact-add-btn"]').click()
            await $('app-contact-create-edit').waitForDisplayed({ reverse: true })
            await delay(5000)
            await expect($(`span=${testWebsite}`)).toBeDisplayed()
        })
        it('Update Source', async () => {
            if (await $('app-contact-create-edit #source_cc').isExisting() == false) {
                const testElement = $('app-contact-create-edit').$('span*=Source');
                await testElement.scrollIntoView();
                await testElement.click()
            }
            await $('app-contact-create-edit #source_cc').waitForExist(3000);
            await $('app-contact-create-edit input[name="source"]').setValue(testSource)
            await delay(3000)
            await $('button[data-action="create-contact-add-btn"]').click()
            await $('app-contact-create-edit').waitForDisplayed({ reverse: true })
            await delay(5000)
            await expect($(`span=${testSource}`)).toBeDisplayed()
        })
        it('Update Birthday', async () => {
            if (await $('app-contact-create-edit #year_cc').isExisting() == false) {
                const testElement = $('app-contact-create-edit').$('span*=Birthday');
                await testElement.scrollIntoView();
                await testElement.click()
            }
            await $('app-contact-create-edit #year_cc').waitForExist(3000);
            await $('app-contact-create-edit input[name="year"]').setValue(testBirthday.year)
            await $('app-contact-create-edit select[name="month"]').click()
            await $(`app-contact-create-edit select[name="month"] option[value="${testBirthday.month}"]`).click()
            await $('app-contact-create-edit input[name="day"]').setValue(testBirthday.day)
            await delay(3000)
            await $('button[data-action="create-contact-add-btn"]').click()
            await $('app-contact-create-edit').waitForDisplayed({ reverse: true })
            await delay(5000)
            await expect($(`span=${testBirthday.fullBirthday}`)).toBeDisplayed()
        })
        it('Add tags', async () => {
            const tagNotExist = await $('app-contact-create-edit i.i-tag-plus').isDisplayed()
            if(tagNotExist) {
                await $('app-contact-create-edit i.i-tag-plus').click()
                await $('app-contact-create-edit app-contact-input-tag mat-form-field[data-name="contact-tag-select"]').click()
                await delay(2000)
                await $('app-contact-create-edit app-contact-input-tag mat-form-field[data-name="contact-tag-select"] input').setValue('Testing Tag')
                await $('div.cdk-overlay-container').$('div=testing tag').click()
                await $('button[data-action="create-contact-add-btn"]').click()
                await $('app-contact-create-edit').waitForDisplayed({ reverse: true })
                await delay(3000)
                await expect($('div.card-body span.tag-el')).toHaveText('Testing Tag')
            }
        })
        it('Remove tags', async () => {
            await $('app-contact-create-edit app-contact-input-tag mat-chip-list mat-basic-chip:first-of-type div.mat-chip-remove').click()
            await delay(2000)
            await $('button[data-action="create-contact-add-btn"]').click()
            await $('app-contact-create-edit').waitForDisplayed({ reverse: true })
            await $('span=Edit contact').click()
            await $('app-contact-create-edit').waitForDisplayed({ timeout: 3000 })
            await delay(2000)
            await expect($('app-contact-create-edit i.i-tag-plus')).toBeDisplayed()
            await delay(2000)
            await $('app-contact-create-edit').$('button=Cancel').click()
            await $('app-contact-create-edit').waitForDisplayed({ reverse: true })
            await delay(3000)
        })
        it('Update Custom Field', async () => {
            const label = await $(`label=${testCustomField}`);
            await label.waitForExist();
            await label.scrollIntoView();
            await label.parentElement().$('input').setValue(testCustomFieldValue);
            await delay(2000)
            await $('button[data-action="create-contact-add-btn"]').click()
            await $('app-contact-create-edit').waitForDisplayed({ reverse: true })
            await delay(5000)
            await expect($(`span=${testCustomFieldValue}`)).toExist()
        })
    })
    describe('More', () => {
        beforeEach(async () => {
            await delay(3000)
            await $('app-contact-main-info-v2').$('span=Back to Contacts').scrollIntoView()
            await $('span=More').click()
            await delay(2000)
        })
        describe('New Note', () => {
            it('New Note', async () => {
                await $('button[data-action="contact-action-new-note"]').click()
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
                await $('span[data-name="deal-tab-item-Notes"]').click()
                await expect($('app-contact-action-list app-contact-activity-super-item:first-of-type span.note-content > div:first-of-type')).toHaveText('I added a note')
            })
        })
        describe('New Task', () => {
            it('Create', async () => {
                await $('button[data-action="contact-action-new-task"]').click()
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
                await $('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type i.i-arrow-down').click()
                await delay(3000)
                await expect($('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type app-data-list div.contact-data-task:first-of-type').$('div=To Do Task')).toExist()
                await $('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type app-data-list div.contact-data-task:first-of-type i.i-menu-more').click()
                await $('body > div.dropdown').$('span=Delete').click()
                await $('button[data-action="confirm-downgrade"]').click()
                await delay(3000)
                await $('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type i.i-arrow-up').click()
                await delay(3000)
            })
            it('All Day', async () => {
                await $('button[data-action="contact-action-new-task"]').click()
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
                await $('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type i.i-arrow-down').click()
                await delay(3000)
                await expect($('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type app-data-list div.contact-data-task:first-of-type').$('div=To Do Task')).toExist()
                await $('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type app-data-list div.contact-data-task:first-of-type i.i-menu-more').click()
                await $('body > div.dropdown').$('span=Delete').click()
                await $('button[data-action="confirm-downgrade"]').click()
                await delay(3000)
                await $('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type i.i-arrow-up').click()
                await delay(3000)
            })
        })
        describe('New Email', () => {
            it('Send', async () => {
                await $('button[data-action="contact-action-new-email"]').click()
                await $('app-send-email').waitForDisplayed({ timeout: 3000 })
                await delay(3000)
                await $('input[data-name="deal-send-email-subject"]').setValue('To Send Email')
                await delay(3000)
                if(!isVortex) {
                    await browser.execute((text) => {
                        document.querySelector('app-send-email quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
                    }, '<div>How are you?</div>');
                } else {
                    await browser.execute((text) => {
                        document.querySelector('app-send-email quill-editor[data-name="deal-action-description"] .ql-editor > div').innerHTML = text;
                    }, 'How are you?');
                }
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
                await $('span[data-name="deal-tab-item-Emails"]').click()
                await expect($('app-contact-action-list app-contact-activity-super-item:first-of-type div.subject')).toHaveText('To Send Email')
            })
            it('Schedule', async () => {
                await $('button[data-action="contact-action-new-email"]').click()
                await $('app-send-email').waitForDisplayed({ timeout: 3000 })
                await delay(3000)
                await $('input[data-name="deal-send-email-subject"]').setValue('To Schedule Email')
                await delay(3000)
                if(!isVortex) {
                    await browser.execute((text) => {
                        document.querySelector('app-send-email quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
                    }, '<div>How are you?</div>');
                } else {
                    await browser.execute((text) => {
                        document.querySelector('app-send-email quill-editor[data-name="deal-action-description"] .ql-editor > div').innerHTML = text;
                    }, 'How are you?');
                }
                await delay(3000)
                await $('i.i-schedule-send').click()
                await delay(3000)
                await $('tr[data-name="schedule-time-select-2"]').click()
                await delay(3000)
                await $('button[data-action="contact-item-schedule"]').click()
                await delay(3000)
                await $('app-send-email').waitForDisplayed({ reverse: true })
                await delay(3000)
                await $('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type i.i-arrow-down').click()
                await delay(3000)
                await expect($('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type app-task-list div.px-3:first-of-type').$('span*=To Schedule Email')).toExist()
                await delay(3000)
                await $('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type i.i-arrow-up').click()
                await delay(3000)
            })
        })
    })
    describe('Activity', () => {
        it('New Note', async () => {
            await $('span[data-name="profile-tab-item-New Note"]').click()
            await $('app-inline-note-editor div.summary').click()
            await delay(2000)
            if(!isVortex) {
                await browser.execute((text) => {
                    document.querySelector('app-inline-note-editor quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
                }, '<div>I added a note</div>');
            } else {
                await browser.execute((text) => {
                    document.querySelector('app-inline-note-editor quill-editor[data-name="deal-action-description"] .ql-editor > div').innerHTML = text;
                }, 'I added a note');
            }
            await delay(3000)
            await $('app-inline-note-editor button[type="submit"]').click();
            await delay(3000)
            await $('span[data-name="deal-tab-item-Notes"]').click()
            await expect($('app-contact-action-list app-contact-activity-super-item:last-of-type span.note-content > div:first-of-type')).toHaveText('I added a note')
            await $('app-contact-detail-action-header i.i-arrow-up').click()
            await delay(3000)
        })
        it('Send Email', async () => {
            await $('span[data-name="profile-tab-item-Send Email"]').click()
            await $('app-inline-send-email div.summary').click()
            await delay(2000)
            await $('input[data-name="send-email-subject"]').setValue('To Send Email')
            await delay(3000)
            if(!isVortex) {
                await browser.execute((text) => {
                    document.querySelector('app-inline-send-email quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
                }, '<div>How are you?</div>');
            } else {
                await browser.execute((text) => {
                    document.querySelector('app-inline-send-email quill-editor[data-name="deal-action-description"] .ql-editor > div').innerHTML = text;
                }, 'How are you?');
            }
            await delay(3000)
            await $('app-inline-send-email button[type="submit"]').click();
            await delay(5000)
            await $('span[data-name="deal-tab-item-Emails"]').click()
            await expect($('app-contact-action-list app-contact-activity-super-item:first-of-type div.subject')).toHaveText('To Send Email')
            await delay(3000)
            await $('app-contact-detail-action-header i.i-arrow-up').click()
        })
    })
    describe('Task and Appointment', () => {
        it('Create Task', async () => {
            await $('app-contact-data-list-container div.data-sections-container div.accordion-item:nth-of-type(2) div.add-btn').click()
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
            await $('app-contact-data-list-container div.data-sections-container div.accordion-item:nth-of-type(2) i.i-arrow-down').click()
            await delay(3000)
            await expect($('app-contact-data-list-container div.data-sections-container div.accordion-item:nth-of-type(2) app-data-list div.contact-data-task:first-of-type').$('div=To Do Task')).toExist()
            await $('app-contact-data-list-container div.data-sections-container div.accordion-item:nth-of-type(2) app-data-list div.contact-data-task:first-of-type i.i-menu-more').click()
            await $('body > div.dropdown').$('span=Delete').click()
            await $('button[data-action="confirm-downgrade"]').click()
            await delay(3000)
            await $('app-contact-data-list-container div.data-sections-container div.accordion-item:nth-of-type(2) i.i-arrow-up').click()
            await delay(3000)
        })
        it('Create Appointment', async () => {
            await $('app-contact-data-list-container div.data-sections-container div.accordion-item:nth-of-type(4) div.add-btn').click()
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
            await $('app-contact-main-info-v2').$('span=Back to Contacts').scrollIntoView()
            await $('app-contact-data-list-container div.data-sections-container div.accordion-item:nth-of-type(4) i.i-arrow-down').click()
            await delay(3000)
            await expect($('app-contact-data-list-container div.data-sections-container div.accordion-item:nth-of-type(4) app-data-list div.contact-data-appointment:first-of-type').$('div=Good Meeting')).toExist()
            await $('app-contact-data-list-container div.data-sections-container div.accordion-item:nth-of-type(4) app-data-list div.contact-data-appointment:first-of-type i.i-menu-more').click()
            await $('body > div.dropdown').$('span=Remove').click()
            await $('button[data-action="confirm-downgrade"]').click()
            await delay(3000)
            await $('app-contact-data-list-container div.data-sections-container div.accordion-item:nth-of-type(4) i.i-arrow-up').click()
            await delay(3000)
        })
    })
})

describe('Merge and Delete', async () => {
    beforeEach (async () => {
        await goToPage('contacts');
        await delay(3000)
    });
    it('Merge', async () => {
        testingContactElement = await $('span=' + testMergeContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').scrollIntoView()
            await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').click()
        }
        await delay(3000)
        await $('app-contact-main-info-v2').$('span=Back to Contacts').scrollIntoView()
        await $('span=More').click()
        await $('button[data-action="contact-action-merge"]').click()
        await $('app-contact-merge').waitForDisplayed({ timeout: 3000 })
        await $('app-select-contact mat-form-field').click();
        await delay(2000)
        await $('input.mat-select-search-input').setValue(testFirstName);
        await delay(3000)
        await $(`div=${testingContact}`).click();
        await delay(3000)
        await $('span=First Name').parentElement().parentElement().$('mat-select').click();
        await $(`div=${testFirstName}`).click();
        await delay(3000)
        await $('span=Last Name').parentElement().parentElement().$('mat-select').click();
        await $(`div=${testLastName}`).click();
        await delay(3000)
        // const activityitem = $('span*=Activity');
        // await activityitem.scrollIntoView();
        // await activityitem.parentElement().parentElement().$('mat-select').click();
        // await $('div=Both').click();
        // await delay(3000)
        await $('app-contact-merge button[type="submit"]').click()
        await $('app-contact-merge').waitForDisplayed({ reverse: true })
        await delay(3000)
        await goToPage('contacts');
        await delay(3000)
        await expect($('span=' + testMergeContact)).not.toExist()
    })
    it('Delete', async () => {
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').scrollIntoView()
            await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').click()
        }
        await delay(3000)
        await $('app-contact-main-info-v2').$('span=Back to Contacts').scrollIntoView()
        await $('span=More').click()
        await $('button[data-action="contact-action-delete"]').click()
        await $('app-confirm button[data-action="confirm-downgrade"]').click();
        await delay(5000)
        await goToPage('contacts');
        await delay(3000)
        await expect($('span=' + testingContact)).not.toExist()
    })
})

