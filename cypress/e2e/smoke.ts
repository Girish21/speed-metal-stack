describe('Smoke', () => {
  it('visit home page', () => {
    cy.visit('/')
    cy.findByRole('heading', { level: 1, name: 'Remix Blog' })
  })
})
