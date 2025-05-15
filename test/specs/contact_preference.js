
const { expect, browser } = require('@wdio/globals');
const path = require('path');
const { goToPage, goToSubmenu } = require('./sidebar');
const { Console } = require('console');
const isVortex = require('../test-data/testdata').isVortex

const delay = (ms) => {
    return new Promise(res => {
       setTimeout(() => {
        res()
       }, ms) 
    })
}

const testTag = 'wang-tag';
const testStatus = 'wang-status';
const testCustomField = 'wang-custom-field';

describe('Contact Manager', async () => {
    before (async () => {
        await goToSubmenu('contactManager');
    });
    
    describe('Tag', async () => {
        it ('Delete Tag', async () => {
            const tagManagerPaginationExist = await $('span[data-name="contact-tag-manager-page-size"]').isExisting();
            if(tagManagerPaginationExist) {
                await $('span[data-name="contact-tag-manager-page-size"]').click();
                await $('div[data-name="contact-tag-manager-page-size-50"]').click();
            }

            const tagExist = await $(`div=${testTag}`);
            if(await tagExist?.isExisting()) {
                const parent = await tagExist.$('../..');
                await parent.$('a').click(); //dropdown toggle
                await parent.$(`button=Delete`).click();
                await $('mat-dialog-content').waitForDisplayed({ timeout: 2000 });
                await $('button[data-action="contact-tag-delete-confirm"]').click();
                await delay(3000);
            }
            await expect($(`div=${testTag}`)).not.toExist();
        })
        it('Add Tag', async () => {
            const tagManagerPaginationExist = await $('span[data-name="contact-tag-manager-page-size"]').isExisting();
            if(tagManagerPaginationExist) {
                await $('span[data-name="contact-tag-manager-page-size"]').click();
                await $('div[data-name="contact-tag-manager-page-size-50"]').click();
            }
            await $('input[name="edit_tag_name"]').setValue(`${testTag}0`);
            await delay(1000);
            await $('button[data-action="contact-tag-save"]').click();
            await delay(3000);
            await expect($(`div=${testTag}0`)).toExist();
        })
        
        it ('Edit Tag', async () => {
            await goToSubmenu('contactManager')
            const tagManagerPaginationExist = await $('span[data-name="contact-tag-manager-page-size"]').isExisting();
            if(tagManagerPaginationExist) {
                await $('span[data-name="contact-tag-manager-page-size"]').click();
                await $('div[data-name="contact-tag-manager-page-size-50"]').click();
            }

            const tagExist = await $(`div=${testTag}0`);
            if(await tagExist?.isExisting()) {
                const parent = await tagExist.$('../..');
                await parent.$('a').click(); //dropdown toggle
                await parent.$(`button=Edit`).click();
                await $('app-tag-edit').waitForDisplayed({ timeout: 2000 });
                await $('app-tag-edit input[name="tag_name"]').setValue(testTag);
                await delay(1000);
                await $('app-tag-edit button[data-action="contact-tag-edit-update"]').click();
                await delay(3000);
            }
            await expect($(`div=${testTag}`)).toExist();
        })
    });
    
    describe('Status', () => {
        before ('Navigate Status', async () => {
            await $('span[data-name="profile-tab-item-Statuses"]').click()
            await delay(2000);
        });
        it ('Delete Status', async () => {
            const statusExist = await $(`app-label-manager`).$(`span=${testStatus}`);
            if(await statusExist?.isExisting()) {
                const parent = await statusExist.$('../..');
                await parent.$('a').click(); //dropdown toggle
                await parent.$(`button=Delete`).click();
                await $('mat-dialog-actions').waitForDisplayed({ timeout: 2000 });
                await $('mat-dialog-actions button[data-action="confirm-downgrade"]').click();
                await delay(3000);
            }
            await expect($(`app-label-manager`).$(`span=${testStatus}`)).not.toExist()
        });
    
        it('Add Status', async () => {
            const statusExist = await $(`app-label-manager`).$(`span=${testStatus}0`).isDisplayed();
            if (!statusExist) {
                await $('input[name="edit_label_name"]').setValue(`${testStatus}0`);
                await delay(1000);
                await $('button=New Status').click();
                await $('mat-dialog-container').waitForDisplayed({ timeout: 2000 });
                await delay(1000);
                await $('div.swatch').click();
                await $('app-label-edit-color button.btn-primary').click();
                await delay(1000);
            }
            await expect($(`app-label-manager`).$(`span=${testStatus}0`)).toExist()
        });
        it ('Edit Status', async () => {
            const statusExist = await $(`app-label-manager`).$(`span=${testStatus}0`);
            if(await statusExist.isDisplayed()) {
                const parent = await statusExist.$('../..');
                await parent.$('a').click(); //dropdown toggle
                await parent.$(`button=Edit`).click();
                await $('mat-dialog-container').waitForDisplayed({ timeout: 2000 });
                await $('app-label-edit input[name="labelText"]').setValue(testStatus);
                await delay(1000);
                await $('app-label-edit button[type="submit"]').click();
                await delay(3000);
            }
            await expect($(`app-label-manager`).$(`span=${testStatus}`)).toExist();
        });
    });

    
    describe('Custom Contact Fields', () => {
        before ('Navigate Custom Contact Fields', async () => {
            await $('span[data-name="profile-tab-item-Custom Contact Fields"]').click()
            await delay(2000);
        });
       
        it ('Delete Custom fields', async () => {
            const paginationExist = await $('span[data-name="contact-tag-manager-page-size"]').isExisting();
            if(paginationExist) {
                await $('span[data-name="contact-tag-manager-page-size"]').click();
                await $('div[data-name="contact-tag-manager-page-size-50"]').click();
            }

            const customFieldExist = await $(`div=${testCustomField}`);
            await delay(3000);
            if(await customFieldExist?.isExisting()) {
                const parent = await customFieldExist.$('..');
                await parent.$('a').click(); //dropdown toggle
                await delay(1000);
                await parent.$(`button=Delete`).click();
                await $('mat-dialog-actions').waitForDisplayed({ timeout: 2000 });
                await $('mat-dialog-actions button.btn-red').click();
                await delay(3000);
            }
            await expect($(`div=${testCustomField}`)).not.toExist()
        });
        
        it('Add Custom fields', async () => {
            const customFieldExist = await $(`div=${testCustomField}0`).isDisplayed();
            if (!customFieldExist) {
                await $('app-custom-fields button[data-action="contacts-add-custom-field"]').click();
                await $('mat-dialog-content input[name="field_name"]').setValue(`${testCustomField}0`);
                await delay(1000);             
                await $('mat-dialog-actions button.btn-primary').click();
                await delay(1000);
            }
            await expect($(`div=${testCustomField}0`)).toExist()
        });
        
        it ('Edit Custom fields', async () => {
            const customFieldExist = await $(`div=${testCustomField}0`);
            if(await customFieldExist.isDisplayed()) {
                const parent = await customFieldExist.$('..');
                await parent.$('a').click(); //dropdown toggle
                await parent.$(`button=Edit`).click();
                await $('mat-dialog-container').waitForDisplayed({ timeout: 2000 });
                await $('mat-dialog-content input[name="field_name"]').setValue(`${testCustomField}`);
                await delay(1000);
                await $('mat-dialog-actions button.btn-primary').click();
                await delay(3000);
            }
            await expect($(`div=${testCustomField}`)).toExist();
        });
    });
});