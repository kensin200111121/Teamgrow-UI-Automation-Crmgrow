
const { expect, browser } = require('@wdio/globals');
const path = require('path')

const { goToPage, goToSubmenu } = require('./sidebar');
const testContactName = require('../test-data/testdata').testPrepare.contact.name;
const testCommunityName = require('../test-data/testdata').testPrepare.community.name;

const isVortex = require('../test-data/testdata').isVortex
const delay = (ms) => {
    return new Promise(res => {
       setTimeout(() => {
        res()
       }, ms) 
    })
}
let titleVideo, titlePdf, titleImage, titleFolder;

const clearMaterialFilter = async () => {
    await $('span=Filter').click()
    await delay(1000)
    await $('mat-drawer').$('div=Clear All Filters').click()
    await delay(3000)
    await $('mat-drawer i.i-close').click()
    await delay(1000)
}

describe('Test Data Setup', () => {
    describe('Preparation', async () => {
        it('Material', async () => {
            await goToPage('materials')
            await $('div[data-name="material-view-mode-tile"]').click()
        })
        it('Delete Test Folder', async () => {
            await delay(3000)
            const testingFolderExist = await $('span*=Testing Folder').isExisting()
            if(testingFolderExist) {
                const testingFolder = await $('span*=Testing Folder')
                await testingFolder.scrollIntoView()
                const testingFolderSelect = await browser.custom$('closest_checkbox', testingFolder)
                await browser.execute(ele => {
                    ele.querySelector('input[type="checkbox"]').click();
                }, testingFolderSelect)
                await $('div[data-name="material-action-item-Delete"]').scrollIntoView()
                await $('div[data-name="material-action-item-Delete"]').click()
                await delay(6000)
                await $('app-delete-folder').waitForDisplayed({ timeout: 3000 })
                await $('app-delete-folder div[data-name="folder-delete-all-select"]').click()
                await $('app-delete-folder button[data-action="automations-folder-delete-all"]').click()
                await delay(5000)
                const confirmBulkMaterials = await $('app-confirm-bulk-materials').isDisplayed()
                if(confirmBulkMaterials) {
                    await $('app-confirm-bulk-materials i.i-close').click()
                    await $('app-delete-folder').$('button=Cancel').click()
                }
                await $('app-delete-folder').waitForDisplayed({ reverse: true })
                await delay(3000)
            }
        })
        it('Delete Test Video', async () => {
            await goToPage('materials')
            const testingVideoExist = await $('span*=Testing Video').isExisting()
            if(testingVideoExist) {
                const testingVideo = await $('span*=Testing Video')
                await testingVideo.scrollIntoView()
                const testingVideoSelect = await browser.custom$('closest_checkbox', testingVideo)
                await browser.execute(ele => {
                    ele.querySelector('input[type="checkbox"]').click();
                }, testingVideoSelect)
                await $('div[data-name="material-action-item-Delete"]').scrollIntoView()
                await $('div[data-name="material-action-item-Delete"]').click()
                await delay(3000)
                const confirmDialog = await $('app-confirm').isDisplayed()
                if(confirmDialog) {                    
                    await $('app-confirm button[data-action="confirm-downgrade"]').click()
                    await $('app-confirm').waitForDisplayed({ reverse: true })
                }
                await delay(3000)
            }
        })
        it('Delete Test Pdf', async () => {
            await goToPage('materials')
            const testingPdfExist = await $('span*=Testing Pdf').isExisting()
            if(testingPdfExist) {
                const testingPdf = await $('span*=Testing Pdf')
                await testingPdf.scrollIntoView()
                const testingPdfSelect = await browser.custom$('closest_checkbox', testingPdf)
                await browser.execute(ele => {
                    ele.querySelector('input[type="checkbox"]').click();
                }, testingPdfSelect)
                await $('div[data-name="material-action-item-Delete"]').scrollIntoView()
                await $('div[data-name="material-action-item-Delete"]').click()
                await delay(3000)
                const confirmDialog = await $('app-confirm').isDisplayed()
                if(confirmDialog) {                    
                    await $('app-confirm button[data-action="confirm-downgrade"]').click()
                    await $('app-confirm').waitForDisplayed({ reverse: true })
                }
                await delay(3000)
            }
        })
        it('Delete Test Image', async () => {
            await goToPage('materials')
            const testingImageExist = await $('span*=Testing Image').isExisting()
            if(testingImageExist) {
                const testingImage = await $('span*=Testing Image')
                await testingImage.scrollIntoView()
                const testingImageSelect = await browser.custom$('closest_checkbox', testingImage)
                await browser.execute(ele => {
                    ele.querySelector('input[type="checkbox"]').click();
                }, testingImageSelect)
                await $('div[data-name="material-action-item-Delete"]').scrollIntoView()
                await $('div[data-name="material-action-item-Delete"]').click()
                await delay(3000)
                const confirmDialog = await $('app-confirm').isDisplayed()
                if(confirmDialog) {                    
                    await $('app-confirm button[data-action="confirm-downgrade"]').click()
                    await $('app-confirm').waitForDisplayed({ reverse: true })
                }
                await delay(3000)
            }
        })
        it('Delete Test Duplicate', async () => {
            await goToPage('materials')
            const testingDuplicateExist = await $('span=V2_duplicate').isExisting()
            if(testingDuplicateExist) {
                const testingDuplicate = await $('span=V2_duplicate')
                await testingDuplicate.scrollIntoView()
                const testingDuplicateSelect = await browser.custom$('closest_checkbox', testingDuplicate)
                await browser.execute(ele => {
                    ele.querySelector('input[type="checkbox"]').click();
                }, testingDuplicateSelect)
                await $('div[data-name="material-action-item-Delete"]').scrollIntoView()
                await $('div[data-name="material-action-item-Delete"]').click()
                await delay(3000)
                const confirmDialog = await $('app-confirm').isDisplayed()
                if(confirmDialog) {                    
                    await $('app-confirm button[data-action="confirm-downgrade"]').click()
                    await $('app-confirm').waitForDisplayed({ reverse: true })
                }
                await delay(3000)
            }
        })
    })
})
describe('Create a folder', () => {
    it('Create', async () => {
        await goToPage('materials')
        await $('div[data-name="new-material-btn"]').click()
        await $('div[data-name="create-material-folder"]').click()
        await $('app-folder').waitForDisplayed({ timeout: 3000 })
        titleFolder = 'Testing Folder ' + Date.now().toString()
        await delay(3000)
        await $('#folder_name').setValue(titleFolder)
        await delay(3000)
        await $('app-folder').$('button=Submit').click()
        await $('app-folder').waitForDisplayed({ reverse: true })
        await delay(5000)
        // await expect($('span=' + titleFolder)).toBeDisplayed()
        await expect($('span*=Testing Folder')).toBeDisplayed()
    })
})
describe('Material Upload', () => {
    it('Video', async () => {
        await $('button[data-action="material-record-video"]').scrollIntoView()
        await $('div[data-name="new-material-btn"]').waitForClickable({ timeout: 5000 })
        await $('div[data-name="new-material-btn"]').click()
        await $('div[data-name="create-material-video"]').click()
        await $('span[data-name="profile-tab-item-Video"]').click()
        const fileUpload = await $('input[data-name="video-upload-input"]')
        const filePath = path.join(__dirname, '../../assets/video/video1.mp4')
        await fileUpload.addValue(filePath)
        await delay(9000)
        titleVideo = 'Testing Video ' + Date.now().toString()
        await $('input[name="video_title"]').setValue(titleVideo)
        await delay(2000)
        await $('button[data-action="video-upload-next-btn"]').click()
        await delay(15000)
        await expect($('span=' + titleVideo)).toBeDisplayed()
    })
    it('Pdf', async () => {
        await $('button[data-action="material-record-video"]').scrollIntoView()
        await $('div[data-name="new-material-btn"]').waitForClickable({ timeout: 5000 })
        await $('div[data-name="new-material-btn"]').click()
        await $('div[data-name="create-material-pdf"]').click()
        await $('span[data-name="profile-tab-item-Pdf"]').click()
        const fileUpload = await $('input[data-name="pdf-upload-input"]')
        const filePath = path.join(__dirname, '../../assets/pdf/doc1.pdf')
        await fileUpload.addValue(filePath)
        await delay(9000)
        titlePdf = 'Testing Pdf ' + Date.now().toString()
        await $('input[name="pdf_title"]').setValue(titlePdf)
        await delay(2000)
        await $('button[data-action="pdf-upload-next-btn"]').click()
        await delay(15000)
        await expect($('span=' + titlePdf)).toBeDisplayed()
    })
    it('Image', async () => {
        await $('button[data-action="material-record-video"]').scrollIntoView()
        await $('div[data-name="new-material-btn"]').waitForClickable({ timeout: 5000 })
        await $('div[data-name="new-material-btn"]').click()
        await $('div[data-name="create-material-image"]').click()
        await $('span[data-name="profile-tab-item-Image"]').click()
        const fileUpload = await $('input[data-name="image-upload-input"]')
        const filePath = path.join(__dirname, '../../assets/image/img1.png')
        await fileUpload.addValue(filePath)
        await delay(9000)
        titleImage = 'Testing Image ' + Date.now().toString()
        await $('input[name="image_title"]').setValue(titleImage)
        await delay(2000)
        await $('button[data-action="image-upload-next-btn"]').click()
        await delay(15000)
        await expect($('span=' + titleImage)).toBeDisplayed()
    })
})
describe('Move Materials to a folder', () => {
    it('Move', async () => {
        await goToPage('materials')
        const testingImage = await $('span=' + titleImage)
        if(testingImage) {
            await testingImage.scrollIntoView()
            const testingImageSelect = await browser.custom$('closest_checkbox', testingImage)
            await browser.execute(ele => {
                ele.querySelector('input[type="checkbox"]').click();
            }, testingImageSelect)
        }
        await delay(2000)
        await $('div[data-name="material-action-item-Move To"]').scrollIntoView()
        await $('div[data-name="material-action-item-Move To"]').click()
        await $('app-move-folder').waitForDisplayed({ timeout: 5000 })
        await delay(3000)
        await $('app-move-folder').$('span*=Testing Folder').click()
        await delay(3000)
        await $('app-move-folder').$('button=Move').waitForClickable({ timeout: 5000 })
        await $('app-move-folder').$('button=Move').click()
        await delay(5000)
        await $('div*=Testing Folder').scrollIntoView()
        await $('div*=Testing Folder').click()
        await delay(5000)
        await expect($('span=' + titleImage)).toBeDisplayed()
    })
})
describe.skip('Change Landing page theme', () => {
    it('Change', async () => {
        await goToPage('materials')
        const firstMaterialSelect = await $('div[data-name="material-files"] div.title-list > div:first-of-type')
        await browser.execute(ele => {
            ele.querySelector('input[type="checkbox"]').click();
        }, firstMaterialSelect)
        await delay(2000)
        await $('div[data-name="material-action-item-Edit Landing page"]').click()
        await $('app-material-edit-template').waitForDisplayed({ timeout: 3000 })
        await $('app-material-edit-template div.themes div.theme:first-of-type div.theme-name').click()
        await delay(5000)
        await expect($('app-material-edit-template div.themes div.theme:first-of-type')).toHaveElementClass('selected')
        await $('button[data-action="material-change-landing-save"]').click()
        await $('app-material-edit-template').waitForDisplayed({ reverse: true })
        // Deselect
        await browser.execute(ele => {
            ele.querySelector('input[type="checkbox"]').click();
        }, firstMaterialSelect)
    })
})
describe('Send Materials', () => {
    it('Via Email', async () => {
        await goToPage('materials')
        await $('span=Filter').click()
        await $('app-resource-filters').$('label[for="ft-video"]').$('div=Video').click()
        await delay(2000)
        await $('mat-drawer i.i-close').click()
        const firstMaterialSelect = await $('div[data-name="material-files"] div.title-list > div:first-of-type')
        await browser.execute(ele => {
            ele.querySelector('input[type="checkbox"]').click()
        }, firstMaterialSelect)
        await delay(2000)
        await $('div[data-name="material-action-item-Send"]').click()
        await $('app-material-send').waitForDisplayed({ timeout: 3000 })
        await delay(2000)
        await $('app-material-send div.send-via-email').click()
        await $('input[data-name="task-contact-to-assign"]').setValue('j')
        await $('div.cdk-overlay-container').$('div=' + testContactName).waitForDisplayed({ timeout: 5000 })
        await $('div.cdk-overlay-container').$('div=' + testContactName).click()
        await $('input[name="mailSubject"]').setValue('material mail')
        await browser.execute((text) => {
            document.querySelector('quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
        }, '<div>Welcome</div>');
        await $('app-material-send').$('button=Send').click()
        await $('app-material-send').waitForDisplayed({ reverse: true })
        await goToPage('contacts')
        await $('span=' + testContactName).click()
        await delay(10000)
        await $('span[data-name="deal-tab-item-Emails"]').click()
        await delay(5000)
        await expect($('app-contact-action-list app-contact-activity-super-item:first-of-type app-contact-email-action-item div.emails-detail > div.subject')).toHaveText('material mail')
    })
    it.skip('Via Text', async () => {
        await goToPage('materials')
        await $('table tr:last-of-type td.checkbox-col div.custom-checkbox').waitForClickable({ timeout: 3000 })
        await $('table tr:last-of-type td.checkbox-col div.custom-checkbox').click({ button: 0, x: -10, y: 0 })
        await $('div[data-name="material-action-item-Send via Text"]').click()
        await $('app-material-send').waitForDisplayed({ timeout: 3000 })
        await $('app-select-contact > div').click()
        await $('div.mat-select-search-inner input.mat-select-search-input').setValue('j')
        await $('mat-option:first-of-type').waitForDisplayed({ timeout: 5000 })
        await $('mat-option:nth-of-type(2) div.info').click()
        await $('textarea[name="content"]').setValue('material text')
        await $('button[data-action="material-via-send-email"]').click()
        await $('app-material-send').waitForDisplayed({ timeout: 5000, reverse: true })
        await goToPage('contacts')
        await $('span=' + testContactName).click()
        await $('span[data-name="deal-tab-item-Texts"]').click()
        await expect($('div.history-detail:first-of-type div.op-75')).toHaveText('to ' + testContactName)
    })
})
describe('Pagination', () => {
    describe('View Mode Change', () => {
        it('List View Mode', async () => {
            await goToPage('materials')
            await $('div[data-name="material-view-mode-list"]').click()
            await clearMaterialFilter()
        })
    })
    describe('List', () => {
        before(async () => {
            await $('div=My Materials List').click()
            await delay(3000)
        })
        const rowCases = [ 8, 50 ];
        for (let rowCase of rowCases) {
            it(`${rowCase} Rows Test`, async () => {
                const paginationExist = await $('span[data-name="material-list-pagination-rows"]').isDisplayed()
                if(paginationExist) {
                    await $('span[data-name="material-list-pagination-rows"]').click()
                    await $(`div[data-name="material-list-pagination-rows-${rowCase}"]`).click()                    
                    await expect($('span[data-name="material-list-pagination-rows"]')).toHaveText(`Show ${rowCase} rows per page`)
                }
            })
        }
    })
    describe('Library', () => {
        before(async () => {
            await $('div=Library').click()
            await delay(3000)
        })
        const rowCases = [ 8, 50 ];
        for (let rowCase of rowCases) {
            it(`${rowCase} Rows Test`, async () => {
                const paginationExist = await $('span[data-name="material-list-pagination-rows"]').isDisplayed()
                if(paginationExist) {
                    await $('span[data-name="material-list-pagination-rows"]').click()
                    await $(`div[data-name="material-list-pagination-rows-${rowCase}"]`).click()                    
                    await expect($('span[data-name="material-list-pagination-rows"]')).toHaveText(`Show ${rowCase} rows per page`)
                }
            })
        }
    })
})
describe('Sort By', () => {
    describe('List', () => {
        it('Materials List', async () => {
            await goToPage('materials')
            await $('div=My Materials List').click()
            await delay(3000)
        })
        const sortbyCases = ["Folder", "Video", "Pdf", "Image"]
        for (let sortbyCase of sortbyCases) {
            it(`${sortbyCase}`, async () => {
                await $('span=Filter').click()
                await delay(1000)
                await $('mat-drawer app-resource-filters > div:first-of-type').$(`div=${sortbyCase}`).click()
                await delay(2000)
                await $('mat-drawer i.i-close').click()
                await delay(2000)
                const materialExist = await $('app-materials-main table tbody tr:last-of-type td.name-col').isExisting()
                if(materialExist) {
                    await delay(3000)
                    if(sortbyCase != "Folder") {
                        if(sortbyCase == "Pdf") await expect($('app-materials-main table tbody tr:last-of-type td.type-col span')).toHaveText(sortbyCase.toUpperCase())
                        else await expect($('app-materials-main table tbody tr:last-of-type td.type-col span')).toHaveText(sortbyCase)
                    }
                    else await expect($('app-materials-main table tbody tr:last-of-type td.name-col div.folder-thumb')).toExist()
                }
                await clearMaterialFilter()
            })
        }
    })
    describe('Library', () => {
        it('Materials List', async () => {
            await goToPage('materials')
            await $('div=Library').click()
            await delay(3000)
        })
        const sortbyCases = ["Folder", "Video", "Pdf", "Image"]
        for (let sortbyCase of sortbyCases) {
            it(`${sortbyCase}`, async () => {
                await $('span=Filter').click()
                await delay(1000)
                await $('app-resource-filters > div:first-of-type').$(`div=${sortbyCase}`).click()
                await delay(2000)
                await $('mat-drawer i.i-close').click()
                await delay(2000)
                const materialExist = await $('app-materials-main table tbody tr:last-of-type td.name-col').isExisting()
                if(materialExist) {
                    await delay(3000)
                    if(sortbyCase != "Folder") {
                        if(sortbyCase == "Pdf") await expect($('app-materials-main table tbody tr:last-of-type td.type-col span')).toHaveText(sortbyCase.toUpperCase())
                        else await expect($('app-materials-main table tbody tr:last-of-type td.type-col span')).toHaveText(sortbyCase)
                    }
                    else await expect($('app-materials-main table tbody tr:last-of-type td.name-col div.folder-thumb')).toExist()
                }
                await clearMaterialFilter()
            })
        }
    })
})
describe('Embedded Code', () => {
    it('Get', async () => {
        await goToPage('materials')
        await $('span=Filter').click()
        await delay(1000)
        await $('app-resource-filters').$('label[for="ft-video"]').$('div=Video').click()
        await delay(2000)
        await $('mat-drawer i.i-close').click()
        await delay(2000)
        await $('app-materials-new table tbody tr:last-of-type td.item-action i.i-menu-more').click()
        await delay(2000)
        await $('app-materials-new table tr:last-of-type td.item-action div.dropdown > div.dropdown-menu').$('span=Get Embed Code').scrollIntoView()
        await $('app-materials-new table tr:last-of-type td.item-action div.dropdown > div.dropdown-menu').$('span=Get Embed Code').click()
        await $('app-create-embeded-material').waitForDisplayed({ timeout: 5000 })
        await $('app-create-embeded-material ul li:first-of-type a.copy-icon').click()
        await $('app-custom-toast').waitForDisplayed({ timeout: 5000 })
        await expect($('app-custom-toast div.toast-message')).toHaveText('Copied the embed html(iframe) code')
        await $('app-create-embeded-material').$('button=Close').click()
        await $('app-create-embeded-material').waitForDisplayed({ reverse: true })
        await clearMaterialFilter()
    })
})
describe('Material Analytics', () => {
    it('Analytics', async () => {
        await goToPage('materials')
        await $('span=Filter').click()
        await delay(2000)
        await $('app-resource-filters').$('label[for="ft-video"]').$('div=Video').click()
        await delay(2000)
        await $('mat-drawer i.i-close').click()
        await delay(2000)
        await $('app-materials-main table tbody tr:last-of-type i.i-material-eye').click()
        await delay(5000)
        await expect($('app-material-preview-v2')).toBeDisplayed()
        await clearMaterialFilter()
        await $('app-material-preview-v2 button.close-btn').click()
    })
})
describe('Share with team', () => {
    it('Share', async () => {
        await goToPage('materials')
        await $('span=Filter').click()
        await delay(2000)
        await $('app-resource-filters').$('label[for="ft-video"]').$('div=Video').click()
        await delay(2000)
        await $('mat-drawer i.i-close').click()
        await delay(2000)
        await $('div[data-name="material-view-mode-list"]').click()
        const shareTr = await $('app-materials-main table tbody tr:last-of-type')
        await browser.execute(ele => {
            ele.querySelector('input[type="checkbox"]').click();
        }, shareTr)
        await $('div[data-name="material-action-item-Share"]').click()
        await $('app-team-material-share').waitForDisplayed({ timeout: 3000 })
        await $('mat-select[data-name="pipeline-community-select"]').click()
        await $(`mat-option[data-name="pipeline-community-select-item-${testCommunityName}"]`).click()
        await delay(2000)
        await $('button[data-action="pipeline-share-unshare"]').click()
        await $('app-team-material-share').waitForDisplayed({ reverse: true })
        await delay(5000)
        await expect($('app-materials-main table tbody tr:last-of-type td.share-col span')).toHaveText(testCommunityName)
        // Unshare
        await delay(2000)
        await $('app-materials-main table tbody tr:last-of-type').$(`span=${titleVideo}`).click()
        await delay(5000)
        await $('app-material-preview-v2 div.material-details > div:last-of-type i.i-close').click()
        await delay(2000)
        await $('button=Yes, Stop share').click()
        await delay(5000)
        await clearMaterialFilter()
    })
})
describe('Edit Material', () => {
    it('title', async () => {
        await goToPage('materials')
        await $('div[data-name="material-view-mode-list"]').click()
        await $('span=Filter').click()
        await delay(2000)
        await $('app-resource-filters').$('label[for="ft-video"]').$('div=Video').click()        
        await delay(2000)
        await $('mat-drawer i.i-close').click()
        await delay(2000)
        await $('app-materials-main table tr:last-of-type img.thumbnail').scrollIntoView()
        await $('app-materials-main table tr:last-of-type img.thumbnail').moveTo()
        await $('app-materials-main table tr:last-of-type td.item-action i.i-menu-more').click()
        await delay(2000)
        await $('app-materials-main table tr:last-of-type td.item-action div.dropdown div.dropdown-menu').$('span=Rename').scrollIntoView()
        await $('app-materials-main table tr:last-of-type td.item-action div.dropdown div.dropdown-menu').$('span=Rename').click()
        await $('app-video-edit').waitForDisplayed({ timeout: 3000 })
        await delay(3000)
        const old = await $('app-video-edit input[name="title"]').getValue()
        await delay(2000)
        const updated = old + " updated"
        await $('app-video-edit input[name="title"]').setValue(updated)
        await delay(2000)
        await $('button[data-action="material-edit-confirm"]').click()
        await $('app-video-edit').waitForDisplayed({ reverse: true })
        await delay(5000)
        await expect($('span=' + updated)).toBeDisplayed()
        await delay(3000)
        await $('app-materials-main table tr:last-of-type img.thumbnail').scrollIntoView()
        await $('app-materials-main table tr:last-of-type img.thumbnail').moveTo()
        await $('app-materials-main table tr:last-of-type td.item-action i.i-menu-more').click()
        await delay(2000)
        await $('app-materials-main table tr:last-of-type td.item-action div.dropdown div.dropdown-menu').$('span=Rename').scrollIntoView()
        await $('app-materials-main table tr:last-of-type td.item-action div.dropdown div.dropdown-menu').$('span=Rename').click()
        await $('app-video-edit').waitForDisplayed({ timeout: 3000 })
        await delay(3000)
        await $('app-video-edit input[name="title"]').setValue(old)
        await delay(3000)
        await $('button[data-action="material-edit-confirm"]').click()
        await $('app-video-edit').waitForDisplayed({ reverse: true })
        await delay(2000)
    })
    it.skip('description', async () => {
        await goToPage('materials')
        await $('span=Filter').click()
        await delay(2000)
        await $('app-resource-filters').$('label[for="ft-video"]').$('div=Video').click()
        await delay(2000)
        await $('mat-drawer i.i-close').click()
        await delay(2000)
        await $('div[data-name="material-view-mode-list"]').click()
        await $('app-materials-main table tr:last-of-type td.name-col div.material-main-info').scrollIntoView()
        await $('app-materials-main table tr:last-of-type td.name-col div.material-main-info').moveTo()
        await $('app-materials-main table tr:last-of-type td.item-action i.i-menu-more').click()
        await delay(2000)
        await $('app-materials-main table tr:last-of-type td.item-action div.dropdown div.dropdown-menu').$('span=Rename').scrollIntoView()
        await $('app-materials-main table tr:last-of-type td.item-action div.dropdown div.dropdown-menu').$('span=Rename').click()
        await $('app-video-edit').waitForDisplayed({ timeout: 3000 })
        await delay(3000)
        !isVortex ? await browser.execute((text) => {
                        document.querySelector('quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
                    }, '<div>content updated</div>')
                  : await browser.execute((text) => {
                        document.querySelector('quill-editor[data-name="deal-action-description"] .ql-editor > div').innerHTML = text;
                    }, 'content updated')
        await delay(3000)
        await $('button[data-action="material-edit-confirm"]').click()
        await $('app-video-edit').waitForDisplayed({ reverse: true })
        await delay(5000)
        await $('app-materials-main table tr:last-of-type td.name-col div.material-main-info').scrollIntoView()
        await $('app-materials-main table tr:last-of-type td.name-col div.material-main-info').moveTo()
        await $('app-materials-main table tr:last-of-type td.item-action i.i-menu-more').click()
        await delay(2000)
        await $('app-materials-main table tr:last-of-type td.item-action div.dropdown div.dropdown-menu').$('span=Rename').scrollIntoView()
        await $('app-materials-main table tr:last-of-type td.item-action div.dropdown div.dropdown-menu').$('span=Rename').click()
        await $('app-video-edit').waitForDisplayed({ timeout: 3000 })
        await delay(2000)
        await expect($('quill-editor[data-name="deal-action-description"] div.ql-editor > div')).toHaveText('content updated')
        await delay(2000)
        !isVortex ? await browser.execute((text) => {
                        document.querySelector('quill-editor[data-name="deal-action-description"] .ql-editor').innerHTML = text;
                    }, '<div>content</div>')
                  : await browser.execute((text) => {
                        document.querySelector('quill-editor[data-name="deal-action-description"] .ql-editor > div').innerHTML = text;
                    }, 'content')
        await delay(2000)
        await $('button[data-action="material-edit-confirm"]').click()
        await $('app-video-edit').waitForDisplayed({ reverse: true })
        await delay(2000)
    })
    it.skip('thumbnail', async () => {
        await goToPage('materials')
        await $('table tr:first-of-type td.name-col div.folder-thumb').click()
        await $('table tr:last-of-type td.name-col div.material-main-info').scrollIntoView()
        await $('table tr:last-of-type td.name-col div.material-main-info').moveTo()
        await $('table tr:last-of-type td.item-action i.i-menu-more').click()
        await delay(2000)
        await $('table tr:last-of-type td.item-action div.dropdown div.dropdown-menu button[data-action="material-list-edit"]').scrollIntoView()
        await $('table tr:last-of-type td.item-action div.dropdown div.dropdown-menu button[data-action="material-list-edit"]').click()
        await $('mat-dialog-container').waitForDisplayed({ timeout: 3000 })
        await $('a.edit-thumbnail i.i-edit').click()
    })
})
describe.skip('Download', () => {
    it('By Bulk', async () => {
        await goToPage('materials')        
        await $('div=Library').click()
        await delay(2000)
        await $('span=Filter').click()
        await delay(2000)
        await $('app-resource-filters').$('label[for="ft-video"]').$('div=Video').click()
        await delay(2000)
        await $('mat-drawer i.i-close').click()
        await delay(2000)
        const downloadTitle = await $('app-materials-main table tbody tr:first-of-type td.mat-column-name span').getText()
        await $('app-materials-main table tbody tr:first-of-type td.name-col span').moveTo()
        await $('app-materials-main table tbody tr:first-of-type td.sub-item-action i.i-download').click()
        await delay(5000)
        const confirmDialog = await $('app-confirm').isDisplayed()
        if(confirmDialog) {
            await $('app-confirm button[data-action="confirm-downgrade"]').click()
            await delay(3000)
        }
        await $('div=My Materials List').click()
        await delay(3000)
        const paginationExist = await $('span[data-name="material-list-pagination-rows"]').isExisting()
        if(paginationExist) {
            await $('span[data-name="material-list-pagination-rows"]').click()
            await $('div[data-name="material-list-pagination-rows-25"]').click()
            await delay(2000)
        }
        const downloadElement = await $('span=' + downloadTitle)
        await expect(downloadElement).toBeDisplayed()
        await delay(3000)
        const downloadTr = await browser.custom$('closest', downloadElement)
        await browser.execute(ele => {
            ele.querySelector('input[type="checkbox"]').click();
        }, downloadTr)
        await delay(2000)
        await $('div[data-name="material-action-item-Delete"]').scrollIntoView()
        await $('div[data-name="material-action-item-Delete"]').click()
        await delay(2000)
        await $('button[data-action="confirm-downgrade"]').click()
        await delay(5000)
    })
})
describe.skip('Pdf View Mode', () => {
    it('View mode', async () => {
        await goToPage('materials')
        await $('span=Filter').click()
        await delay(2000)
        await $('app-resource-filters').$('label[for="ft-pdf"]').$('div=Pdf').click()
        await delay(2000)
        await $('mat-drawer i.i-close').click()
        await delay(2000)
        const firstPdfSelect = await $('app-materials-main table tbody tr:first-of-type td.checkbox-col')
        await browser.execute(ele => {
            ele.querySelector('input[type="checkbox"]').click();
        }, firstPdfSelect)
        await $('div[data-name="material-action-item-Edit Landing page"]').click()
        await $('app-material-edit-template').waitForDisplayed({ timeout: 2000 })
        await $('app-material-edit-template div.themes div.theme:first-of-type > div.theme-name').waitForClickable({ timeout: 3000 })
        await $('app-material-edit-template div.themes div.theme:first-of-type > div.theme-name').click()
        await $('app-material-edit-template select[name="changeViewMode"]').selectByVisibleText('Bookfold Mode')
        await delay(2000)
        await expect($('select[name="changeViewMode"]')).toHaveValue('bookfold')
        await delay(2000)
        await $('button[data-action="material-change-landing-save"]').click()
        await $('app-material-edit-template').waitForDisplayed({ reverse: true })
        await $('div[data-name="material-action-item-Deselect"]').click()
        await clearMaterialFilter()
    })
})
describe('Filter', () => {
    it('All Types', async () => {
        await goToPage('materials')
        await $('span=Filter').click()
        await delay(2000)
        await $('app-resource-filters').waitForDisplayed({ timeout: 5000 })
        await $('div[data-name="material-filter-clear"]').waitForClickable({ timeout: 3000 })
        await $('div[data-name="material-filter-clear"]').click()
        await $('app-resource-filters').$(`div=${testCommunityName}`).click()
        await delay(5000)
        await $('mat-drawer i.i-close').click()
        await delay(3000)
        const filterResult = await $('app-materials-main table tbody tr:first-of-type td.name-col div.thumbnail').isDisplayed()
        if(filterResult) await expect($('app-materials-main table tbody tr:first-of-type td.share-col span')).toHaveText(testCommunityName)
    })
    it('Clear Filters', async () => {
        await goToPage('materials')
        await clearMaterialFilter()
    })
})
describe('Delete Materials', () => {
    it('Delete Materials', async () => {
        await goToPage('materials')
        const testingVideo = await $('span=' + titleVideo)
        if(testingVideo) {
            const testingVideoTr = await browser.custom$('closest', testingVideo)
            await testingVideoTr.scrollIntoView()
            await browser.execute(ele => {
                ele.querySelector('input[type="checkbox"]').click();
            }, testingVideoTr)
        }
        const testingPdf = await $('span=' + titlePdf)
        if(testingPdf) {
            const testingPdfTr = await browser.custom$('closest', testingPdf)
            await testingPdfTr.scrollIntoView()
            await browser.execute(ele => {
                ele.querySelector('input[type="checkbox"]').click();
            }, testingPdfTr)
        }
        await $('div[data-name="material-action-item-Delete"]').scrollIntoView()
        await $('div[data-name="material-action-item-Delete"]').click()
        await delay(5000)
        const confirmBulkMaterials = await $('app-confirm-bulk-materials').isDisplayed()
        if(confirmBulkMaterials) {
            await $('app-confirm-bulk-materials i.i-close').click()
            await delay(3000)
        } else {
            const confirmDialog = await $('app-confirm').isDisplayed()
            if(confirmDialog) {
                await $('app-confirm button[data-action="confirm-downgrade"]').click()
            }
            await delay(5000)
            await expect(testingVideo).not.toExist()
            await expect(testingPdf).not.toExist()
        }
    })
    it('Delete Folder', async () => {
        await goToPage('materials')
        const testingFolder = await $('span*=Testing Folder')
        if(testingFolder) {
            const testingFolderTr = await browser.custom$('closest', testingFolder)
            await browser.execute(ele => {
                ele.querySelector('input[type="checkbox"]').click();
            }, testingFolderTr)
        }
        await $('div[data-name="material-action-item-Delete"]').scrollIntoView()
        await $('div[data-name="material-action-item-Delete"]').click()
        await $('app-delete-folder').waitForDisplayed({ timeout: 5000 })
        await $('app-delete-folder div[data-name="folder-delete-all-select"]').click()
        await $('app-delete-folder button[data-action="automations-folder-delete-all"]').click()
        await delay(5000)
        const confirmBulkMaterials = await $('app-confirm-bulk-materials').isDisplayed()
        if(confirmBulkMaterials) {
            await $('app-confirm-bulk-materials i.i-close').click()
            await $('app-delete-folder').$('button=Cancel').click()
        }
        await $('app-delete-folder').waitForDisplayed({ reverse: true })
        await delay(3000)
        await expect(testingFolder).not.toExist()
    })
})
describe('Record Video', () => {
    beforeEach(async () => {
        await goToPage('materials')
        await $('button[data-action="material-record-video"]').click()
        await delay(5000)
    })
    it.skip('Cam Only', async () => {
        await $('div[data-name="record-mode-cam_only"]').click()
        await $('app-notify').waitForDisplayed({ timeout: 2000 })
        await expect($('app-notify mat-dialog-content div')).toHaveText('Camera is not connected. Please connect the camera.')
        await $('app-notify mat-dialog-actions button').click()
        await $('app-notify').waitForDisplayed({ reverse: true })
        await $('app-record-setting-dialog div.setting-screen i.i-close').click()
    })
    it('Screen Only', async () => {
        await $('div[data-name="record-mode-screen_only"]').click()
        await $('button[data-action="material-start-recording"]').click()
        await delay(2000)
        await expect($('app-confirm')).toBeDisplayed()
        await $('app-confirm i.i-close').click()
        await $('app-record-setting-dialog div.setting-screen i.i-close').click()
    })
    it('Screen and Cam', async () => {
        await $('div[data-name="record-mode-screen_cam"]').click()
        await expect($('app-record-setting-dialog button.record-button div')).toHaveText('Open Desktop Application')
        await $('app-record-setting-dialog div.setting-screen i.i-close').click()
    })
})

