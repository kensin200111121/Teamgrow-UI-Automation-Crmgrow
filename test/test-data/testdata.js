require('dotenv').config({ path: './config/.env' });

exports.user = {
    email: process.env.USER_EMAIL,
    password: process.env.USER_PWD,
    googleCalendarEmail: process.env.GOOGLE_CALENDAR,

    creditCardNumber: process.env.CREDIT_NUMBER,
    creditCardExpiredDate: process.env.CREDIT_EXPIRE,
    creditCardCVC: process.env.CREDIT_CVC
}

exports.isVortex = process.env.PLATFORM === "vortex"

exports.testPrepare = {
    contact: {
        name: '0Jackie',
        phone: '9842010551',
        email: 'jackie.actor@gmail.com',
        company: 'crmGrow'
    },
    pipeline: {
        name: 'Work',
        stage: [
            'Lead',
            '2nd Stage',
            '3rd Stage',
            '4th Stage'
        ],
        deal: 'development'
    },
    automation: {
        name: 'Flexible'
    },
    community: {
        name: 'crmGrow'
    },
    leadCapture: {
        name: 'Lead'
    },
    material: {
        name: 'Official_Material'
    },
    template: {
        name: 'Demo_Template'
    }
}

exports.contact = {
    full_name: process.env.TEST_CONTACT_FULLNAME,
    first_name: process.env.TEST_CONTACT_FIRSTNAME,
    last_name: process.env.TEST_CONTACT_LASTNAME,
    email: process.env.TEST_CONTACT_EMAIL,
    phone: process.env.TEST_CONTACT_PHONE
}