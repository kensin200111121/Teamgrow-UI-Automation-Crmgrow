
const testStepDescriptions = {
    'Login': [
        'Visit the dev-app.crmgrow.com',
        'Input the email and password',
        'Check if it redirects to home page after login',
        ],
    'Logout': [
        'Open the profile menu in navbar',
        'Click the logout menu item',
        'Check if it redirects to the login page',
    ],
    'Tasks Pagination 8': [
        'Click to the Tasks sidebar item',
        'Click pagination section',
        'Select 8 rows',
        'Check if pagination section is set to 8 rows',
    ],
    'Tasks Pagination 50': [
        'Click to the Tasks sidebar item',
        'Click pagination section',
        'Select 8 rows',
        'Check if pagination section is set to 8 rows',
    ],
    'Dashboard Activity Pagination 8': [
        'Click to the Dashboard sidebar item',
        'Click Activity item on slidebar',
        'Click pagination section',
        'Select 8 rows',
        'Check if pagination section is set to 8 rows',
    ],
    'Dashboard Activity Pagination 50': [
        'Click to the Dashboard sidebar item',
        'Click Activity item on slidebar',
        'Click pagination section',
        'Select 50 rows',
        'Check if pagination section is set to 50 rows',
    ],
}

module.exports = {
   testStepDescriptions
}
