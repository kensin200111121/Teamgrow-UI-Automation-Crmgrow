const { expect, browser } = require('@wdio/globals');
const globalSetupData = require('../../test-data/testdata').testPrepare;
const path = require('path')

const { goToPage, goToSubmenu } = require('../sidebar')
const isVortex = require('../../test-data/testdata').isVortex
const delay = (ms) => {
    return new Promise(res => {
       setTimeout(() => {
        res()
       }, ms) 
    })
}

describe('Global Data Setup', () => {
    describe('Contacts', () => {
        it('Add Test Contact', async () => {
            await delay(5000)
            await goToPage('contacts')
            await delay(10000)
            const testContactExist = await $('span=' + globalSetupData.contact.name).isDisplayed()
            if(!testContactExist) {
                await $('button[data-action="create-new-contact"]').waitForClickable()
                await $('button[data-action="create-new-contact"]').click()
                await delay(5000)
                await $('input[data-name="contact-create-firstname"]').setValue(globalSetupData.contact.name)
                await $('input[data-name="contact-create-email"]').setValue(globalSetupData.contact.email)
                await $('app-contact-create-edit app-phone-input input[data-name="add-user-phone"]').setValue(globalSetupData.contact.phone)
                if (await $('app-contact-create-edit #company_cc').isExisting() == false) {
                    const companySpan = await browser.execute(() => {
                        const spans = document.querySelectorAll('app-contact-create-edit span');
                        return Array.from(spans).find(span => span.textContent.includes('Company'));
                    });
                    await $(companySpan).click()
                }
                await $('app-contact-create-edit #company_cc').waitForExist(3000);
                await $('app-contact-create-edit input[name="company_cc"]').setValue(globalSetupData.contact.company)
                await delay(2000)
                await $('button[data-action="create-contact-add-btn"]').waitForClickable({ timeout: 3000 })
                await $('button[data-action="create-contact-add-btn"]').click()
                await $('app-contact-create-edit').waitForDisplayed({ reverse: true })
                await delay(5000)
                await expect($('span=' + globalSetupData.contact.name)).toBeDisplayed()
            }
        })
    })
    describe('Pipeline', () => {
        it('Add Test Pipeline', async () => {
            await goToPage('pipeline')
            await $('div[data-name="pipeline-name-list"] span').waitForClickable({ timeout: 3000 })
            await $('div[data-name="pipeline-name-list"] span').click()
            await delay(1000)
            const testPipelineExist = await $(`div[data-name="pipeline-title-${globalSetupData.pipeline.name}"]`).isDisplayed()
            if(!testPipelineExist) {
                await $('div[data-name="add-new-pipeline"]').click()
                await $('app-pipeline-create').waitForDisplayed({ timeout: 3000 })
                await $('input[data-name="pipeline-title"]').setValue(globalSetupData.pipeline.name)
                await $('button[data-action="pipeline-create-confirm"]').click()
                await $('app-pipeline-create').waitForDisplayed({ reverse: true })
                await delay(5000)
                await expect($('h1[data-name="current-pipeline-title"]')).toHaveText('Pipelines - ' + globalSetupData.pipeline.name)
                await delay(5000)
                // Add Stages
                await $('app-deals div.page-title-wrapper div.pipeline-actions').click()
                await $('button[data-action="pipeline-goto-settings"]').click()
                await $('button[data-action="pipeline-add-new-stage"]').waitForClickable({ timeout: 10000 })
                await $('button[data-action="pipeline-add-new-stage"]').click()
                await $('app-deal-stage-create').waitForDisplayed({ timeout: 3000 })
                await $('input[data-name="new-stage-title"]').setValue(globalSetupData.pipeline.stage[0])
                await $('button[data-action="new-stage-create"]').click()
                await $('app-deal-stage-create').waitForDisplayed({ reverse: true })
                await $('a[data-action="pipeline-manager-new-stage"]').waitForClickable({ timeout: 3000 })
                await $('a[data-action="pipeline-manager-new-stage"]').click()
                await $('app-deal-stage-create').waitForDisplayed({ timeout: 3000 })
                await $('input[data-name="new-stage-title"]').setValue(globalSetupData.pipeline.stage[1])
                await $('button[data-action="new-stage-create"]').click()
                await $('app-deal-stage-create').waitForDisplayed({ reverse: true })
                await $('a[data-action="pipeline-manager-new-stage"]').waitForClickable({ timeout: 3000 })
                await $('a[data-action="pipeline-manager-new-stage"]').click()
                await $('app-deal-stage-create').waitForDisplayed({ timeout: 3000 })
                await $('input[data-name="new-stage-title"]').setValue(globalSetupData.pipeline.stage[2])
                await $('button[data-action="new-stage-create"]').click()
                await $('app-deal-stage-create').waitForDisplayed({ reverse: true })
                await $('a[data-action="pipeline-manager-new-stage"]').waitForClickable({ timeout: 3000 })
                await $('a[data-action="pipeline-manager-new-stage"]').click()
                await $('app-deal-stage-create').waitForDisplayed({ timeout: 3000 })
                await $('input[data-name="new-stage-title"]').setValue(globalSetupData.pipeline.stage[3])
                await $('button[data-action="new-stage-create"]').click()
                await $('app-deal-stage-create').waitForDisplayed({ reverse: true })
                await delay(3000)
                await goToPage('pipeline')
                await expect($(`div[data-name="pipeline-stage-${globalSetupData.pipeline.stage[0]}"]`)).toExist()
                await expect($(`div[data-name="pipeline-stage-${globalSetupData.pipeline.stage[1]}"]`)).toExist()
                await expect($(`div[data-name="pipeline-stage-${globalSetupData.pipeline.stage[2]}"]`)).toExist()
                await expect($(`div[data-name="pipeline-stage-${globalSetupData.pipeline.stage[3]}"]`)).toExist()
                await delay(5000)
            }
            // Create development deal
            await goToPage('pipeline')
            await $('div[data-name="pipeline-name-list"] span').click()
            await delay(1000)
            await $(`div[data-name="pipeline-title-${globalSetupData.pipeline.name}"]`).click()
            await delay(3000)
            const dealExist = await $('div=' + globalSetupData.pipeline.deal).isDisplayed()
            if(!dealExist) {
                await $('button[data-action="create-new-deal"]').waitForClickable({ timeout: 5000 })
                await $('button[data-action="create-new-deal"]').click()
                await $('app-deal-create').waitForDisplayed({ timeout: 2000 })
                await $('input[data-name="title"]').setValue(globalSetupData.pipeline.deal)
                const stageSelect = await browser.execute(() => { return document.querySelector('app-deal-create select'); });
                await $(stageSelect).click()
                const stageSelectOption = await browser.execute(() => { return document.querySelectorAll('app-deal-create select option')[0]; });
                await $(stageSelectOption).click()
                await delay(2000)
                await $('input[data-name="task-contact-to-assign"]').setValue('j')
                await $('div=' + globalSetupData.contact.name).waitForClickable({ timeout: 15000 })
                await $('div=' + globalSetupData.contact.name).click()
                await $('app-select-contact-list .mat-select-wrapper').click()
                await $('.mat-select-panel-wrap mat-option').click()
                await $('button[data-action="deal-create-confirm"]').click()
                await $('app-deal-create').waitForDisplayed({ reverse: true })
                await delay(3000)
                await expect($('div=' + globalSetupData.pipeline.deal)).toBeDisplayed()
            }
        })
    })
    describe('Automation', () => {
        it('Create Test automation && assign', async () => {
            await goToPage('automations')
            const testAutomationExist = await $('span=' + globalSetupData.automation.name).isDisplayed()
            if(!testAutomationExist) {
                await $('span[data-name="profile-tab-item-Automations Library"]').click()
                await delay(3000)
                const oneLibraryAutomationDownload = await $('app-automations-library table tbody tr:nth-last-of-type(2) i.i-download')
                await oneLibraryAutomationDownload.moveTo()
                await oneLibraryAutomationDownload.click()
                await delay(5000)
                await $('app-confirm').$('button=Download').click()
                await delay(5000)
                await $('span[data-name="profile-tab-item-My Automations List"]').click()
                const oneListAutomation = await $('app-automations-own table tbody tr:nth-last-of-type(2) i.i-edit')
                await oneListAutomation.moveTo()
                await oneListAutomation.click()
                await delay(5000)
                await $('app-autoflow').$('i.i-edit').click()
                await $('#automation-title').setValue(globalSetupData.automation.name)
                await $('app-autoflow').$('button=Save').click()
                await delay(3000)
                await goToPage('automations')
                await expect($('span=' + globalSetupData.automation.name)).toBeDisplayed()

                // Assign
                await $('span=' + globalSetupData.automation.name).click()
                await delay(5000)
                await $('button[data-action="automation-assign"]').click()
                await $('app-automation-assign').waitForDisplayed({ timeout: 2000 })
                await $('app-select-contact mat-form-field').click()
                await $('mat-option.contains-mat-select-search div.mat-typography input.mat-select-search-input').setValue('j')
                await $('div=' + globalSetupData.contact.name).waitForClickable({ timeout: 9000 })
                await $('div=' + globalSetupData.contact.name).click()
                await $('button[data-action="automation-assign-confirm"]').click()
                await delay(2000)
                const businessHourDialog = await $('app-confirm-business-hour').isDisplayed()
                if(businessHourDialog) {
                    await $('app-confirm-business-hour div.custom-checkbox label').click()
                    await $('app-confirm-business-hour').$('button=Ok').click()
                }
                await $('app-automation-assign').waitForDisplayed({ reverse: true })
                await delay(5000)
                await $('span[data-name="profile-tab-item-Assigned Contacts"]').click()
                await expect($('table tbody tr:first-of-type td.mat-column-contact_name span')).toHaveText(globalSetupData.contact.name)

                // Check
                await $('table tbody tr:first-of-type td.mat-column-contact_name span').click()
                await delay(5000)
                await $('span[data-name="deal-tab-item-Automations"]').click()
                await $('div.reload i.i-refresh').click()
                await delay(5000)
                await expect($('div=' + globalSetupData.automation.name)).toBeDisplayed()
                // 
                await $('div.contact-info-panel div.automation div.automation-action i.i-automation-cancel').scrollIntoView()
                await $('div.contact-info-panel div.automation div.automation-action i.i-automation-cancel').click()
                await $('button[data-action="confirm-downgrade"]').waitForClickable({ timeout: 2000 })
                await $('button[data-action="confirm-downgrade"]').click()
                await delay(3000)
            }
        })
    })
    describe('Community', () => {
        it('Create Test community', async () => {
            await goToPage('community')
            const testCommunityExist = await $('div=' + globalSetupData.community.name).isDisplayed()
            if(!testCommunityExist) {
                await $('button[data-action="create-new-community"]').waitForClickable({ timeout: 6000 })
                await $('button[data-action="create-new-community"]').click()
                await $('app-team-create').waitForDisplayed({ timeout: 3000 })
                await $('input[name="callSubject"]').setValue(globalSetupData.community.name)
                await $('button=Create community').click()
                await $('app-team-create').waitForDisplayed({ reverse: true })
                await delay(2000)
                const teamSetting = await $('app-team-setting').isDisplayed()
                if(teamSetting) await $('button[data-action="community-setting-save"]').click()
                await $('app-team-setting').waitForDisplayed({ reverse: true })
                await delay(2000)
                const inviteTeam = await $('app-invite-team').isDisplayed()
                if(inviteTeam) await $('button=Cancel').click()
                await $('app-invite-team').waitForDisplayed({ reverse: true })
                await delay(2000)
                await expect($('div=' + globalSetupData.community.name)).toBeDisplayed()
            } 
        })
    })
    describe('Lead Form', () => {
        it('Create Lead Capture Form', async () => {
            await goToSubmenu('leadCaptureForm')
            const leadExist = await $('span=' + globalSetupData.leadCapture.name).isDisplayed()
            if(!leadExist) {
                await $('button[data-action="create-lead-capture-form"]').click()
                await $('app-lead-capture-form-add').waitForDisplayed({ timeout: 2000 })
                await $('input[name="field_name"]').setValue(globalSetupData.leadCapture.name)
                await $('button[data-action="lead-capture-new-form-add"]').click()
                await $('app-lead-capture-form-add').waitForDisplayed({ reverse: true })
                await delay(3000)
                await expect($('span=' + globalSetupData.leadCapture.name)).toBeDisplayed()
            }
        })
    })
    describe('Material', () => {
        it('Make Material for Automation', async () => {
            await goToPage('materials')
            await delay(2000)
            await $('div[data-name="material-view-mode-list"]').click()
            await delay(2000)
            const materialExist = await $('app-materials-main table tbody tr:last-of-type td.mat-column-name div.material-main-info div.thumbnail').isExisting()
            const isFolder = materialExist && await $('app-materials-main table tbody tr:last-of-type td.mat-column-name div.material-main-info div.folder-thumb').isExisting()
            if(!materialExist && !isFolder) {
                await $('button[data-action="material-record-video"]').scrollIntoView()
                await $('div[data-name="new-material-btn"]').waitForClickable({ timeout: 5000 })
                await $('div[data-name="new-material-btn"]').click()
                await $('div[data-name="create-material-video"]').click()
                await $('span[data-name="profile-tab-item-Video"]').click()
                const fileUpload = await $('input[data-name="video-upload-input"]')
                const filePath = path.join(__dirname, '../../../assets/video/video1.mp4')
                await fileUpload.addValue(filePath)
                await delay(9000)
                await $('input[name="video_title"]').setValue(globalSetupData.material.name)
                await delay(2000)
                await $('button[data-action="video-upload-next-btn"]').click()
                await delay(15000)
                await expect($('span=' + globalSetupData.material.name)).toBeDisplayed()
            }
        })
    })
    describe('Template', () => {
        it('Create demo template', async () => {
            await goToPage('templates')
            const demoTemplateExist = await $('span=' + globalSetupData.template.name).isDisplayed()
            if(!demoTemplateExist) {
                await $('app-templates').$('span=New Template').click()
                await delay(3000)
                await $('input[name="title"]').setValue(globalSetupData.template.name)
                await delay(2000)
                await $('app-template form div.form-group:nth-of-type(2) input[type="text"]').setValue('template subject')
                await delay(2000)
                if(!isVortex) {
                    await browser.execute((text) => {
                        document.querySelector('quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
                    }, '<div>Email Template</div>') 
                } else {
                    await browser.execute((text) => {
                        document.querySelector('quill-editor[data-name="deal-action-description"] .ql-editor > div').innerHTML = text;
                    }, 'Email Template') 
                }
                await $('button[data-action="bulk-email-save-btn"]').click()
                await delay(5000)
            }
            await expect($('span=' + globalSetupData.template.name)).toBeDisplayed()
        })
    })
})