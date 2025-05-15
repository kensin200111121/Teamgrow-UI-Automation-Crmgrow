
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

let testingContact = '0Testing Contact';
let testingContactElement;
const testingPhone = "8584991782"
const testingEmail = "testingcontact@crmgrow.com" 

const mainLink = require('../test-data/testLink').Link.CONTACTS_LINK;
const testAutomationName = require('../test-data/testdata').testPrepare.automation.name;


const tagRemove = async tagName => {
    await goToSubmenu('contactManager')
    await $('span[data-name="profile-tab-item-Tag Manager"]').click()
    await delay(3000)
    const tagManagerPaginationExist = await $('span[data-name="contact-tag-manager-page-size"]').isExisting()
    if(tagManagerPaginationExist) {
        await $('span[data-name="contact-tag-manager-page-size"]').click()
        await $('div[data-name="contact-tag-manager-page-size-50"]').click()
    }
    const tagExist = await $('app-tag-manager').$(`div=${tagName}`).isDisplayed()
    if(tagExist) {
        const tagElement = await $('app-tag-manager').$(`div=${tagName}`)
        const tagItem = await browser.custom$('closest_tag-item', tagElement)
        await tagItem.scrollIntoView()
        await browser.execute(ele => {
            ele.querySelector('input[type="checkbox"]').click();
        }, tagItem)
        await $('div[data-name="material-action-item-Delete"]').waitForClickable({ timeout: 3000 })
        await $('div[data-name="material-action-item-Delete"]').scrollIntoView()
        await $('div[data-name="material-action-item-Delete"]').click()
        await $('app-tag-delete').waitForDisplayed({ timeout: 3000 })
        await $('app-tag-delete').$('button=Delete').click()
        await $('app-tag-delete').waitForDisplayed({ reverse: true })
        await delay(3000)
    }
}
const labelRemove = async labelName => {
    await goToSubmenu('contactManager')
    await $('span[data-name="profile-tab-item-Statuses"]').click()
    await delay(3000)
    const labelManagerPaginationExist = await $('span[data-name="contact-label-manager-page-size"]').isExisting()
    if(labelManagerPaginationExist) {
        await $('span[data-name="contact-label-manager-page-size"]').click()
        await $('div[data-name="contact-label-manager-page-size-50"]').click()
    }
    const labelExist = await $('app-label-manager').$(`span=${labelName}`).isDisplayed()
    if(labelExist) {
        const labelElement = await $('app-label-manager').$(`span=${labelName}`)
        const labelItem = await browser.custom$('closest_label-item', labelElement)
        await browser.execute(ele => {
            ele.querySelector('input[type="checkbox"]').click()
        }, labelItem)
        await $('div[data-name="material-action-item-Delete"]').waitForClickable({ timeout: 3000 })
        await $('div[data-name="material-action-item-Delete"]').scrollIntoView()
        await $('div[data-name="material-action-item-Delete"]').click()
        await $('app-confirm').waitForDisplayed({ timeout: 3000 })
        await $('app-confirm').$('button=Delete').click()
        await $('app-confirm').waitForDisplayed({ reverse: true })
        await delay(3000)
    }
}
const customContactFieldRemove = async customFieldName => {
    await goToSubmenu('contactManager')
    await $('span[data-name="profile-tab-item-Custom Contact Fields"]').click()
    await delay(3000)
    const customeFieldPaginationExist = await $('span[data-name="contact-custom-fields-page-size"]').isDisplayed()
    if(customeFieldPaginationExist) {
        await $('span[data-name="contact-custom-fields-page-size"]').click()
        await $('div[data-name="contact-custom-fields-page-size-50"]').click()
    }
    const customFieldExist = await $('app-custom-fields').$(`div=${customFieldName}`).isDisplayed()
    if(customFieldExist) {
        const customFieldElement = await $('app-custom-fields').$(`div=${customFieldName}`)
        const customFieldItem = await browser.custom$('closest_field-item', customFieldElement)
        await customFieldItem.scrollIntoView()
        await browser.execute(ele => {
            ele.querySelector('input[type="checkbox"]').click()
        }, customFieldItem)
        await $('div[data-name="material-action-item-Delete"]').waitForClickable({ timeout: 3000 })
        await $('div[data-name="material-action-item-Delete"]').scrollIntoView()
        await $('div[data-name="material-action-item-Delete"]').click()
        await $('app-custom-field-delete').waitForDisplayed({ timeout: 3000 })
        await $('app-custom-field-delete').$('button=Yes, Delete').click()
        await $('app-custom-field-delete').waitForDisplayed({ reverse: true })
        await delay(3000)
    }
}
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
    describe('Preparation', async () => {
        it('Delete Testing Contact', async () => {
            await goToPage('contacts')
            const testingContactExist = await $('span=0Testing Contact').isDisplayed()
            if(testingContactExist) {
                await delay(3000)
                await selectContact('0Testing Contact')
                await $('div[data-name="material-action-item-More"]').waitForClickable({ timeout: 2000 })
                await $('div[data-name="material-action-item-More"]').click()
                await $('div[data-name="material-action-item-More-Delete"]').click()
                await $('button[data-action="confirm-downgrade"]').click()
                await delay(5000)
            }  
        })
        it('Delete Custom Contact Field', async () => {
            const customFieldsToRemove = [
                'hobby',
                'third email',
                'my phont',
                'today',
                'my link',
                'select',
                'favorite sport',
                'favorite music',
                'favorite game',
            ]
            for (let item of customFieldsToRemove) {
                await customContactFieldRemove(item)
            }
        })
        it('Delete Test Label', async () => {
            const labelsToRemove = [
                'test label',
                'testing label',
            ]
            for (let item of labelsToRemove) {
                await labelRemove(item)
            }
        })
        it('Delete Testing Tag', async () => {
            const tagsToRemove = [
                'test tag',
                'Testing Tag',
            ]
            for (let item of tagsToRemove) {
                await tagRemove(item)
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
        await $('input[data-name="contact-create-firstname"]').setValue("0Testing")
        await $('input[data-name="contact-create-lastname"]').setValue("Contact")
        await $('input[data-name="contact-create-email"]').setValue(testingEmail)
        await $('app-contact-create-edit app-phone-input input[data-name="add-user-phone"]').setValue(testingPhone)
        await delay(2000)
        await $('button[data-action="create-contact-add-btn"]').waitForClickable({ timeout: 3000 })
        await $('button[data-action="create-contact-add-btn"]').click()
        await $('app-contact-create-edit').waitForDisplayed({ reverse: true })
        await delay(5000)
        let testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await expect(testingContactTr.$('td.mat-column-contact_name span')).toHaveText(testingContact)
        }
    })
})
describe('Import CSV', () => {
    it('import', async () => {
        await goToPage('contacts')
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
    })
})
describe('Activity Filter', () => {
    const activityFilterList = [
        'added',
        'added note',
        'added task',
        'called',
        'opened email',
        'clicked link',
        'sent video',
        'sent pdf',
        'sent image',
        'sent email',
        'watched video',
        'reviewed image',
        'reviewed pdf',
    ]
    for (let filter of activityFilterList) {
        it(`Activity ${filter}`, async () => {
            await goToPage('contacts')
            await $('button[data-action="create-new-contact"]').scrollIntoView()
            await $('span[data-name="contact-list-filter"]').click()
            await $('div[data-name="contact-filter-item-Activity"]').click()    
            await $('app-advanced-filter-option').waitForDisplayed({ timeout: 3000 })
            await $('app-advanced-filter-activity').$(`div=${filter}`).click()
            await $('button[data-action="contact-filter-activity-apply"]').click()
            await $('app-advanced-filter-option').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('Activity')
            await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText(`${filter}`)
            await $('a[data-name="contact-filter-clear"]').click()
            await delay(3000)
        })
    }
})
describe('Sort By', () => {
    it('Alphabet Z-A', async () => {
        await goToPage('contacts')
        await $('span[data-name="contact-sortby"]').click()
        await $('div[data-name="contact-sortby-Alphabetical Z-A"]').click()
        await delay(3000)
        await expect($('span[data-name="contact-sortby"]')).toHaveText('Alphabetical Z-A')
        await $('span[data-name="contact-sortby"]').scrollIntoView()
        await $('span[data-name="contact-sortby"]').waitForClickable({ timeout: 2000 })
        await $('span[data-name="contact-sortby"]').click()
        await $('div[data-name="contact-sortby-Alphabetical A-Z"]').click()
        await delay(3000)
    })
})
describe('Call Report', () => {
    it('sortby', async () => {
        await goToSubmenu('callReport')
        await $('div[data-name="contact-call-sortby"]').click()
        await $('span[data-name="contact-call-sortby-Alphabetical Z-A"]').click()
        await expect($('div[data-name="contact-call-sortby"] span')).toHaveText('Alphabetical Z-A')
    })
})
describe('Pagination', () => {
    describe('Contacts', () => {
        beforeEach(async () => {
            await goToPage('contacts')
        })
        const rowCases = [ 8, 50 ];
        for (let rowCase of rowCases) {
            it(`${rowCase} Rows`, async () => {
                const paginationExist = await $('div[data-name="contacts-page-size-control"]').isDisplayed()
                if(paginationExist) {
                    await $('div[data-name="contacts-page-size-control"]').click()
                    await $(`div[data-name="contacts-page-size-control-${rowCase}"]`).click()
                    await expect($('div[data-name="contacts-page-size-control"] span')).toHaveText(`Show ${rowCase} rows per page`)
                }
            })
        }
    })
    describe('Tag Manager', () => {
        beforeEach(async () => {
            await goToSubmenu('contactManager')
            await $('span[data-name="profile-tab-item-Tag Manager"]').click()
        })
        const rowCases = [ 5, 50 ];
        for (let rowCase of rowCases) {
            it(`${rowCase} Rows`, async () => {
                const paginationExist = await $('span[data-name="contact-tag-manager-page-size"]').isDisplayed()
                if(paginationExist) {
                    await $('span[data-name="contact-tag-manager-page-size"]').click()
                    await $(`div[data-name="contact-tag-manager-page-size-${rowCase}"]`).click()
                    await expect($('span[data-name="contact-tag-manager-page-size"]')).toHaveText(`Show ${rowCase} rows per page`)
                }
            })
        }
    })
    describe('Label Manager', () => {
        beforeEach(async () => {
            await goToSubmenu('contactManager')
            await $('span[data-name="profile-tab-item-Statuses"]').click()
        })
        const rowCases = [ 5, 50 ];
        for (let rowCase of rowCases) {
            it(`${rowCase} Rows`, async () => {
                const paginationExist = await $('span[data-name="contact-label-manager-page-size"]').isDisplayed()
                if(paginationExist) {
                    await $('span[data-name="contact-label-manager-page-size"]').click()
                    await $(`div[data-name="contact-label-manager-page-size-${rowCase}"]`).click()
                    await expect($('span[data-name="contact-label-manager-page-size"]')).toHaveText(`Show ${rowCase} rows per page`)
                }
            })
        }
    })
    describe('Custom Contact Fields', () => {
        beforeEach(async () => {
            await goToSubmenu('contactManager')
            await $('span[data-name="profile-tab-item-Custom Contact Fields"]').click()
        })
        const rowCases = [ 8, 50 ];
        for (let rowCase of rowCases) {
            it(`${rowCase} Rows`, async () => {
                const paginationExist = await $('span[data-name="contact-custom-fields-page-size"]').isDisplayed()
                if(paginationExist) {
                    await $('span[data-name="contact-custom-fields-page-size"]').click()
                    await $(`div[data-name="contact-custom-fields-page-size-${rowCase}"]`).click()
                    await expect($('span[data-name="contact-custom-fields-page-size"]')).toHaveText(`Show ${rowCase} rows per page`)
                }
            })
        }
    })
})
describe('Bulk Edit', () => {
    it('Check custom field', async () => {
        await goToSubmenu('contactManager')
        await $('span[data-name="profile-tab-item-Custom Contact Fields"]').waitForClickable({ timeout: 10000 })
        await $('span[data-name="profile-tab-item-Custom Contact Fields"]').click()
        await delay(5000)
        const favoriteSportExist = await $('div=favorite sport').isDisplayed()
        if(!favoriteSportExist) {
            await $('button[data-action="contacts-add-custom-field"]').waitForClickable({ timeout: 5000 })
            await $('button[data-action="contacts-add-custom-field"]').click()
            await $('app-custom-field-add').waitForDisplayed({ timeout: 5000 })
            await $('app-custom-field-add input[name="field_name"]').setValue('favorite sport')
            await delay(2000)
            await $('button=Add').click()
            await $('app-custom-field-add').waitForDisplayed({ reverse: true })
            await delay(5000)
        }
        await expect($('div=favorite sport')).toBeDisplayed()
        await $('span[data-name="profile-tab-item-Statuses"]').click()
        await delay(3000)
        const labelManagerPaginationExist = await $('span[data-name="contact-label-manager-page-size"]').isExisting()
        if(labelManagerPaginationExist) {
            await $('span[data-name="contact-label-manager-page-size"]').click()
            await $('div[data-name="contact-label-manager-page-size-50"]').click()
        }
        const labelExist = await $('app-label-manager').$('span=team').isDisplayed()
        if(!labelExist) {
            await $('input.label-name-input').setValue('Team');
            await $('button[data-action="contact-label-save"]').click();
            await $('div.swatch').click();
            await $('app-label-edit-color button.btn-primary').click();
            await delay(1000)
            await expect($('span=team')).toExist()
        }
        await goToPage('contacts')
        await $('div[data-name="contacts-edit-column"]').click()
        await $('app-column-edit').waitForDisplayed({ timeout: 3000 })
        await $('div[data-name="column-item-favorite sport"] label div').scrollIntoView()
        await $('div[data-name="column-item-favorite sport"] label div').click()
        await $('button[data-action="edit-column-apply"]').click()
        await $('app-column-edit').waitForDisplayed({ reverse: true })
        await delay(3000)
        let testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            await selectContact(testingContact)
        }
        await $('div[data-name="material-action-item-More"]').click()
        await $('div[data-name="material-action-item-More-Edit"]').click()
        await $('app-contact-bulk app-label-select mat-form-field[data-name="contact-label-select"]').click()
        await delay(2000)
        await $('div.cdk-overlay-container mat-option[data-name="contact-label-team"] span.label-name').click()
        await delay(2000)
        await $('app-contact-bulk button[data-action="contact-bulk-edit-save"]').click()
        await $('app-custom-toast').waitForDisplayed({ timeout: 20000 })
        await $('app-custom-toast').click()
        await $('app-custom-toast').waitForDisplayed({ reverse: true })
        await $('app-contact-bulk button[data-action="contact-bulk-edit-cancel"]').click()
        await delay(2000)
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            await selectContact(testingContact)
        }
        const customColumnHeader = await browser.execute(() => {
            const spans = document.querySelectorAll('table thead tr:nth-of-type(2) th');
            return Array.from(spans).find(span => span.textContent.includes('favorite sport'));
        });
        // await expect($(customColumnHeader)).toExist()
        // await delay(3000)
        // await $('button[data-action="create-new-contact"]').scrollIntoView()
        // await $('div[data-name="contacts-edit-column"]').click()
        // await $('app-column-edit').waitForDisplayed({ timeout: 3000 })
        // await $('div[data-name="task-column-item-custom_favorite sport"]').scrollIntoView()
        // await $('div[data-name="task-column-item-custom_favorite sport"] i.i-close').click()
        // await $('button[data-action="edit-column-apply"]').click()
        // await $('app-column-edit').waitForDisplayed({ reverse: true })
        // await expect($('table thead tr:nth-of-type(2) th.mat-column-custom_favorite-sport')).not.toExist()
    })
})
describe('Bulk Add New Task', () => {
    describe('General', () => {
        it('Create', async () => {
            await goToPage('contacts')
            let testingContactElement = await $('span=' + testingContact)
            await testingContactElement.waitForExist()
            if(testingContactElement) {
                await delay(3000)
                await selectContact(testingContact)
            }
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
            await goToPage('contacts')
            let testingContactElement = await $('span=' + testingContact)
            await testingContactElement.waitForExist()
            if(testingContactElement) {
                await delay(3000)
                await selectContact(testingContact)
            }
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
})
describe('Bulk Add New Email', () => {
    it('Send', async () => {
        await goToPage('contacts')
        let testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            await selectContact(testingContact)
        }
        await $('div[data-name="material-action-item-New Email"]').click()
        await $('app-send-email').waitForDisplayed({ timeout: 3000 })
        await $('input[data-name="deal-send-email-subject"]').setValue('To Send Email')
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
        await $('app-send-email').waitForDisplayed({ reverse: true })
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
        await goToPage('contacts')
        const testingContact = '0Testing Contact';
        let testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            await selectContact(testingContact)
        }
        await $('div[data-name="material-action-item-New Email"]').click()
        await $('app-send-email').waitForDisplayed({ timeout: 3000 })
        await $('input[data-name="deal-send-email-subject"]').setValue('To Schedule Email')
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
        await $('i.i-schedule-send').click()
        await $('tr[data-name="schedule-time-select-2"]').click()
        await $('button[data-action="contact-item-schedule"]').click()
        // await $('button[data-action="create-schedule-item"]').click()
        await $('app-send-email').waitForDisplayed({ reverse: true })
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
        await expect($('app-contact-data-list-container div.data-sections-container div.accordion-item:first-of-type app-task-list div.px-3:first-of-type').$('span*=To Schedule Email')).toExist()
    })
})
describe('Bulk Add New Note', () => {
    it('Note', async () => {
        await goToPage('contacts')
        let testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').click()
            await delay(5000)
            await $('div[data-name="contact-dropdown-toggle"]').click()
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
        }
    })
})
describe('Bulk Add Deal', () => {
    it('Add', async () => {
        await goToPage('contacts')
        let testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            await selectContact(testingContact)
        }
        await $('div[data-name="material-action-item-More"]').click()
        await $('div[data-name="material-action-item-More-New Deal"]').click()
        await $('app-deal-create').waitForDisplayed({ timeout: 3000 })
        await $('input[data-name="title"]').setValue('Good Deal')
        const stageSelect = await browser.execute(() => { return document.querySelector('app-deal-create select'); });
        await $(stageSelect).click()
        const stageSelectOption = await browser.execute(() => { return document.querySelectorAll('app-deal-create select option')[0]; });
        await $(stageSelectOption).click()
        await $('button[data-action="deal-create-confirm"]').click()
        await $('app-deal-create').waitForDisplayed({ reverse: true })
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
        await $('app-contact-data-list-container div.data-sections-container div.accordion-item:nth-of-type(3) i.i-arrow-down').click()
        await delay(3000)
        await expect($('app-contact-data-list-container div.data-sections-container div.accordion-item:nth-of-type(3) app-data-list div.contact-data-deal:first-of-type').$('div=Good Deal')).toExist()
        await delay(3000)
    })
})
describe('Bulk Add New Meeting', () => {
    it('Create', async () => {
        await goToPage('contacts')
        let testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').scrollIntoView()
            await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').click()
        }
        await delay(5000)
        await $('div[data-name="contact-dropdown-toggle"]').click()
        await delay(5000)
        await $('button[data-action="contact-action-new-meeting"]').click()
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
    })
    it('All Day', async () => {
        await goToPage('contacts')
        let testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').scrollIntoView()
            await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').click()
        }
        await delay(5000)
        await $('div[data-name="contact-dropdown-toggle"]').click()
        await delay(5000)
        await $('button[data-action="contact-action-new-meeting"]').click()
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
describe('Bulk Assign an Automation', () => {
    it('assign', async () => {
        await goToPage('contacts')
        const testingContact = '0Testing Contact';
        let testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await browser.execute(ele => {
                ele.querySelector('input[type="checkbox"]').click();
            }, testingContactTr)
        }
        await $('div[data-name="material-action-item-More"]').click()
        await $('div[data-name="material-action-item-More-New automation"]').click()
        await $('app-contact-assign-automation').waitForDisplayed({ timeout: 3000 })
        await delay(5000)
        await $('mat-form-field[data-name="contact-input-automation-select"]').click()
        await delay(2000)
        await $(`mat-option[data-name="contact-input-automation-select-${testAutomationName}"]`).click()
        await delay(2000)
        await $('button[data-action="contact-assign-automation-add"]').click()
        await delay(2000)
        const bulkAutomation = await $('app-confirm-bulk-automation').isDisplayed()
        if(bulkAutomation) await $('button[data-action="confirm-bulk-automation-ok"]').click()
        await $('app-contact-assign-automation').waitForDisplayed({ reverse: true })
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').scrollIntoView()
            await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').click()
        }
        await delay(5000)
        await $('app-contact-data-list-container div.data-sections-container div.accordion-item:nth-of-type(5) i.i-arrow-down').click()
        await delay(3000)
        await expect($('app-contact-data-list-container div.data-sections-container div.accordion-item:nth-of-type(5) app-automation-item:first-of-type div.title')).toHaveText(testAutomationName)
        await delay(3000)
    })
})
describe('Select All and Deselect', () => {
    it('Select All', async () => {
        await goToPage('contacts')
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
describe('Contact Record', () => {
    beforeEach(async () => {
        await goToPage('contacts')
        testingContact = '0Testing Contact'
        let testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').scrollIntoView()
            await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').click()
        }
        await delay(5000)
    })
    it('Update Name', async () => { 
        await $('span=Edit contact').click()
        await $('app-contact-create-edit').waitForDisplayed({ timeout: 3000 })
        await $('app-contact-create-edit input[data-name="contact-create-lastname"]').setValue('Contact')
        await $('app-contact-create-edit input[data-name="contact-create-firstname"]').setValue('0Testing')
        await delay(3000)
        await $('button[data-action="create-contact-add-btn"]').click()
        await delay(3000)
        await $('app-contact-create-edit').waitForDisplayed({ reverse: true })
        await expect($('div.card-body span.full-name')).toHaveText(testingContact)
    })
    it('Create and Change Label', async () => {
        await $('mat-form-field[data-name="contact-label-select"]').click()
        await $('span=Create Status').click()
        await $('app-manage-label').waitForDisplayed({ timeout: 3000 })
        await $('input[name="edit_label_name"]').setValue('Testing Label')
        await delay(3000)
        await $('mat-drawer app-manage-label button.color-picker-button').click()
        await $('app-label-edit-color').waitForDisplayed({ timeout: 5000 })
        await $('app-label-edit-color color-swatches div.swatches-body color-swatches-group:first-of-type color-swatches-color:first-of-type div.swatch').click()
        await $('button=Apply').click()
        await $('button.save-btn').click()
        await delay(7000)
        await $('button[data-action="label-manage-close"]').click()
        await $('app-manage-label').waitForDisplayed({ reverse: true })
        await goToPage('contacts')
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await testingContactTr.$('td.mat-column-contact_label mat-form-field[data-name="contact-label-select"]').scrollIntoView()
            await testingContactTr.$('td.mat-column-contact_label mat-form-field[data-name="contact-label-select"]').click()
        }
        await $('mat-option[data-name="contact-label-testing label"]').waitForClickable({ timeout: 3000 })
        await $('mat-option[data-name="contact-label-testing label"]').click()
        await goToPage('contacts')
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await testingContactTr.$('td.mat-column-contact_label span.label-name').scrollIntoView()
            await expect(testingContactTr.$('td.mat-column-contact_label span.label-name')).toHaveTextContaining('Testing')
        }
        await goToSubmenu('contactManager')
        await $('span[data-name="profile-tab-item-Statuses"]').waitForClickable({ timeout: 3000 })
        await $('span[data-name="profile-tab-item-Statuses"]').click()
        await delay(5000)
        await $('app-label-manager div.table div.table-header div.checkbox-col').click()
        await $('div[data-name="material-action-item-Delete"]').click()
        await $('button[data-action="confirm-downgrade"]').click()
        await delay(3000)
        await goToPage('contacts')
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await testingContactTr.$('td.mat-column-contact_label mat-form-field[data-name="contact-label-select"]').click()
        }
        await $('mat-option[data-name="contact-label-hot"]').click()
        await delay(2000)
        await goToPage('contacts')
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await expect(testingContactTr.$('td.mat-column-contact_label span.label-name')).toHaveText('Hot')
        }
    })
    it('Update Phone number', async () => {
        await $('span=Edit contact').click()
        await $('app-contact-create-edit').waitForDisplayed({ timeout: 3000 })
        await delay(2000)
        await $('app-contact-create-edit app-phone-input input[data-name="add-user-phone"]').setValue(testingPhone)
        await delay(3000)
        await $('button[data-action="create-contact-add-btn"]').click()
        await $('app-contact-edit').waitForDisplayed({ reverse: true })
        await delay(5000)
        await expect($(`span=+1${testingPhone}`)).toBeDisplayed()
    })
    it('Update Email Address', async () => {
        await $('span*=Edit contact').click()
        await $('app-contact-create-edit').waitForDisplayed({ timeout: 3000 })
        await delay(2000)
        await $('app-contact-create-edit input[data-name="contact-create-email"]').setValue(testingEmail)
        await delay(3000)
        await $('button[data-action="create-contact-add-btn"]').click()
        await $('app-contact-create-edit').waitForDisplayed({ reverse: true })
        await $('span=Back to Contacts').click()
        await delay(5000)
        await expect($(`span=${testingEmail}`)).toBeDisplayed()
    })
    it.skip('Change or Add Secondary Email Address', async () => {
        await $('mat-expansion-panel:nth-of-type(2) i.i-edit').waitForClickable({ timeout: 10000 })
        await $('mat-expansion-panel:nth-of-type(2) i.i-edit').click()
        await $('app-contact-edit').waitForDisplayed({ timeout: 3000 })
        await delay(2000)
        await $('input[name="secondEmail"]').setValue('qa@crmgrow.com')
        await delay(3000)
        await $('button[data-action="create-contact-add-btn"]').click()
        await $('app-contact-edit').waitForDisplayed({ reverse: true })
        await delay(5000)
        await expect($('span=qa@crmgrow.com')).toBeDisplayed()
    })
    it.skip('Change or Add Secondary Phone Number', async () => {
        await $('mat-expansion-panel:nth-of-type(2) i.i-edit').waitForClickable({ timeout: 10000 })
        await $('mat-expansion-panel:nth-of-type(2) i.i-edit').click()
        await $('app-contact-edit').waitForDisplayed({ timeout: 3000 })
        await delay(2000)
        await $('app-contact-edit app-phone-input[data-name="second-phone-input"] input[data-name="add-user-phone"]').setValue('8214671238')
        await delay(5000)
        await $('button[data-action="create-contact-add-btn"]').click()
        await $('app-contact-edit').waitForDisplayed({ reverse: true })
        await delay(2000)
        await goToPage('contacts')
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').scrollIntoView()
            await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').click()
            await delay(5000)
            await expect($('mat-expansion-panel:nth-of-type(2) div.contact-detail > div:first-of-type span')).toHaveText('+18214671238')
        }
    })
    it('Add tags', async () => {
        await goToSubmenu('contactManager')
        const tagManagerPaginationExist = await $('span[data-name="contact-tag-manager-page-size"]').isExisting()
        if(tagManagerPaginationExist) {
            await $('span[data-name="contact-tag-manager-page-size"]').click()
            await $('div[data-name="contact-tag-manager-page-size-50"]').click()
        }
        await $('input[name="edit_tag_name"]').setValue('Testing Tag')
        await delay(3000)
        await $('button[data-action="contact-tag-save"]').click()
        await delay(3000)
        // Assign Tag
        await goToPage('contacts')
        let testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').scrollIntoView()
            await testingContactTr.$('td.mat-column-contact_name div.contact-avatar').click()
        }
        await delay(5000)
        await $('span=Edit contact').click()
        await $('app-contact-create-edit').waitForDisplayed({ timeout: 3000 })
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
        await $('span=Edit contact').click()
        await $('app-contact-create-edit').waitForDisplayed({ timeout: 3000 })
        await delay(2000)
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
    })
    it('Add Local Custom Field', async () => {
        await $('span=Edit contact').click()
        await $('app-contact-create-edit').waitForDisplayed({ timeout: 3000 })
        await delay(2000)
        const label = await $('label=favorite sport');
        await label.waitForExist();
        await label.scrollIntoView();
        await label.parentElement().$('input').setValue('Football');
        await delay(2000)
        await $('button[data-action="create-contact-add-btn"]').click()
        await $('app-contact-create-edit').waitForDisplayed({ reverse: true })
        await delay(5000)
        await expect($('span=Football')).toExist()
    })
    it('Remove Local Custom Field', async () => {
        await $('span=Edit contact').click()
        await $('app-contact-create-edit').waitForDisplayed({ timeout: 3000 })
        await delay(2000)
        const label = await $('label=favorite sport');
        await label.waitForExist();
        await label.scrollIntoView();
        await label.parentElement().$('input').setValue('');
        await delay(2000)
        await $('button[data-action="create-contact-add-btn"]').click()
        await $('app-contact-create-edit').waitForDisplayed({ reverse: true })
        await delay(2000)
        await expect($('span=Football')).not.toExist()
    })
})


describe('Bulk Edit Contacts', () => {
    it('label', async () => {
        await goToPage('contacts')
        let testingContact='0Testing Contact'
        let testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            await selectContact(testingContact)
        }
        await $('div[data-name="material-action-item-More"]').click()
        await $('div[data-name="material-action-item-More-Edit"]').click()
        await $('app-contact-bulk').waitForDisplayed({ timeout: 3000 })
        await $('app-contact-bulk mat-form-field[data-name="contact-label-select"]').waitForClickable({ timeout: 5000 })
        await $('app-contact-bulk mat-form-field[data-name="contact-label-select"]').click()
        await $('mat-option[data-name="contact-label-Warm"] span.label-name').click()
        await $('button[data-action="contact-bulk-edit-save"]').click()
        await $('app-custom-toast').waitForDisplayed({ timeout: 10000 })
        await $('app-custom-toast').click()
        await $('app-custom-toast').waitForDisplayed({ reverse: true })
        await $('button[data-action="contact-bulk-edit-cancel"]').click()
        await $('app-contact-bulk').waitForDisplayed({ reverse: true })
        await delay(3000)
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await testingContactTr.$('td.mat-column-contact_label span.label-name').scrollIntoView()
            await expect(testingContactTr.$('td.mat-column-contact_label span.label-name')).toHaveText('Warm')
            await delay(3000)
            await selectContact(testingContact)
        }
    })
    it('tag', async () => {
        await goToPage('contacts')
        let testingContact='0Testing Contact'
        let testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            await selectContact(testingContact)
        }
        await $('div[data-name="material-action-item-More"]').waitForClickable({ timeout: 3000 })
        await $('div[data-name="material-action-item-More"]').scrollIntoView()
        await $('div[data-name="material-action-item-More"]').click()
        await $('div[data-name="material-action-item-More-Edit"]').click()
        await $('app-contact-bulk').waitForDisplayed({ timeout: 3000 })
        await $('app-contact-bulk select[name="keepTag"]').waitForClickable({ timeout: 3000 })
        await $('app-contact-bulk select[name="keepTag"]').click()
        await delay(2000)
        await $('app-contact-bulk select[name="keepTag"]').selectByVisibleText('Add new tags and remove current tags')
        await delay(2000)
        await $('mat-form-field[data-name="contact-tag-select"]').click()
        await delay(2000)
        await $('mat-option=Test').click()
        await $('button[data-action="contact-bulk-edit-save"]').click()
        await $('app-custom-toast').waitForDisplayed({ timeout: 10000 })
        await $('app-custom-toast').click()
        await $('app-custom-toast').waitForDisplayed({ reverse: true })
        await $('button[data-action="contact-bulk-edit-cancel"]').click()
        await $('app-contact-bulk').waitForDisplayed({ reverse: true })
        await delay(3000)
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await testingContactTr.$('td.mat-column-contact_tags span.rounded').scrollIntoView()
            await expect(testingContactTr.$('td.mat-column-contact_tags span.rounded')).toHaveText('Test')
        }
        await delay(3000)
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            await selectContact(testingContact)
        }
    })
    it('source', async () => {
        await goToPage('contacts')
        await $('div[data-name="contacts-edit-column"]').waitForClickable({ timeout: 10000 })
        await $('button[data-action="create-new-contact"]').scrollIntoView()
        await $('div[data-name="contacts-edit-column"]').click()
        await delay(2000)
        const sourceExist = await $('app-column-edit input[id="column-source"]').isSelected()
        if(!sourceExist) await $('app-column-edit label[for="column-source"]').click()
        await $('button[data-action="edit-column-apply"]').click()
        await delay(5000)
        let testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            await selectContact(testingContact)
        }
        await $('div[data-name="material-action-item-More"]').waitForClickable({ timeout: 3000 })
        await $('div[data-name="material-action-item-More"]').scrollIntoView()
        await $('div[data-name="material-action-item-More"]').click()
        await $('div[data-name="material-action-item-More-Edit"]').click()
        await $('app-contact-bulk').waitForDisplayed({ timeout: 3000 })
        await delay(2000)
        await $('input[name="source"]').setValue('Information')
        await delay(2000)
        await $('button[data-action="contact-bulk-edit-save"]').click()
        await $('app-custom-toast').waitForDisplayed({ timeout: 10000 })
        await $('app-custom-toast').click()
        await $('app-custom-toast').waitForDisplayed({ reverse: true })
        await $('button[data-action="contact-bulk-edit-cancel"]').click()
        await $('app-contact-bulk').waitForDisplayed({ reverse: true })
        await delay(3000)
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            await selectContact(testingContact)
        }
        await delay(3000)
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await testingContactTr.$('td.mat-column-source span').scrollIntoView()
            await expect(testingContactTr.$('td.mat-column-source span')).toHaveText('Information')
        }
        await $('div[data-name="contacts-edit-column"] span').waitForClickable({ timeout: 10000 })
        await $('button[data-action="create-new-contact"]').scrollIntoView()
        await $('div[data-name="contacts-edit-column"] span').click()
        await $('app-column-edit div[data-name="task-column-item-source"] i.i-close').scrollIntoView()
        await $('app-column-edit div[data-name="task-column-item-source"] i.i-close').click()
        await $('button[data-action="edit-column-apply"]').click()
        await delay(3000)
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await expect(testingContactTr.$('td.mat-column-source span')).not.toExist()
        }
    })
    it('company', async () => {
        await goToPage('contacts')
        await $('div[data-name="contacts-edit-column"] span').waitForClickable({ timeout: 10000 })
        await $('button[data-action="create-new-contact"]').scrollIntoView()
        await $('div[data-name="contacts-edit-column"] span').click()
        await delay(2000)
        const companyChecked = await $('app-column-edit #column-company').isSelected()
        if(!companyChecked) await $('app-column-edit label[for="column-company"]').click()
        await $('button[data-action="edit-column-apply"]').click()
        await delay(3000)
        let testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            await selectContact(testingContact)
        }
        await $('div[data-name="material-action-item-More"]').waitForClickable({ timeout: 3000 })
        await $('div[data-name="material-action-item-More"]').scrollIntoView()
        await $('div[data-name="material-action-item-More"]').click()
        await $('div[data-name="material-action-item-More-Edit"]').click()
        await $('app-contact-bulk').waitForDisplayed({ timeout: 3000 })
        await delay(2000)
        await $('input[name="company"]').setValue('Liverpool')
        await delay(2000)
        await $('button[data-action="contact-bulk-edit-save"]').click()
        await $('app-custom-toast').waitForDisplayed({ timeout: 10000 })
        await $('app-custom-toast').click()
        await $('app-custom-toast').waitForDisplayed({ reverse: true })
        await $('button[data-action="contact-bulk-edit-cancel"]').click()
        await $('app-contact-bulk').waitForDisplayed({ reverse: true })
        await delay(3000)
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            await selectContact(testingContact)
        }
        await delay(3000)
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await expect(testingContactTr.$('td.mat-column-company span')).toHaveText('Liverpool')
        }
        await $('button[data-action="create-new-contact"]').scrollIntoView()
        await $('div[data-name="contacts-edit-column"]').click()
        await $('app-column-edit div[data-name="task-column-item-company"] i.i-close').scrollIntoView()
        await $('app-column-edit div[data-name="task-column-item-company"] i.i-close').click()
        await delay(2000)
        await $('button[data-action="edit-column-apply"]').click()
        await delay(3000)
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await expect(testingContactTr.$('td.mat-column-company span')).not.toExist()
        }
    })
    it('city', async () => {
        await goToPage('contacts')
        await $('div[data-name="contacts-edit-column"] span').waitForClickable({ timeout: 10000 })
        await $('button[data-action="create-new-contact"]').scrollIntoView()
        await $('div[data-name="contacts-edit-column"] span').click()
        await delay(1000)
        const cityExist = await $('app-column-edit #column-city').isSelected()
        if(!cityExist) await $('app-column-edit label[for="column-city"]').click()
        await $('button[data-action="edit-column-apply"]').click()
        await delay(3000)
        let testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            await selectContact(testingContact)
        }
        await $('div[data-name="material-action-item-More"]').waitForClickable({ timeout: 3000 })
        await $('div[data-name="material-action-item-More"]').scrollIntoView()
        await $('div[data-name="material-action-item-More"]').click()
        await $('div[data-name="material-action-item-More-Edit"]').click()
        await $('app-contact-bulk').waitForDisplayed({ timeout: 3000 })
        await delay(2000)
        await $('input[name="city"]').setValue('Liverpool City')
        await delay(2000)
        await $('button[data-action="contact-bulk-edit-save"]').click()
        await $('app-custom-toast').waitForDisplayed({ timeout: 10000 })
        await $('app-custom-toast').click()
        await $('app-custom-toast').waitForDisplayed({ reverse: true })
        await $('button[data-action="contact-bulk-edit-cancel"]').click()
        await $('app-contact-bulk').waitForDisplayed({ reverse: true })
        await delay(3000)
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            await selectContact(testingContact)
        }
        await delay(3000)
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await expect(testingContactTr.$('td.mat-column-city span')).toHaveText('Liverpool City')
        }
        await $('button[data-action="create-new-contact"]').scrollIntoView()
        await $('div[data-name="contacts-edit-column"]').click()
        await $('app-column-edit div[data-name="task-column-item-city"] i.i-close').scrollIntoView()
        await $('app-column-edit div[data-name="task-column-item-city"] i.i-close').click()
        await $('button[data-action="edit-column-apply"]').click()
        await delay(3000)
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await expect(testingContactTr.$('td.mat-column-city span')).not.toExist()
        }
    })
    it('country', async () => {
        await goToPage('contacts')
        await $('div[data-name="contacts-edit-column"] span').waitForClickable({ timeout: 10000 })
        await $('button[data-action="create-new-contact"]').scrollIntoView()
        await $('div[data-name="contacts-edit-column"] span').click()
        await delay(1000)
        const sourceExist = await $('app-column-edit #column-country').isSelected()
        if(!sourceExist) await $('app-column-edit label[for="column-country"]').click()
        await $('button[data-action="edit-column-apply"]').click()
        await delay(3000)
        let testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            await selectContact(testingContact)
        }
        await $('div[data-name="material-action-item-More"]').click()
        await $('div[data-name="material-action-item-More-Edit"]').click()
        await $('app-contact-bulk').waitForDisplayed({ timeout: 3000 })
        await delay(2000)
        await $('mat-select[name="contact-country"]').click()
        await $('mat-option[data-name="contact-country-France"]').click()
        await delay(2000)
        await $('button[data-action="contact-bulk-edit-save"]').click()
        await $('app-custom-toast').waitForDisplayed({ timeout: 10000 })
        await $('app-custom-toast').click()
        await $('app-custom-toast').waitForDisplayed({ reverse: true })
        await $('button[data-action="contact-bulk-edit-cancel"]').click()
        await $('app-contact-bulk').waitForDisplayed({ reverse: true })
        await delay(3000)
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await testingContactTr.$('td.mat-column-country span').scrollIntoView()
            await expect(testingContactTr.$('td.mat-column-country span')).toHaveText('FR')
        }
        await delay(3000)
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            await selectContact(testingContact)
        }
        await $('button[data-action="create-new-contact"]').scrollIntoView()
        await $('div[data-name="contacts-edit-column"]').click()
        await $('app-column-edit div[data-name="task-column-item-country"] i.i-close').scrollIntoView()
        await $('app-column-edit div[data-name="task-column-item-country"] i.i-close').click()
        await $('button[data-action="edit-column-apply"]').click()
        await delay(3000)
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await expect(testingContactTr.$('td.mat-column-country span')).not.toExist()
        }
    })
    it('state', async () => {
        await goToPage('contacts')
        await $('div[data-name="contacts-edit-column"] span').waitForClickable({ timeout: 10000 })
        await $('button[data-action="create-new-contact"]').scrollIntoView()
        await $('div[data-name="contacts-edit-column"] span').click()
        await delay(1000)
        const sourceExist = await $('app-column-edit #column-state').isSelected()
        if(!sourceExist) await $('app-column-edit label[for="column-state"]').click()
        await $('button[data-action="edit-column-apply"]').click()
        await delay(3000)
        let testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            await selectContact(testingContact)
        }
        await $('div[data-name="material-action-item-More"]').waitForClickable({ timeout: 3000 })
        await $('div[data-name="material-action-item-More"]').click()
        await $('div[data-name="material-action-item-More-Edit"]').click()
        await $('app-contact-bulk').waitForDisplayed({ timeout: 3000 })
        await delay(2000)
        await $('mat-select[name="contact-state"]').click()
        await $('mat-option[data-name="contact-state-California"]').click()
        await delay(2000)
        await $('button[data-action="contact-bulk-edit-save"]').click()
        await $('app-custom-toast').waitForDisplayed({ timeout: 10000 })
        await $('app-custom-toast').click()
        await $('app-custom-toast').waitForDisplayed({ reverse: true })
        await $('button[data-action="contact-bulk-edit-cancel"]').click()
        await $('app-contact-bulk').waitForDisplayed({ reverse: true })
        await delay(3000)
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            await selectContact(testingContact)
        }
        await delay(3000)
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await expect(testingContactTr.$('td.mat-column-state span')).toHaveText('California')
        }
        await $('button[data-action="create-new-contact"]').scrollIntoView()
        await $('div[data-name="contacts-edit-column"]').click()
        await $('app-column-edit div[data-name="task-column-item-state"] i.i-close').scrollIntoView()
        await $('app-column-edit div[data-name="task-column-item-state"] i.i-close').click()
        await $('button[data-action="edit-column-apply"]').click()
        await delay(3000)
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await expect(testingContactTr.$('td.mat-column-state span')).not.toExist()
        }
    })
    it('zipcode', async () => {
        await goToPage('contacts')
        await $('div[data-name="contacts-edit-column"] span').waitForClickable({ timeout: 10000 })
        await $('button[data-action="create-new-contact"]').scrollIntoView()
        await $('div[data-name="contacts-edit-column"] span').click()
        await delay(1000)
        const zipcodeExist = await $('app-column-edit #column-zipcode').isSelected()
        if(!zipcodeExist) await $('app-column-edit label[for="column-zipcode"]').click()
        await $('button[data-action="edit-column-apply"]').click()
        await delay(3000)
        let testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            await selectContact(testingContact)
        }
        await $('div[data-name="material-action-item-More"]').click()
        await $('div[data-name="material-action-item-More-Edit"]').click()
        await $('app-contact-bulk').waitForDisplayed({ timeout: 3000 })
        await delay(2000)
        await $('input[name="zipcode"]').setValue('12345')
        await delay(2000)
        await $('button[data-action="contact-bulk-edit-save"]').click()
        await $('app-custom-toast').waitForDisplayed({ timeout: 10000 })
        await $('app-custom-toast').click()
        await $('app-custom-toast').waitForDisplayed({ reverse: true })
        await $('button[data-action="contact-bulk-edit-cancel"]').click()
        await $('app-contact-bulk').waitForDisplayed({ reverse: true })
        await delay(3000)
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            await selectContact(testingContact)
        }
        await delay(3000)
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await expect(testingContactTr.$('td.mat-column-zipcode span')).toHaveText('12345')
        }
        await $('button[data-action="create-new-contact"]').scrollIntoView()
        await $('div[data-name="contacts-edit-column"]').click()
        await $('app-column-edit div[data-name="task-column-item-zipcode"] i.i-close').scrollIntoView()
        await $('app-column-edit div[data-name="task-column-item-zipcode"] i.i-close').click()
        await $('button[data-action="edit-column-apply"]').click()
        await delay(3000)
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            const testingContactTr = await browser.custom$('closest', testingContactElement)
            await expect(testingContactTr.$('td.mat-column-zipcode span')).not.toExist()
        }
    })
})


describe('Filter', () => {
    describe('Label', () => {
        it('Inclusive', async () => {
            await goToPage('contacts')
            await $('span[data-name="contact-list-filter"]').waitForClickable({ timeout: 10000 })
            await $('span[data-name="contact-list-filter"]').click()
            await $('div[data-name="contact-filter-item-Label"]').click()
            await $('app-advanced-filter-label').waitForDisplayed({ timeout: 3000 })
            await $('label[data-name="task-contact-filter-label-Hot"]').click()
            await $('button[data-action="task-filter-contact-status-label-apply"]').click()
            await $('app-advanced-filter-label').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('Label')
            await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText('Hot')
            await $('span[data-name="contact-filter-clear"]').click()
            await delay(3000)
        })
        it('Exclusive', async () => {
            await goToPage('contacts')
            await $('span[data-name="contact-list-filter"]').waitForClickable({ timeout: 10000 })
            await $('span[data-name="contact-list-filter"]').click()
            await $('div[data-name="contact-filter-item-Label"]').click()
            await $('app-advanced-filter-label').waitForDisplayed({ timeout: 3000 })
            await $('div[data-name="contact-filter-label-exclusive"]').click()
            await $('label[data-name="task-contact-filter-label-Hot"]').click()
            await $('button[data-action="task-filter-contact-status-label-apply"]').click()
            await $('app-advanced-filter-label').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('Label')
            await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:nth-of-type(2)')).toHaveText('Excludes')
            await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText('Hot')
            await $('span[data-name="contact-filter-clear"]').click()
            await delay(3000)
        })
    })
    describe('Source', () => {
        it('Inclusive', async () => {
            await goToPage('contacts')
            await $('span[data-name="contact-list-filter"]').waitForClickable({ timeout: 10000 })
            await $('span[data-name="contact-list-filter"]').click()
            await $('div[data-name="contact-filter-item-Source"]').click()
            await $('app-advanced-filter-source').waitForDisplayed({ timeout: 3000 })
            await $('app-input-source mat-form-field').click()
            await $('div[data-name="no-source"]').click()
            await $('button[data-action="source-select-apply"]').click()
            await $('app-advanced-filter-source').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('Source')
            await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText('No Source')
            await $('span[data-name="contact-filter-clear"]').click()
            await delay(3000)
        })
        it('Exclusive', async () => {
            await goToPage('contacts')
            await $('span[data-name="contact-list-filter"]').waitForClickable({ timeout: 10000 })
            await $('span[data-name="contact-list-filter"]').click()
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
            await $('span[data-name="contact-filter-clear"]').click()
            await delay(3000)
        })
    })
    describe('Company', () => {
        it('Inclusive', async () => {
            await goToPage('contacts')
            await $('span[data-name="contact-list-filter"]').waitForClickable({ timeout: 10000 })
            await $('span[data-name="contact-list-filter"]').click()
            await $('div[data-name="contact-filter-item-Company"]').click()
            await $('app-advanced-filter-company').waitForDisplayed({ timeout: 3000 })
            await $('app-input-company mat-form-field').click()
            await $('div[data-name="no-company"]').click()
            await $('button[data-action="company-select-apply"]').click()
            await $('app-advanced-filter-company').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('Company')
            await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText('')
            await $('span[data-name="contact-filter-clear"]').click()
            await delay(3000)
        })
        it('Exclusive', async () => {
            await goToPage('contacts')
            await $('span[data-name="contact-list-filter"]').waitForClickable({ timeout: 10000 })
            await $('span[data-name="contact-list-filter"]').click()
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
            await $('span[data-name="contact-filter-clear"]').click()
            await delay(3000)
        })
    })
    describe('Tag', () => {
        it('Inclusive', async () => {
            await goToPage('contacts')
            await $('span[data-name="contact-list-filter"]').waitForClickable({ timeout: 10000 })
            await $('button[data-action="create-new-contact"]').scrollIntoView()
            await $('span[data-name="contact-list-filter"]').click()
            await $('div[data-name="contact-filter-item-Tag"]').click()
            await $('app-advanced-filter-tag').waitForDisplayed({ timeout: 3000 })
            await $('app-input-tag mat-form-field').click()
            await $('div=Testing Tag').click()
            await $('button[data-action="tag-select-apply"]').click()
            await $('app-advanced-filter-tag').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('Tag')
            await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText('Testing Tag')
            await $('span[data-name="contact-filter-clear"]').click()
            await delay(3000)
        })
        it('Exclusive', async () => {
            await goToPage('contacts')
            await $('span[data-name="contact-list-filter"]').waitForClickable({ timeout: 10000 })
            await $('button[data-action="create-new-contact"]').scrollIntoView()
            await $('span[data-name="contact-list-filter"]').click()
            await $('div[data-name="contact-filter-item-Tag"]').click()
            await $('app-advanced-filter-tag').waitForDisplayed({ timeout: 3000 })
            await $('div=Exclude').click()
            await $('app-input-tag mat-form-field').click()
            await $('div=Testing Tag').click()
            await $('button[data-action="tag-select-apply"]').click()
            await $('app-advanced-filter-tag').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('Tag')
            await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:nth-of-type(2)')).toHaveText('Excludes')
            await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText('Testing Tag')
            await $('span[data-name="contact-filter-clear"]').click()
            await delay(3000)
        })
    })
    describe('Other', () => {
        it('Deal', async () => {
            await goToPage('contacts')
            await $('span[data-name="contact-list-filter"]').waitForClickable({ timeout: 10000 })
            await $('span[data-name="contact-list-filter"]').click()
            await $('div[data-name="contact-filter-item-Stage"]').click()
            await $('app-advanced-filter-stage').waitForDisplayed({ timeout: 3000 })
            await $('app-input-stage mat-form-field').click()
            await $('mat-option:first-of-type').click()
            await $('button[data-action="contact-filter-stage-apply"]').click()
            await $('app-advanced-filter-stage').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('Stage')
            await $('span[data-name="contact-filter-clear"]').click()
            await delay(3000)
        })
        it('Country', async () => {
            await goToPage('contacts')
            await $('span[data-name="contact-list-filter"]').waitForClickable({ timeout: 10000 })
            await $('span[data-name="contact-list-filter"]').click()
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
            await $('span[data-name="contact-filter-clear"]').click()
            await delay(3000)
        })
        it('City', async () => {
            await goToPage('contacts')
            await $('span[data-name="contact-list-filter"]').waitForClickable({ timeout: 10000 })
            await $('span[data-name="contact-list-filter"]').click()
            await $('div[data-name="contact-filter-item-City"]').click()
            await $('app-advanced-filter-city').waitForDisplayed({ timeout: 3000 })
            await $('app-advanced-filter-city input[name="city"]').setValue('Madrid')
            await $('button[data-action="contact-filter-city-apply"]').click()
            await $('app-advanced-filter-city').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('City')
            await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText('Madrid')
            await $('span[data-name="contact-filter-clear"]').click()
            await delay(3000)
        })
        it('State', async () => {
            await goToPage('contacts')
            await $('span[data-name="contact-list-filter"]').waitForClickable({ timeout: 10000 })
            await $('span[data-name="contact-list-filter"]').click()
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
            await $('span[data-name="contact-filter-clear"]').click()
            await delay(3000)
        })
        it('Zipcode', async () => {
            await goToPage('contacts')
            await $('span[data-name="contact-list-filter"]').waitForClickable({ timeout: 10000 })
            await $('span[data-name="contact-list-filter"]').click()
            await $('div[data-name="contact-filter-item-Zipcode"]').click()
            await $('app-advanced-filter-zipcode').waitForDisplayed({ timeout: 3000 })
            await $('app-advanced-filter-zipcode input[data-name="input-zipcode"]').setValue('12345')
            await $('button[data-action="zipcode-select-apply"]').click()
            await $('app-advanced-filter-zipcode').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('Zipcode')
            await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText('12345')
            await $('span[data-name="contact-filter-clear"]').click()
            await delay(3000)
        })
        it('Save Filter', async () => {
            await goToPage('contacts')
            await $('span[data-name="contact-list-filter"]').waitForClickable({ timeout: 10000 })
            await $('span[data-name="contact-list-filter"]').click()
            await $('div[data-name="contact-filter-item-Label"]').click()
            await $('app-advanced-filter-label').waitForDisplayed({ timeout: 3000 })
            await $('label[data-name="task-contact-filter-label-Hot"]').click()
            await $('button[data-action="task-filter-contact-status-label-apply"]').click()
            await $('app-advanced-filter-label').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('Label')
            await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText('Hot')
            await delay(1000)
            await $('span[data-name="contact-filter-save"]').click()
            await $('app-filter-add').waitForDisplayed({ timeout: 3000 })
            await $('app-filter-add input[name="name"]').setValue('User filter')
            await delay(2000)
            await $('button[data-action="contact-filter-save-confirm"]').click()
            await $('app-filter-add').waitForDisplayed({ reverse: true })
            await $('span[data-name="contact-filter-clear"]').click()
            await delay(3000)
            await $('span[data-name="contact-list-filter"]').click()
            await $('span=User filter').click()
            await delay(3000)
            await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:first-of-type')).toHaveText('Label')
            await expect($('app-filter-options div.chip > div.mat-menu-trigger > span:last-of-type span')).toHaveText('Hot')
            await $('span[data-name="contact-filter-clear"]').click()
            await delay(3000)
            await $('span[data-name="contact-list-filter"]').click()
            await $('span.save-filter-item-delete i.i-trash').click()
            await $('button[data-action="confirm-downgrade"]').click()
            await delay(2000)
        })
    })
})
describe('Edit Columns', () => {
    it('Mark', async () => {
        await goToPage('contacts')
        await $('div[data-name="contacts-edit-column"]').click()
        await $('app-column-edit').waitForDisplayed({ timeout: 2000 })
        const favoriteSportColumnExist = await $('div[data-name="task-column-item-custom_favorite sport"]').isExisting()
        if(favoriteSportColumnExist) {
            await $('div[data-name="task-column-item-custom_favorite sport"] i.i-close').scrollIntoView()
            await $('div[data-name="task-column-item-custom_favorite sport"] i.i-close').click()
        }
        await $('label[for="column-website"]').click()
        await $('button[data-action="edit-column-apply"]').click()
        await $('app-column-edit').waitForDisplayed({ reverse: true })
        await delay(2000)
        await expect($('table thead tr.table-header th.mat-column-website')).toExist()
    })
    it('Remove', async () => {
        await goToPage('contacts')
        await $('div[data-name="contacts-edit-column"]').waitForClickable({ timeout: 5000 })
        await $('div[data-name="contacts-edit-column"]').click()
        await $('app-column-edit').waitForDisplayed({ timeout: 2000 })
        await $('div.cdk-overlay-container div[data-name="task-column-item-website"] i.i-close').scrollIntoView()
        await $('div.cdk-overlay-container div[data-name="task-column-item-website"] i.i-close').click()
        await $('button[data-action="edit-column-apply"]').click()
        await $('app-column-edit').waitForDisplayed({ reverse: true })
        await delay(2000)
        await expect($('table thead tr.table-header th.mat-column-website')).not.toExist()
    })
})
describe('Adding New Custom Contact Field', () => {
    it('Text', async () => {
        await goToSubmenu('contactManager')
        await $('span[data-name="profile-tab-item-Custom Contact Fields"]').click()
        const paginationExist = await $('span[data-name="contact-custom-fields-page-size"]').isDisplayed()
        if(paginationExist) {
            await $('span[data-name="contact-custom-fields-page-size"]').click()
            await $('div[data-name="contact-custom-fields-page-size-25"]').click()
        }
        await $('button[data-action="contacts-add-custom-field"]').click()
        await $('app-custom-field-add').waitForDisplayed({ timeout: 2000 })
        await $('input[name="field_name"]').setValue('hobby')
        await delay(3000)
        await $('select[name="field"]').selectByVisibleText('Text')
        await $('input[name="placeholder_text"]').setValue('football')
        await delay(3000)
        await $('mat-dialog-actions button[type="submit"]').click()
        await $('app-custom-field-add').waitForDisplayed({ reverse: true })
        await delay(3000)
        await expect($('div=hobby')).toBeDisplayed()
    })
    it('Delete with action header', async () => {
        await customContactFieldRemove('hobby')
    })
    it('Dropdown', async () => {
        await goToSubmenu('contactManager')
        await $('span[data-name="profile-tab-item-Custom Contact Fields"]').click()
        const paginationExist = await $('span[data-name="contact-custom-fields-page-size"]').isDisplayed()
        if(paginationExist) {
            await $('span[data-name="contact-custom-fields-page-size"]').click()
            await $('div[data-name="contact-custom-fields-page-size-25"]').click()
        }
        await $('button[data-action="contacts-add-custom-field"]').click()
        await $('app-custom-field-add').waitForDisplayed({ timeout: 2000 })
        await $('input[name="field_name"]').setValue('select')
        await delay(2000)
        await $('select[name="field"]').selectByVisibleText('Dropdown')
        await delay(2000)
        await $('div.dropdown-options:last-of-type input[type="text"]').setValue('item 1')
        await $('button.w-100').click()
        await $('div.dropdown-options:last-of-type input[type="text"]').setValue('item 2')
        await $('mat-dialog-actions button[type="submit"]').click()
        await $('app-custom-field-add').waitForDisplayed({ reverse: true })
        await delay(3000)
        await expect($('div=select')).toBeDisplayed()
        await customContactFieldRemove('select')
    })
})
describe('Edit Custom Field', () => {
    it('Resetup Test Data', async () => {
        await goToSubmenu('contactManager')
        await $('span[data-name="profile-tab-item-Custom Contact Fields"]').click()
        const paginationExist = await $('span[data-name="contact-custom-fields-page-size"]').isDisplayed()
        if(paginationExist) {
            await $('span[data-name="contact-custom-fields-page-size"]').click()
            await $('div[data-name="contact-custom-fields-page-size-25"]').click()
        }
        await delay(5000)
        const favoriteSport = await $('div=favorite sport').isDisplayed()
        if (!favoriteSport) {
            await $('button[data-action="contacts-add-custom-field"]').click()
            await $('app-custom-field-add').waitForDisplayed({ timeout: 2000 })
            await $('input[name="field_name"]').setValue('favorite sport')
            await $('select[name="field"]').selectByVisibleText('Text')
            await $('input[name="placeholder_text"]').setValue('football')
            await $('mat-dialog-actions button[type="submit"]').click()
            await $('app-custom-field-add').waitForDisplayed({ reverse: true })
            await delay(3000)
        }        
        await expect($('div=favorite sport')).toBeDisplayed()
    })
    it('Hover', async () => {
        const favoriteSport = await $('div=favorite sport')
        const favoriteSportCheckbox = await browser.custom$('closest_field-item', favoriteSport)
        await favoriteSportCheckbox.$('i.i-menu-more').click()
        await favoriteSportCheckbox.$('button[data-action="contact-custom-field-edit"]').click()
        await $('app-custom-field-add').waitForDisplayed({ timeout: 2000 })
        await $('input[name="field_name"]').setValue('favorite game')
        await $('button=Update').click()
        await $('app-custom-field-add').waitForDisplayed({ reverse: true })
        await delay(3000)
        await expect($('div=favorite game')).toBeDisplayed()
    })
    it('Mark', async () => {
        const favoriteSport = await $('div=favorite game')
        const favoriteSportCheckbox = await browser.custom$('closest_field-item', favoriteSport)
        await browser.execute(ele => {
            ele.querySelector('input[type="checkbox"]').click()
        }, favoriteSportCheckbox)
        await $('div[data-name="material-action-item-Edit"]').click()
        await $('app-custom-field-add').waitForDisplayed({ timeout: 2000 })
        await $('input[name="field_name"]').setValue('favorite music')
        await $('button=Update').click()
        await $('app-custom-field-add').waitForDisplayed({ reverse: true })
        await delay(3000)
        await expect($('div=favorite music')).toBeDisplayed()
    })
    it('Delete Hover', async () => {
        await customContactFieldRemove('favorite music')
    })
})
describe('Tag', () => {
    describe('Create a New Tag', () => {
        it('create', async () => {
            await goToSubmenu('contactManager')
            await $('span[data-name="profile-tab-item-Tag Manager"]').click()
            const tagManagerPaginationExist = await $('span[data-name="contact-tag-manager-page-size"]').isExisting()
            if(tagManagerPaginationExist) {
                await $('span[data-name="contact-tag-manager-page-size"]').click()
                await $('div[data-name="contact-tag-manager-page-size-50"]').click()
            }
            await $('input[name="edit_tag_name"]').setValue('test tag')
            await delay(3000)
            await $('button[data-action="contact-tag-save"]').click()
            await delay(3000)
            await expect($('div=test tag')).toBeDisplayed()
        })
    })
    describe.skip('Merge Tag', () => {
        it('Mark', async () => {
            await goToSubmenu('contactManager')
            await $('span[data-name="profile-tab-item-Tag Manager"]').waitForClickable({ timeout: 2000 })
            await $('span[data-name="profile-tab-item-Tag Manager"]').click()
            const paginationExist = await $('span[data-name="contact-tag-manager-page-size"]').isDisplayed()
            if(paginationExist) {
                await $('span[data-name="contact-tag-manager-page-size"]').click()
                await $('div[data-name="contact-tag-manager-page-size-50"]').click()
            }
            const testTag1 = await $('div=test tag1')
            const testTag2 = await $('div=test tag2')
            const testTag1Checkbox = await browser.custom$('closest_tag-item', testTag1)
            const testTag2Checkbox = await browser.custom$('closest_tag-item', testTag2)
            await testTag1Checkbox.$('div.custom-checkbox').waitForClickable({ timeout: 3000 })
            await testTag2Checkbox.$('div.custom-checkbox').click()
            await testTag1Checkbox.$('div.custom-checkbox').click()
            await $('div[data-name="material-action-item-Merge"]').click()
            await $('app-tag-merge').waitForDisplayed({ timeout: 2000 })
            await $('mat-select[name="merge_to"]').click()
            await $('body div.cdk-overlay-pane mat-option:last-of-type').click()
            await $('app-tag-merge mat-dialog-actions button[data-action="contact-tag-merge"]').click()
            await $('app-tag-merge').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('div=test tag1')).toBeDisplayed()
            await expect($('div=test tag2')).not.toExist()
        })
        it('Hover', async () => {
            await goToSubmenu('contactManager')
            await $('span[data-name="profile-tab-item-Tag Manager"]').waitForClickable({ timeout: 2000 })
            await $('span[data-name="profile-tab-item-Tag Manager"]').click()
            const paginationExist = await $('span[data-name="contact-tag-manager-page-size"]').isDisplayed()
            if(paginationExist) {
                await $('span[data-name="contact-tag-manager-page-size"]').click()
                await $('div[data-name="contact-tag-manager-page-size-50"]').click()
            }
            const testTag1 = await $('div=test tag1')
            const testTag1Checkbox = await browser.custom$('closest_tag-item', testTag1)
            await testTag1Checkbox.$('i.i-menu-more').waitForClickable({ timeout: 3000 })
            await testTag1Checkbox.$('i.i-menu-more').click()
            await testTag1Checkbox.$('button[data-action="contact-tag-merge"]').click()
            await $('app-tag-merge').waitForDisplayed({ timeout: 2000 })
            await $('app-tag-merge').$('span=Select Tag').click()
            await delay(3000)
            await $('div.cdk-overlay-pane').$('div=test tag').waitForClickable({ timeout: 3000 })
            await $('div.cdk-overlay-pane').$('div=test tag').click()
            await $('app-tag-merge mat-dialog-actions button[data-action="contact-tag-merge"]').click()
            await $('app-tag-merge').waitForDisplayed({ reverse: true })
            await delay(5000)
            await expect($('app-tag-manager').$('div=test tag')).toBeDisplayed()
            await expect($('app-tag-manager').$('div=test tag1')).not.toExist()
        })
    })
    describe('Edit Tag', () => {
        it('Edit', async () => {
            await goToSubmenu('contactManager')
            await $('span[data-name="profile-tab-item-Tag Manager"]').click()
            const paginationExist = await $('span[data-name="contact-tag-manager-page-size"]').isExisting()
            if(paginationExist) {
                await $('span[data-name="contact-tag-manager-page-size"]').click()
                await $('div[data-name="contact-tag-manager-page-size-50"]').click()
            }
            const testTagExist = await $('app-tag-manager').$('div=test tag').isDisplayed()
            if(testTagExist) {
                const testTag = await $('app-tag-manager').$('div=test tag')
                const testTagItem = await browser.custom$('closest_tag-item', testTag)
                await testTag.scrollIntoView()
                await browser.execute(ele => {
                    ele.querySelector('input[type="checkbox"]').click();
                }, testTagItem)
                await $('app-tag-manager div[data-name="material-action-item-Edit"').click()
                await $('app-tag-edit').waitForDisplayed({ timeout: 2000 })
                await $('input[name="tag_name"]').setValue('my tag')
                await $('button[data-action="contact-tag-edit-update"]').click()
                await $('app-tag-edit').waitForDisplayed({ reverse: true })
                await delay(3000)
                await expect($('div=my tag')).toBeDisplayed()
            }
        })
    })
    describe('Delete Tags', () => {
        it('Mark', async () => {
            await tagRemove('my tag')
        })
        it.skip('Hover', async () => {
            await goToSubmenu('contactManager')
            await $('span[data-name="profile-tab-item-Tag Manager"]').waitForClickable({ timeout: 2000 })
            await $('span[data-name="profile-tab-item-Tag Manager"]').click()
            const paginationExist = await $('span[data-name="contact-tag-manager-page-size"]').isDisplayed()
            if(paginationExist) {
                await $('span[data-name="contact-tag-manager-page-size"]').scrollIntoView()
                await $('span[data-name="contact-tag-manager-page-size"]').click()
                await $('div[data-name="contact-tag-manager-page-size-50"]').click()
            }
            const testingTag = await $('div=Testing Tag')
            const testingTagCheckbox = await browser.custom$('closest_tag-item', testingTag)
            await testingTagCheckbox.$('i.i-menu-more').waitForClickable({ timeout: 3000 })
            await testingTagCheckbox.$('i.i-menu-more').click()
            await testingTagCheckbox.$('button[data-action="contact-tag-delete"]').click()
            await $('app-tag-delete').waitForDisplayed({ timeout: 2000 })
            await $('button[data-action="contact-tag-delete-confirm"]').click()
            await $('app-tag-delete').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('div=Testing Tag')).not.toExist()
        })
    })
})
describe('Label', () => {
    describe('Create a New Label', () => {
        it('create', async () => {
            await goToSubmenu('contactManager')
            await $('span[data-name="profile-tab-item-Label Manager"]').click()
            const paginationExist = await $('span[data-name="contact-label-manager-page-size"]').isExisting()
            if(paginationExist) {
                await $('span[data-name="contact-label-manager-page-size"]').click()
                await $('div[data-name="contact-label-manager-page-size-50"]').click()
            }
            await delay(6000)
            await $('input[name="edit_label_name"]').setValue('test label')
            await delay(2000)
            await $('button[data-action="contact-label-save"]').click()
            await delay(3000)
            const editDialog = await $('app-label-edit-color').isDisplayed()
            if(editDialog) {
                await $('div[title="#3d78d8"]').click()
                await $('app-label-edit-color').$('button=Apply').click()
            }
            await delay(3000)
            await expect($('span=test label')).toBeDisplayed()
        })
    })
    describe.skip('Merge Label', () => {
        it('Mark', async () => {
            await goToSubmenu('contactManager')
            await $('span[data-name="profile-tab-item-Label Manager"]').click()
            const paginationExist = await $('span[data-name="contact-label-manager-page-size"]').isExisting()
            if(paginationExist) {
                await $('span[data-name="contact-label-manager-page-size"]').click()
                await $('div[data-name="contact-label-manager-page-size-50"]').click()
            }
            const testLabel1 = await $('span=test label1')
            const testLabel2 = await $('span=test label2')
            const testLabel1Checkbox = await browser.custom$('closest_label-item', testLabel1)
            const testLabel2Checkbox = await browser.custom$('closest_label-item', testLabel2)
            await testLabel1Checkbox.$('div.custom-checkbox').waitForClickable({ timeout: 3000 })
            await testLabel2Checkbox.$('div.custom-checkbox').click()
            await testLabel1Checkbox.$('div.custom-checkbox').click()
            await $('div[data-name="material-action-item-Merge"]').click()
            await $('app-label-merge').waitForDisplayed({ timeout: 2000 })
            await $('app-input-label div.mat-chip-list-wrapper').click()
            await $('span=test label1').click()
            await $('app-label-merge mat-dialog-actions').$('button=Merge').click()
            await $('app-label-merge').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('span=test label1')).toBeDisplayed()
            await expect($('span=test label2')).not.toExist()
        })
        it('Hover', async () => {
            await goToSubmenu('contactManager')
            await $('span[data-name="profile-tab-item-Label Manager"]').click()
            const paginationExist = await $('span[data-name="contact-label-manager-page-size"]').isExisting()
            if(paginationExist) {
                await $('span[data-name="contact-label-manager-page-size"]').click()
                await $('div[data-name="contact-label-manager-page-size-50"]').click()
            }
            const testLabel2 = await $('span=test label2')
            const testLabel2Checkbox = await browser.custom$('closest_label-item', testLabel2)
            await testLabel2Checkbox.$('i.i-menu-more').waitForClickable({ timeout: 3000 })
            await testLabel2Checkbox.$('i.i-menu-more').click()
            await testLabel2Checkbox.$('button[data-action="contact-label-merge-btn"]').click()
            await $('app-label-merge').waitForDisplayed({ timeout: 3000 })
            await $('app-input-label div.mat-chip-list-wrapper').click()
            await $('span=test label').waitForClickable({ timeout: 3000 })
            await $('span=test label').click()
            await $('app-label-merge mat-dialog-actions button[data-action="contact-label-merge"]').click()
            await $('app-label-merge').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('span=test label')).toBeDisplayed()
            await expect($('span=test label2')).not.toExist()
        })
    })
    if(!isVortex) describe('Edit Label', () => {
        it('Edit', async () => {
            await goToSubmenu('contactManager')
            await $('span[data-name="profile-tab-item-Label Manager"]').click()
            const paginationExist = await $('span[data-name="contact-label-manager-page-size"]').isExisting()
            if(paginationExist) {
                await $('span[data-name="contact-label-manager-page-size"]').click()
                await $('div[data-name="contact-label-manager-page-size-50"]').click()
            }
            const testLabel = await $('span=test label')
            const testLabelCheckbox = await browser.custom$('closest_label-item', testLabel)
            await testLabelCheckbox.$('i.i-menu-more').waitForClickable({ timeout: 3000 })
            await testLabelCheckbox.$('i.i-menu-more').click()
            await testLabelCheckbox.$('button[data-action="contact-label-edit-btn"]').click()
            await $('app-label-edit').waitForDisplayed({ timeout: 2000 })
            await $('input[name="labelText"]').setValue('my label')
            await $('app-label-edit mat-dialog-actions button[type="submit"]').click()
            await $('app-label-edit').waitForDisplayed({ reverse: true })
            await delay(3000)
            await expect($('span=my label')).toBeDisplayed()
            await expect($('span=test label')).not.toExist()
            // delete custom label for next test
            const myLabel = await $('span=my label')
            const myLabelCheckbox = await browser.custom$('closest_label-item', myLabel)
            await myLabelCheckbox.$('i.i-menu-more').waitForClickable({ timeout: 3000 })
            await myLabelCheckbox.$('i.i-menu-more').click()
            await $('button[data-action="contact-label-delete-btn"]').click()
            await $('button[data-action="confirm-downgrade"]').click()
            await delay(5000)
            await expect($('span=my label')).not.toExist()
        })
    })
    describe('Delete Label', () => {
        it('Mark', async () => {
            await labelRemove('my label')
        })
        it.skip('Hover', async () => {
            await goToSubmenu('contactManager')
            await $('span[data-name="profile-tab-item-Label Manager"]').click()
            const paginationExist = await $('span[data-name="contact-label-manager-page-size"]').isExisting()
            if(paginationExist) {
                await $('span[data-name="contact-label-manager-page-size"]').click()
                await $('div[data-name="contact-label-manager-page-size-50"]').click()
            }
            await $('input[name="edit_label_name"]').setValue('test label')
            await $('button[data-action="contact-label-save"]').click()
            await delay(3000)
            await expect($('div.table-body div.label-item:first-of-type div.label-col span')).toHaveText('test label')
            await delay(3000)
            const testLabel = await $('span=test label')
            const testLabelCheckbox = await browser.custom$('closest_label-item', testLabel)
            await testLabelCheckbox.$('i.i-menu-more').waitForClickable({ timeout: 3000 })
            await testLabelCheckbox.$('i.i-menu-more').click()
            await testLabelCheckbox.$('button[data-action="contact-label-delete-btn"]').click()
            await $('button[data-action="confirm-downgrade"]').click()
            await delay(5000)
            await expect($('span=test label')).not.toExist()
        })
    })
})
describe.skip('Download Contact', () => {
    it('Download', async () => {
        await goToPage('contacts')
        let testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            await selectContact(testingContact)
        }
        await $('div[data-name="material-action-item-More"]').click()
        await $('div[data-name="material-action-item-More-Download"]').waitForDisplayed({ timeout: 5000 })
        await $('div[data-name="material-action-item-More-Download"] i.i-download').click()
        await $('app-contact-download-progress-bar').waitForDisplayed({ timeout: 10000 })
        await expect($('div=Download Result(downloading)')).toBeDisplayed()
        await delay(5000)
        testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            await selectContact(testingContact)
        }
    })
})
describe('Delete Contacts', () => {
    it('Delete', async () => {
        await goToPage('contacts')
        let testingContactElement = await $('span=' + testingContact)
        await testingContactElement.waitForExist()
        if(testingContactElement) {
            await delay(3000)
            await selectContact(testingContact)
        }
        await $('div[data-name="material-action-item-More"]').waitForClickable({ timeout: 2000 })
        await $('div[data-name="material-action-item-More"]').click()
        await $('div[data-name="material-action-item-More-Delete"]').click()
        await $('button[data-action="confirm-downgrade"]').click()
        await delay(5000)
        await expect($('span=' + testingContact)).not.toExist()
    })
})
