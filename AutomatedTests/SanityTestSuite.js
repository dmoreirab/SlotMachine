//Require PageObjects
var HomeScreen = require('../PageObjects/HomeScreenPageObject');

beforeAll(() => {
	browser.waitForAngularEnabled(false);
	browser.get('http://slotmachinescript.com/');
});

describe('Sanity Test Suite - the SlotMachine webapp', () => {
	//Instantiate PageObjects
	var homeScreen = new HomeScreen();
	
	it('should increase the bet if the raise button is pressed', () => {
		const numberOfRaises = 1;
		//Check the initial bet number
		homeScreen.getBetNumber()

		//Storing the initial bet number
		.then(betNumberBeforeIncreasing => {
			
			//Increasing the bet number clicking the button
			homeScreen.increaseBetUsingButton(numberOfRaises);

			//Getting the new bet number
			homeScreen.getBetNumber()

			//Storing the new bet number
			.then(betNumberAfterIncreasing => {

				//Checking if difference between the final number and the initial number
				expect(betNumberAfterIncreasing - betNumberBeforeIncreasing).toEqual(numberOfRaises);
			});
		});
	});
	
	it('should decrease the bet if the decrease button is pressed', () => {
		const numberOfRaises = 5;
		//Increasing the bet number to assure independency between tests, in this test I want to increase 5 times
		homeScreen.increaseBetUsingButton(5);

		//Check the initial bet number
		homeScreen.getBetNumber()

		//Storing the initial bet number
		.then(betNumberBeforeDecreasing => {
			
			//Decrease the bet number clicking the button, in this test I want to decrease it 5 times, as well
			homeScreen.decreaseBetUsingButton(numberOfRaises);

			//Getting the new bet number
			homeScreen.getBetNumber()

			//Storing the new bet number
			.then(betNumberAfterDecreasing => {

				//Checking if difference between the final number and the initial number  				
				expect(betNumberBeforeDecreasing - betNumberAfterDecreasing).toEqual(numberOfRaises);
			});
		});
	});

	it('should multiply the prizes in the Win Chart by the number of the players Bet', () => {
		const defaultPrizes = [200, 50, 20, 16, 15, 14, 12, 7, 4];
		const numberOfPrizes = 9;
		
		//Get the bet number
		homeScreen.getBetNumber()

		//Store the bet number
		.then(betNumber => {
			//Once you have the bet number store, we can multiply the defaultPrizes array to compare it further with the array we will get from the DOM elements
			const defaultPrizesMultipliedByBetNumber = defaultPrizes.map(arrayElement => arrayElement * betNumber);

			//Get the array of prizes in a raw state
			const displayedPrizesTextRaw = homeScreen.prizes.map(elm => elm.getText());

			//We need to treat it before comparing with defaultPrizesMultipliedByBetNumber, since homescreen.prizes got more elements than we wanted
			displayedPrizesTextRaw.then(rawPrizes => {
				//We need to remove the other elements, leaving only the filled elements prizes
				const displayedPrizesSliced = rawPrizes.slice(0, numberOfPrizes);
				
				//Now that we have the number of elements we need in the array, we need to treat every string element and parse them to integers
				const displayedPrizesParsedToInteger = displayedPrizesSliced.map(num => parseInt(num, 10));
				
				//And finally compare it to the default prizes multiplied by the bet number
				expect(displayedPrizesParsedToInteger).toEqual(defaultPrizesMultipliedByBetNumber);
			});					
		});	
	});

	describe('Spin the slot machine', () => {

		it('should spend credits', () => {
			//Check the initial number of credits
			homeScreen.getCurrentCredits()
	
			//Storing the initial credit number
			.then(creditsBeforeSpinning => {
				
				//Spinning the slot machine
				homeScreen.spinSlotMachine();
	
				//Getting the new credit number
				homeScreen.getCurrentCredits()
	
				//Storing the final credit number
				.then(creditsAfterSpinning => {
					
					//Getting the actual Bet Number
					homeScreen.getBetNumber()
					
					//Storing the bet number
					.then(betNumber => {
						
						//Checking if the difference between the initial and final number is the bet number
						expect(creditsBeforeSpinning - creditsAfterSpinning).toEqual(parseInt(betNumber));

						//Make sure the slot machine stopped spinning to create independency between tests
						homeScreen.confirmSlotMachineStoppedSpinning();
					});		
				});			
			});
		});

		it('should disable the spinButton after spinning the slot machine', () => {
			homeScreen.spinSlotMachine();

			expect(homeScreen.spinButtonDisabled.isDisplayed()).toBe(true);
			
			homeScreen.confirmSlotMachineStoppedSpinning();
		});

		it('should re-enable the spinButton after the slot machine stopped spinning', () => {				
			homeScreen.spinSlotMachine();

			expect(homeScreen.spinButtonDisabled.isDisplayed()).toBe(true);

			homeScreen.confirmSlotMachineStoppedSpinning();

			//need to fix this expect since it is passing every time.
			expect(homeScreen.spinButton.isDisplayed()).toBe(true);
			
		});

		describe('If the player wins', () => {

			it('should increase the number of credits if the result sequence is a win', () => {				
				
							
			});

			fit('lalala', () => {	
				console.log('lalala');			
				let hasWon = false;
				const tryToWin = () => {
					console.log('lalala2');
					homeScreen.spinSlotMachine();	
					homeScreen.confirmSlotMachineStoppedSpinning();	
					homeScreen.didThePlayerWinInSlotMachine1ReelSet1()
					.then(didThePlayerWon => {
						expect(didThePlayerWon).toBe(true);
					}, tryToWin);
				};
				tryToWin();				
			});

			it('should display the last prize the player won', () => {
			
			});

			it('should display in the Win Chart the winning combination', () => {
			
			});

			it('should highlight Play Won in the slot machine header', () => {
			
			});
		});

		describe('If the player loses', () => {
			it('should disable the spin button if the players bet is greater than this credits', () => {
			
			});
		});
	});
});