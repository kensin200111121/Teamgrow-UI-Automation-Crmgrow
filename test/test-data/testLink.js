require('dotenv').config({ path: './config/.env' });

const isVortex = process.env.PLATFORM === "vortex";
const isStage = process.env.ENV === 'dev'
const DOMAIN = !isVortex ?  isStage ? "https://stg-app.crmgrow.com" : "https://dev-app.crmgrow.com" : "https://vortexstage.gst.dev";

exports.Link = {
    AUTOMATIONS_LINK : `${DOMAIN}/automations/own/root`,
    BULK_EMAIL_LINK : `${DOMAIN}/bulk-mail`,
    COMMUNITY_LINK : `${DOMAIN}/community`,
    TASKS_LINK : `${DOMAIN}/tasks`,
    CONTACTS_LINK : `${DOMAIN}/contacts`,
    LEAD_HUB_LINK : `${DOMAIN}/lead-hub/scheduler`,
    LOGIN_LINK : !isVortex ? `${DOMAIN}/login` : `${DOMAIN}/`,
    HOME_LINK : !isVortex ? `${DOMAIN}/home` : `${DOMAIN}/lms/system-onboarding`,
    MATERIALS_LINK : `${DOMAIN}/materials/own/root`,
    PIPELINE_LINK : `${DOMAIN}/pipeline`,
    TEMPLATES_LINK : `${DOMAIN}/templates/own/root`,
    SETTINGS_LINK : `${DOMAIN}/settings/notifications`,
    
    RESET_PASSWORD_LINK : `${DOMAIN}/reset-password?email:`,
    SCHEDULER_BOOKING_LINK : `https://scheduler1.crmgrow.com/`,
    MEETING_LINK : `https://scheduler1.crmgrow.com/meeting/discussion`,
    KNOWLEDGE_BASE_LINK : `https://kb1.crmgrow.com/kb/en/crmgrow-knowledge-base`,
    ASK_QUESTION_LINK : `https://crmgrow.stonly.com/kb/guide/en/`,
    REPORT_BUG_LINK : `https://stonly.com/guide/en/contact-crmgrow-7avienyj9s/Steps/1227137`,
    LIVE_TRAINING_LINK : `https://scheduler.crmgrow.com/not-found`,
    PRICING_LINK : `https://crmgrow.com/pricing.html`,
    OUTLOOK_LINK : `https://outlook.live.com/mail/0/`
}


