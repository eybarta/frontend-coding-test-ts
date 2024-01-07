import CatFactPlus from './CatFactPlus.vue'
import generateImage from '@services/imageServices.ts'
import generateCatFacts from '@services/catFactGenerator.ts'
import { mount } from'@cypress/vue'
describe('<CatFactPlus />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(CatFactPlus)
  });

	it('should store cat facts in local storage max 4 seconds', () => {
    cy.mount(CatFactPlus)
    cy.wait(4000);
    cy.window().then((window) => {
      const catFacts = window.localStorage.getItem('cat-facts');
      expect(catFacts).to.not.be.null;

      // Parse the stored JSON and perform further assertions
      const catFactsArray = JSON.parse(catFacts);
      expect(catFactsArray).to.be.an('array').that.is.not.empty;
      // You can add more specific checks here, like length of the array or contents of the first item
    });
  });
	it('should update current fact index by 1', () => {
		cy.mount(CatFactPlus).then(({ wrapper, component }) => {
			const { nextBtn, currentCatFactIndex: initialIndex } = component
			cy.get(nextBtn).click();
			// Re-fetch the component instance to get the updated state
			cy.wrap(wrapper).then((updatedWrapper) => {
				const updatedIndex = updatedWrapper.vm.currentCatFactIndex;
				expect(updatedIndex).to.equal(initialIndex + 1);
			});
		});
	});
})
