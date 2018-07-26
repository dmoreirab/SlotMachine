var HomeScreen = require('../PageObjects/HomeScreenPageObject');

describe('Preparing the web application to be tested', () => {
	var homeScreen = new HomeScreen();
	
	it('Open website and check if spin button is displayed', () => {
		//Since the target website don't have angular elements, I am turning this feature off.
		browser.waitForAngularEnabled(false);
		browser.get('http://slotmachinescript.com/');	
		
		expect(homeScreen.spinButton.isDisplayed()).toBe(true);
	});
});