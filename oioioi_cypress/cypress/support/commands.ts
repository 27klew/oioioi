// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("hideDjangoToolbar", () => {
    cy.get('body').then((body) => {
        if (body.find('#djHideToolBarButton').length > 0) {
            cy.get('#djHideToolBarButton').click()
        }
    })
})

Cypress.Commands.add("login", (user: OIOIOI.User, verify: boolean = true) => {
    cy.visit("/")
    cy.get('.username').click()
    cy.get('#navbar-login').within(() => {
        cy.get('input[name="auth-username"]').type(user.username);
        cy.get('input[name="auth-password"]').type(user.password);
        cy.get('button[type="submit"]').click();
    });
    if (verify) {
        cy.get('body').should('not.contain',
            'Please enter a correct username and password.')
    }
});

Cypress.Commands.add("logout", () => {
    cy.get('#navbar-username').click();
    cy.contains("Log out").click();
});

Cypress.Commands.add("register", (user_info: OIOIOI.user) => {
    visitRegistrationSite();
    cy.get('.oioioi-form__container').within(() => {
        fillRegistrationForm(user_info);
        cy.get('button[type="submit"]').first().click();
    })
});

Cypress.Commands.add("setLang", (language: string) => {
    cy.visit("/");
    cy.get(".oioioi-navbar__lang").click();
    cy.get(".lang-select").contains(language).click();
});

Cypress.Commands.add("enLang", () => {
    cy.setLang("English");
});

Cypress.Commands.add("plLang", () => {
    cy.setLang("Polski");
});


const fillRegistrationForm = (user_info: OIOIOI.User) => {
    const form_text_map = new Map<string, string>([
        ['#id_username',    user_info.username],
        ['#id_first_name',  user_info.first_name],
        ['#id_last_name',   user_info.last_name],
        ['#id_email',       user_info.email],
        ['#id_password1',   user_info.password],
        ['#id_password2',   user_info.password],
    ]);

    for (let [field, value] of form_text_map) {
        cy.get(field).type(value);
    }

    cy.get('#id_terms_accepted').check();

    // https://django-simple-captcha.readthedocs.io/en/latest/advanced.html#captcha-test-mode
    cy.get('#id_captcha_1').type('PASSED');
};

const visitRegistrationSite = () => {
    cy.get('.username').click();
    cy.get('#navbar-login').within(() => {
        cy.get('a[role="button"]').click();
    });
};
