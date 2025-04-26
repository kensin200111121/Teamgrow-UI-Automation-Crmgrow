
const { expect, browser } = require('@wdio/globals');

const memberEmail = "brightdawn019@gmail.com"
const { goToPage, goToSubmenu } = require('./sidebar');
const isVortex = require('../test-data/testdata').isVortex

const delay = (ms) => {
    return new Promise(res => {
       setTimeout(() => {
        res()
       }, ms) 
    })
}

const mainLink = require('../test-data/testLink').Link.COMMUNITY_LINK;
const testContactName = require('../test-data/testdata').testPrepare.contact.name;
const testCommunityName = 'test community';

const removeCommunity = async (communityName) => {
    await goToPage('community')
    const communityExist = await $(`div=${communityName}`).isDisplayed() 
    if(communityExist) {
        const community = await $(`div=${communityName}`)
        const communityTr = await browser.custom$('closest', community)
        await communityTr.$('td.team-actions').moveTo()
        await communityTr.$('td.team-actions i.i-trash').click()
        await $('app-team-delete').waitForDisplayed({ timeout: 2000 })
        await $('button=Delete').click()
        await $('app-team-delete').waitForDisplayed({ reverse: true })
        await delay(3000)
        await expect(community).not.toExist()
    }
}

describe('Test Data Setup', () => {
    describe('Preparation', async () => {
        it('delete', async () => {
            await removeCommunity('test community')
            await removeCommunity('edited community')
        })
    })
})
describe('Create Community', () => {
    it('Create new community', async () => {
        await goToPage('community')
        await $('button[data-action="create-new-community"]').click()
        await $('app-team-create').waitForDisplayed({ timeout: 3000 })
        await $('input[name="callSubject"]').setValue(testCommunityName)
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
        await expect($(`div=${testCommunityName}`)).toBeDisplayed()
    })
})
describe('Team Settings', () => {
    const teamSetting = ['View Member List', 'Send Team Invites', 'Reshare Content', 'Download Material']
    teamSetting.forEach((testItem, index) => {
        describe(`${testItem}`, () => {
            const setting = ['Enable', 'Disable']
            for (let item of setting) {
                it(`${item}`, async () => {
                    await goToPage('community')
                    const testCommunity = await $(`div=${testCommunityName}`)
                    const testCommunityTr = await browser.custom$('closest', testCommunity)
                    await testCommunityTr.$('td:last-of-type').moveTo()
                    await testCommunityTr.$('td:last-of-type i.i-setting').click()
                    await $('app-team-setting').waitForDisplayed({ timeout: 3000 })
                    await $(`app-team-setting div.setting-panel > div:nth-of-type(${(index+1).toString()}) label.custom-toggle span`).click()
                    if( index === 0 ) {
                        if(item == 'Enable') await expect($(`app-team-setting div.setting-panel > div:nth-of-type(${(index+1).toString()}) label.custom-toggle input[type="checkbox"]`)).not.toBeChecked()
                        else await expect($(`app-team-setting div.setting-panel > div:nth-of-type(${(index+1).toString()}) label.custom-toggle input[type="checkbox"]`)).toBeChecked()
                    } else {
                        if(item == 'Enable') await expect($(`app-team-setting div.setting-panel > div:nth-of-type(${(index+1).toString()}) label.custom-toggle input[type="checkbox"]`)).toBeChecked()
                        else await expect($(`app-team-setting div.setting-panel > div:nth-of-type(${(index+1).toString()}) label.custom-toggle input[type="checkbox"]`)).not.toBeChecked()
                    }
                    await $('button[data-action="community-setting-save"]').click()
                    await $('app-team-setting').waitForDisplayed({ reverse: true })
                })
            }
        })
    })
})
if(!isVortex) describe('Join Community', () => {
    it('Join Request', async () => {
        await goToPage('community')
        await $('button[data-action="join-community"]').click()
        await $('app-join-team').waitForDisplayed({ timeout: 3000 })
        const requestAlreadyExist = await $('button=Cancel Request').isDisplayed()
        if(requestAlreadyExist) {
            await $('button=Cancel Request').click()
            await $('button[data-action="confirm-downgrade"]').waitForClickable({ timeout: 2000 })
            await $('button[data-action="confirm-downgrade"]').click()
        }
        await delay(3000)
        await $('app-join-team input[id="search-to-join"]').setValue('Ben')
        await delay(5000)
        await $('div.cdk-overlay-container > div:last-of-type > div > div > mat-option:first-of-type').$('div=Ben Dev Site').waitForClickable({ timeout: 7000 })
        await $('div.cdk-overlay-container > div:last-of-type > div > div > mat-option:first-of-type').$('div=Ben Dev Site').click()
        await expect($('button=Request')).toBeClickable()
        await $('button=Request').click()
        await $('app-join-team').waitForDisplayed({ reverse: true })
    })
})
describe('Invitation Reminder', () => {
    it('Invite', async () => {
        await goToPage('community')
        await $('div=test community').click()
        await $('span[data-name="deal-tab-item-Members"]').waitForClickable({ timeout: 5000 })
        await $('span[data-name="deal-tab-item-Members"]').click()
        await $('button[data-action="community-invite-member"]').waitForClickable({ timeout: 3000 })
        await $('button[data-action="community-invite-member"]').click()
        await $('app-invite-team').waitForDisplayed({ timeout: 2000 })
        const memberAlreadyExist = await $('button=Cancel Invitation').isDisplayed()
        if(memberAlreadyExist) {
            await $('button=Cancel Invitation').click()
            await $('button[data-action="confirm-downgrade"]').waitForClickable({ timeout: 2000 })
            await $('button[data-action="confirm-downgrade"]').click()
        }
        await delay(3000)
        await $('app-invite-team input').setValue(memberEmail)
        await $('button=Send').click()
        await $('app-invite-team').waitForDisplayed({ reverse: true })
        await delay(2000)
        await expect($('div=Invite sent')).toBeDisplayed()
        await expect($('button=Remind')).toBeDisplayed()
        await $('button=Remind').click()
        await delay(3000)
    })
})
describe('Share', () => {
    const action = ['Share']
    describe.skip('Contacts', () => {
        action.forEach((item, index) => {
            it(`${item}`, async () => {
                await goToPage('community')
                const testContact = await $(`span=${testContactName}`)
                const testContactExist = await testContact.isExisting()
                if(testContactExist) {
                    const Tr = await browser.custom$('closest', testContact)
                    await Tr.scrollIntoView()
                    await browser.execute(ele => {
                        ele.querySelector('input[type="checkbox"]').click();
                    }, Tr)
                    await delay(2000)
                    await $('div[data-name="material-action-item-More"]').scrollIntoView()
                    await $('div[data-name="material-action-item-More"]').click()
                    await $(`div[data-name="material-action-item-More-${item}"]`).click()
                    await $('app-contact-share').waitForDisplayed({ timeout: 3000 })
                    await $('app-select-team mat-form-field').click()
                    await $('div=test community').click()
                    await $('app-select-member mat-form-field').click()
                    await $('div=All Members').click()
                    await $('button[data-action="contact-share-btn"]').click()
                    await $('app-contact-share').waitForDisplayed({ reverse: true })
                    await goToPage('contacts')
                    await $('span[data-name="contact-list-filter"]').click()
                    await $('div[data-name="contact-filter-item-Community"]').click()
                    await $('app-advanced-filter-team div.team-select div.custom-checkbox label').click()
                    await $('button[data-action="advanced-filter-team-apply"]').click()
                    await $('app-advanced-filter-team').waitForDisplayed({ reverse: true })
                    await $(`span=${testContactName}`).toBeDisplayed()
                    await $('span[data-name="contact-filter-clear"]').click()
                    await delay(3000)
                }
            })
        })
    })
    describe('Materials', () => {
        it('Share', async () => {
            await goToPage('materials')
            await $('div[data-name="material-view-mode-list"]').click()
            await delay(3000)
            const shareTr = await $('app-materials-main table tbody tr:first-of-type')
            await browser.execute(ele => {
                ele.querySelector('input[type="checkbox"]').click();
            }, shareTr)
            await $('div[data-name="material-action-item-Share"]').click()
            await delay(3000)
            await $('app-team-material-share mat-select').click()
            await $('div.cdk-overlay-container').$(`div=${testCommunityName}`).click()
            await delay(2000)
            await $('button[data-action="pipeline-share-unshare"]').click()
            await $('app-team-material-share').waitForDisplayed({ reverse: true })
            await goToPage('community')
            await delay(5000)
            await $(`div=${testCommunityName}`).click()
            await $('span[data-name="deal-tab-item-Materials"]').waitForClickable({ timeout: 3000 })
            await $('span[data-name="deal-tab-item-Materials"]').click()
            await delay(6000)
            await $('app-materials-team div.dropdown-toggle').click()
            await $('app-materials-team div.dropdown-item:first-of-type').click()
            await expect($('table tbody tr:first-of-type td.mat-column-name div.thumbnail img.thumbnail')).toExist()
        })
        it('Unshare', async () => {
            await goToPage('community')
            await $(`div=${testCommunityName}`).click()
            await $('span[data-name="deal-tab-item-Materials"]').waitForClickable({ timeout: 5000 })
            await $('span[data-name="deal-tab-item-Materials"]').click()
            await delay(5000)
            await $('table tbody tr:first-of-type td.mat-column-name div.thumbnail img.thumbnail').moveTo()
            await $('table tbody tr:first-of-type td.mat-column-action i.i-share-off').click()
            await delay(7000)
            await expect($('table tbody tr:first-of-type td.mat-column-name div.thumbnail img.thumbnail')).not.toExist()
            await delay(3000)
        })
    })
    describe('Automations', () => {
        it('Share', async () => {
            await goToPage('automations')
            await $('table tbody tr:first-of-type td.mat-column-actions').moveTo()
            await $('table tbody tr:first-of-type td.mat-column-actions i.i-menu-more').click()
            await $('table tbody tr:first-of-type td.mat-column-actions button[data-action="automation-drop-share"]').waitForClickable({ timeout: 3000 })
            await $('table tbody tr:first-of-type td.mat-column-actions button[data-action="automation-drop-share"]').click()
            await $('app-team-material-share').waitForDisplayed({ timeout: 3000 })
            await $('app-team-material-share mat-select').click()
            await delay(3000)
            await $('div.cdk-overlay-container').$('div=test community').click()
            await delay(3000)
            await $('button[data-action="pipeline-share-unshare"]').click()
            await delay(2000)
            const confirmDialog = await $('app-confirm').isDisplayed()
            if(confirmDialog) await $('button[data-action="confirm-downgrade"]').click()
            await $('app-team-material-share').waitForDisplayed({ reverse: true })
            await goToPage('community')
            await $('div=test community').waitForClickable({ timeout: 3000 })
            await $('div=test community').click()
            await $('span[data-name="deal-tab-item-Automations"]').waitForClickable({ timeout: 4000 })
            await $('span[data-name="deal-tab-item-Automations"]').click()
            await delay(5000)
            await expect($('table tbody tr:first-of-type td.mat-column-title span')).toBeDisplayed()
            await delay(2000)
        })
        it('Unshare', async () => {
            await goToPage('community')
            await $('div=test community').click()
            await $('span[data-name="deal-tab-item-Automations"]').waitForClickable({ timeout: 5000 })
            await $('span[data-name="deal-tab-item-Automations"]').click()
            await delay(5000)
            await $('table tbody tr:first-of-type td.mat-column-title span').moveTo()
            await $('table tbody tr:first-of-type td.mat-column-actions i.i-share-off').click()
            await delay(3000)
            const confirm = await $('app-confirm').isDisplayed()
            if(confirm) {
                await $('app-confirm').$('button=Yes').click()
                await delay(3000)
            }
            await expect($('table tbody tr:first-of-type td.mat-column-title span')).not.toExist()
        })
    })
    describe('Templates', () => {
        it('Share', async () => {
            await goToPage('templates')
            await $('table tbody tr:first-of-type td.mat-column-actions i.i-menu-more').click()
            await $('body > div.dropdown > div.dropdown-menu > button:first-of-type').click()
            await $('app-team-material-share').waitForDisplayed({ timeout: 3000 })
            await $('app-team-material-share mat-select').click()
            await delay(3000)
            await $('div.cdk-overlay-container').$('div=test community').click()
            await delay(3000)
            await $('button[data-action="pipeline-share-unshare"]').click()
            await $('app-team-material-share').waitForDisplayed({ reverse: true })
            await goToPage('community')
            await $('div=test community').waitForClickable({ timeout: 3000 })
            await $('div=test community').click()
            await $('span[data-name="deal-tab-item-Templates"]').waitForClickable({ timeout: 5000 })
            await $('span[data-name="deal-tab-item-Templates"]').click()
            await delay(5000)
            await expect($('table tbody tr:first-of-type td.mat-column-content h5')).toBeDisplayed()
            await delay(2000)
        })
        it('Unshare', async () => {
            await goToPage('community')
            await $('div=test community').click()
            await $('span[data-name="deal-tab-item-Templates"]').waitForClickable({ timeout: 4000 })
            await $('span[data-name="deal-tab-item-Templates"]').click()
            await delay(5000)
            await $('table tbody tr:first-of-type td.mat-column-content h5').moveTo()
            await $('table tbody tr:first-of-type td.mat-column-actions i.i-share-off').click()
            await delay(6000)
            await expect($('table tbody tr:first-of-type td.mat-column-content h5')).not.toExist()
        })
    })
})
describe('Change Team Name', () => {
    it('Change', async () => {
        await goToPage('community')
        const testCommunity = await $(`div=${testCommunityName}`)
        const testCommunityTr = await browser.custom$('closest', testCommunity)
        await testCommunityTr.$('td:last-of-type').moveTo()
        await testCommunityTr.$('td:last-of-type i.i-edit').click()
        await $('app-team-edit').waitForDisplayed({ timeout: 3000 })
        await $('app-team-edit input[name="teamName"]').setValue('edited community')
        await $('button[data-action="team-edit-save"]').click()
        await $('app-team-edit').waitForDisplayed({ reverse: true })
        await expect($('div=edited community')).toExist()
    })
})
describe('Delete Community', () => {
    it('delete', async () => {
        await removeCommunity('edited community')
    })
})
