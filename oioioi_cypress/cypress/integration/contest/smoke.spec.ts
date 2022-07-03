/// <reference types="cypress" />

import "cypress-file-upload";
import { v4 as uuidv4 } from "uuid";

const TYPE_OPTIONS = {
  parseSpecialCharSequences: false,
  delay: 0,
};

const CONTEST_TYPES = [
  "Simple programming contest",
  "Polish Olympiad in Informatics - Online",
  "Polish Olympiad in Informatics - Onsite",
  "Polish Olympiad in Informatics - Onsite - Finals",
  "Baltic Olympiad in Informatics",
  "Baltic Olympiad in Informatics - online",
  "ACM style contest",
  "ACM style contest (open)",
];

context("Access settings for contest", () => {
    beforeEach(() => {
        chooseEnglishLang();
    
        cy.fixture('credentials').then((data) => {
          cy.register(data.user);
          cy.register(data.user_2);
          loginAsAdmin();
          chooseEnglishLang();
        });
      });
  
      it(`Should change dashboard message (simple)`, () => {
        const type  = "Simple programming contest";
        const name = uuidv4().substring(10);
        addContest(type, name);
        cy.get(".form-group > .btn").contains('Add dashboard message').click(); // Edit dashboard message.
        cy.get('#id_content').type("This is dashboard message.")
        cy.contains("Save").click(); // Save.
        cy.contains("This is dashboard message.");
  
        cy.logout();
  
        cy.fixture('credentials').then((data) => {
          cy.login(data.user);
          cy.visit("/c/" + name);
          cy.contains("This is dashboard message");
          cy.logout();
  
          loginAsAdmin();
          deleteContest(name);
        });
      });



      it('should send message', function () {
        const name = uuidv4().substring(10);
        addContest("Simple programming contest", name);
        cy.get('.form-group > .btn').click(); // Edit dashboard message.
    
        cy.get('#id_content').type("This is dashboard message.")
    
        cy.get('.form-group > .btn').click(); // Save.
    
        cy.contains("This is dashboard message.");
    
    
        cy.logout();
        cy.fixture("credentials").then((data) => {
          cy.register(data.user);
          cy.login(data.user);
          cy.contains(name);
          cy.visit("/c/" + name);
          cy.contains("This is dashboard message.");
          cy.get(".list-group").contains("Questions").click();
          cy.contains("Ask a question").click();
          cy.get('#id_category').select("General, Round 1");
          cy.get("#id_topic").type("This is topic");
          cy.get("#id_content").type("This is question");
          cy.contains("Submit").click();
          cy.contains("This is topic");
          cy.logout();
          loginAsAdmin();
          cy.visit("/c/" + name);
          cy.contains("This is topic").click();
          cy.contains("This is question");
    
          cy.get("#id_kind").select("Public message")
          cy.get("#id_content").type("The answer is 42.");
          cy.contains("Submit").click();
    
          cy.logout();
          cy.register(data.user_2);
          cy.login(data.user_2);
          cy.visit("/c/" + name);
          cy.contains("Re: This is topic").click();
          cy.contains("The answer is 42.");
        });
    
        // deleteContest(name);
      });
  });


  


const loginAsAdmin = () => {
  cy.visit("/");
  cy.get(".username").click();

  cy.fixture("credentials").then((data) => {
    cy.login(data.admin);
  });
};

const chooseEnglishLang = () => {
  cy.enLang();
};  


const addContest = (type: string, name: string) => {
  cy.visit("/admin/contests/contest/add");
  cy.get("#contest_form").within(() => {
    cy.get("#id_controller_name").select(type);
    cy.get("input").get("[name='name']").type(name, TYPE_OPTIONS);
    cy.get("input[name='_save']:visible").click();
  });
};

const accessSettings = (name: string) => {
  cy.visit(`/c/${name}/admin/contests/contest/${name}/change/`);
  cy.contains("Change contest");
};

const deleteContest = (name: string) => {
  cy.visit(`/c/${name}/admin/contests/contest/${name}/delete`);
  cy.get("button").contains("Yes, I'm sure").click();
  cy.contains(`The contest "${name}" was deleted successfully.`);
};

