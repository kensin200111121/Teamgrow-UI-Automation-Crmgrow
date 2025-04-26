
const isVortex = require('../test-data/testdata').isVortex

const delay = (ms) => {
    return new Promise(res => {
       setTimeout(() => {
        res()
       }, ms) 
    })
}

const crmgrowMenu = {
    "dashboard": "dashboard",
    "tasks": "tasks",
    "pipeline": "pipeline",
    "sphere": "sphere",
    "contacts": "contacts",
    "automations": "automations",
    "materials": "materials",
    "calendar": "calendar",
    "community": "community",
    "templates": "templates",
    "bulkEmail": "bulk_email",
    "leadhub": "lead_hub",
    "settings": "settings",
};

const vortexMenu = {
    "dashboard": "1",
    "tasks": "2",
    "pipeline": "3",
    "sphere": "5",
    "contacts": "4",
    "prospecting": "5",
    "automations": "6",
    "materials": "7",
    "calendar": "8",
    "community": "9",
    "templates": "10",
    "settings": "10",
}

const crmgrowSubmenu = {
    "contactManager": {
        "title": "contact_manager",
        "parent": "contacts",
    },
    "callReport": {
        "title": "call_report",
        "parent": "contacts",
    },
    "pipelinesLibrary": {
        "title": "pipelines_library",
        "parent": "pipeline",
    },
    "pipelineManager": {
        "title": "pipeline_manager",
        "parent": "pipeline",
    },
    "scheduler": {
        "title": "scheduler",
        "parent": "leadhub",
    },
    "smartCode": {
        "title": "smart_code",
        "parent": "leadhub",
    },
    "leadCaptureForm": {
        "title": "lead_capture",
        "parent": "leadhub",
    },
    "notifications": {
        "title": "notifications",
        "parent": "settings",
    },
    "sms": {
        "title": "sms",
        "parent": "settings",
    },
    "businessHours": {
        "title": "business_hour",
        "parent": "settings",
    },
    "assistant": {
        "title": "assistant",
        "parent": "settings",
    },
    "landingPageTheme": {
        "title": "landing_page_theme",
        "parent": "settings",
    },
    "mergedFieldManager": {
        "title": "merged_field_manager",
        "parent": "templates",
    },
}

const vortexSubmenu = {
    "contactManager": {
        "title": "Tags, Labels, & Fields",
        "parent": "contacts",
    },
    "callReport": {
        "title": "Call Reports",
        "parent": "contacts",
    },
    "scheduler": {
        "title": "Scheduler",
        "parent": "calendar",
    },
    "leadCaptureForm": {
        "title": "Lead Forms",
        "parent": "materials",
    },
    "notifications": {
        "title": "Notifications",
        "parent": "settings",
    },
    "sms": {
        "title": "SMS",
        "parent": "settings",
    },
    "businessHours": {
        "title": "Business Hours",
        "parent": "settings",
    },
    "landingPageTheme": {
        "title": "Landing Page Theme",
        "parent": "settings",
    },
    "mergedFieldManager": {
        "title": "Custom Merge Fields",
        "parent": "templates",
    },
}

const goToPage = async title => {              
    const dialog = await $('div.cdk-overlay-container div.cdk-global-overlay-wrapper mat-dialog-container').isDisplayed()
    if(dialog) {
        const closeIcon = await $('div.cdk-overlay-container div.cdk-global-overlay-wrapper mat-dialog-container i.i-close').isDisplayed()
        if(closeIcon) await $('div.cdk-overlay-container div.cdk-global-overlay-wrapper mat-dialog-container i.i-close').click()
        else {
            const closeButton = await $('div.cdk-overlay-container div.cdk-global-overlay-wrapper mat-dialog-container').$('button=Cancel').isDisplayed()
            if(closeButton) await $('div.cdk-overlay-container div.cdk-global-overlay-wrapper mat-dialog-container').$('button=Cancel').click()
            else await $('div.cdk-overlay-container div.cdk-global-overlay-wrapper mat-dialog-container').$('span=Cancel').click()
        }
        await delay(2000)
    }    
    !isVortex ? await $(`div[data-name="sidebar-item-${crmgrowMenu[title]}"]`).click()
              : await $(`div.leads-navbar__safety-element div.side-navbar-item:nth-of-type(${vortexMenu[title]}) svg.vortex-icon`).click()    
    await delay(1000) 
    if(isVortex) {
        switch (title) {
            case 'materials':
                await $('div=Materials').click(); break;
            case 'templates':
                await $('div=Templates').click(); break;
            case 'contacts':
                await $('div=Contacts').click(); break;
            case 'calendar':
                await $('div=My Calendar').click(); break;
            default:
                break;
        }
    }
    await delay(5000)

    let materialsSubmenuDisplayed, contactsSubmenuDisplayed, calendarSubmenuDisplayed, submenuDisplayed
    if(isVortex) {
        materialsSubmenuDisplayed = await $('div=Materials').isDisplayed()
        contactsSubmenuDisplayed = await $('div=Contacts').isDisplayed()
        calendarSubmenuDisplayed = await $('div=My Calendar').isDisplayed()
        submenuDisplayed = ( title === 'materials' && materialsSubmenuDisplayed ) ||
                           ( title === 'contacts' && contactsSubmenuDisplayed ) ||
                           ( title === 'calendar' && calendarSubmenuDisplayed )
    }   
    if(submenuDisplayed && isVortex) {
        await $('div.top-navbar__section > button.vortex-button svg.vortex-icon').click()
    }
    await delay(1000)
}

const goToSubmenu = async title => {
    const dialog = await $('div.cdk-overlay-container div.cdk-global-overlay-wrapper mat-dialog-container').isDisplayed()
    if(dialog) {
        const closeButton = await $('div.cdk-overlay-container div.cdk-global-overlay-wrapper mat-dialog-container i.i-close').isDisplayed()
        if(closeButton) await $('div.cdk-overlay-container div.cdk-global-overlay-wrapper mat-dialog-container i.i-close').click()
        else await $('button=Cancel').click()
        await delay(2000)
    }    
    if(!isVortex) {  
        const submenuDisplayed = await $(`li[data-name="sidebar-submenu-item-${crmgrowSubmenu[title]["title"]}"]`).isDisplayed()                  
        if(!submenuDisplayed) {
            await $(`div[data-name="sidebar-item-${crmgrowMenu[crmgrowSubmenu[title]["parent"]]}"]`).click()
            await delay(1000)    
        }      
        await $(`li[data-name="sidebar-submenu-item-${crmgrowSubmenu[title]["title"]}"] > a`).click()
        await delay(5000)
    } else {
        await $(`div.leads-navbar__safety-element div.side-navbar-item:nth-of-type(${vortexMenu[vortexSubmenu[title]["parent"]]})`).click()
        await delay(1000)    
        await $(`div=${vortexSubmenu[title]["title"]}`).click()
        await delay(5000)
        const submenuDisplayed = await $(`div=${vortexSubmenu[title]["title"]}`).isDisplayed()
        if(submenuDisplayed) {
            await $('div.top-navbar__section > button.vortex-button svg.vortex-icon').click()
            await delay(1000)
        }
    }
}

module.exports = {
    goToPage,
    goToSubmenu
}
