describe ('Validate various elements on Action page', ()=> {
    before(() => {
        cy.request('https://api.spacexdata.com/v3/missions').its('body').should('have.length', 10)
    })

    beforeEach(() => {
        cy.visit('/commands/actions')
        
        cy.fixture('example').then(function (data) {
            this.data = data
            cy.log('This: ', this.data.email)
        })
    })

    it ('access to this.data', function () {
        cy.visit('/commands/network-requests')
        cy.intercept('GET', '**/comments/*', this.data).as('getComment')
        cy.get('.network-btn').click()
        cy.wait('@getComment').then((res) => {
            cy.log(res)
        })
    })

    it ('I can set localStorageValue', () => {
        const testValue = '12345667'
        cy.visit('/commands/actions')
        cy.setLocalStorage('testing', testValue)
        cy.getLocalStorage('testing').should('eq', testValue)
    })

    it ('overwrite sensitive data logging', () => {
        cy.findByPlaceholderText('Email').type('julie@gmail.com', {sensitive: true})
    })

    it('has an h1 on the page', () => {
        cy.get('h1').first().should('exist');
    })

    it ('it renders correct text', () => {
        cy.get('h1').should('contain.text', 'Actions')
    })

    it ('it contains paragraph element', () => {
        cy.get('.container').eq(1).find('p').should('exist')
    })

    it ('renders a section with correct elements', () => {
        cy.get('.container').eq(2).within(() => {
            cy.get('h4').should('exist');
            cy.get('p').should('exist');
        })
    })

    it ('check findBy is working', () => {
        const navBarText = 'cypress.io'
        cy.findByText(navBarText).should('exist')
    })

    it ('check we can type in email entry and we can use non cy command in async fashion', () => {
        cy.findByPlaceholderText('Email').type('julie@gmail.com')
        //.should('have.value', 'julie@gmail.com').clear().should('have.value', '')
        cy.wait(2000).then(()=>{
            fetch('https://api.spacexdata.com/v3/missions')
            .then((res) => res.json())
            .then(data => {
                console.log(data)
            })
        })
        cy.log('test is complte')
    })

    it ('shows active class for current page', ()=>{
        cy.get('.dropdown-menu').find('li').eq(2).should('have.class', 'active')
    })

    it ('shows not have active class for inactive page', ()=>{
        cy.get('.dropdown-menu').find('li').eq(1)
        .should('not.have.class', 'active')
        .find('a')
        .should('have.attr', 'href', '/commands/traversal')
    })

    it ('should link to correct url', () => {
        cy.visit('/')
        cy.findAllByText('Actions').first().click({force: true})
        cy.url().should('include', '/commands/actions')
    })

    it ('check box test', () =>{
        cy.get('.action-check [type="checkbox"]').first().check().should('be.checked').uncheck().check()
    })
})