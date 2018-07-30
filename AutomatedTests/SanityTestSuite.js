//Require PageObjects
var HomeScreen = require('../PageObjects/HomeScreenPageObject');

//Getting Protractor Expected Conditions library
var EC = protractor.ExpectedConditions;

beforeAll(() => {
	browser.waitForAngularEnabled(false);
	browser.get('http://slotmachinescript.com/');
});

//To make sure all test can run independently, I want to the system to be fresh every test.
beforeEach(() => {
	browser.refresh();
});

describe('Sanity Test Suite', () => {
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
		homeScreen.increaseBetUsingButton(numberOfRaises);

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

		it('Should check if TRY ME arrow moved out of the SPIN button after spinning', () => {
			expect(homeScreen.tryMeSpinButton.isPresent()).toBeTruthy();
			homeScreen.spinSlotMachine();
			expect(homeScreen.tryMeSpinButton.isPresent()).toBeFalsy();
		});

		it('Should check if TRY ME arrow disappeared after changing background', () => {
			homeScreen.spinSlotMachine();
			expect(homeScreen.tryMeChangeBg.isPresent()).toBeTruthy();
			homeScreen.pressChangeBgButton();
			expect(homeScreen.tryMeChangeBg.isDisplayed()).toBeFalsy();
		});

		it('should spend credits', () => {
			const tryToWin = () => {
				//We need to get and store the current credits before playing so we can compare it in the end
				homeScreen.getCurrentCredits()
				.then(creditsBeforeAddingPrize => {				
					homeScreen.playOnceCheckForVictory()
					.then(() => {

						//We need to get the betNumber to use later in the comparison as well
						homeScreen.getBetNumber()
						.then(betNumber => {
							homeScreen.returnPrizeInCredits()
							.then(prizeValue => {
								
								const lastWinElement = homeScreen.lastWinResults;
								const timeNeededToAddCreditsInMiliseconds = 30000;
								const lastWinResultsToHaveValue = 
									EC.textToBePresentInElement(lastWinElement, prizeValue);

								browser.wait(lastWinResultsToHaveValue, timeNeededToAddCreditsInMiliseconds);

								//Now, we get the final credits and store it for later comparison
								homeScreen.getCurrentCredits()

								//Finally we get and store the last Win results, that will be added
								//to credits minus the betNumber
								.then(finalCreditsAfterPlaying => {
									homeScreen.getlastWinResults()
									.then(lastWinPrize => {
										const betNumberShouldBe = parseInt(lastWinPrize) + parseInt(creditsBeforeAddingPrize) - parseInt(finalCreditsAfterPlaying);
										expect(parseInt(betNumber)).toBe(betNumberShouldBe);
									});											
								});					
							});																											
						});
					}, tryToWin);
				}); 
			};
			
			tryToWin();
		});

		it('should disable the spinButton after spinning the slot machine', () => {
			homeScreen.spinSlotMachine();

			expect(homeScreen.spinButtonDisabled.isDisplayed()).toBe(true);
		});

		it('should re-enable the spinButton after the slot machine stopped spinning', () => {				
			homeScreen.spinSlotMachine();

			expect(homeScreen.spinButtonDisabled.isDisplayed()).toBeTruthy();
			
			homeScreen.confirmSlotMachineStoppedSpinning()
			
			expect(homeScreen.spinButtonDisabled.isPresent()).toBeFalsy();		
		});

		describe('If the player wins', () => {

			it('should get the three reels position and verify winning combinations', () => {								
				const tryToWin = () => {
					//This method will spin, wait for the reels to stop and then check if the player won
					homeScreen.playOnceCheckForVictory()
					.then(didThePlayerWon => {
						expect(didThePlayerWon).toBe(true);
					}, tryToWin);
				};

				tryToWin();				
			});

			it('should highlight Play Won in the slot machine header', () => {
				//We need to wait until the player wins, so we will loop this method until we get a victory			
				const tryToWin = () => {

					//This method will spin the slotmachine, wait until the reel stops and check victory conditions
					//If positive, he will continue from here, if not, the function tryToWin will run again
					homeScreen.playOnceCheckForVictory()
					.then(() => {

						//Checking if the Won Highlight is displayed
						expect(homeScreen.isWonHighlighted()).toBe(true);							
					}, tryToWin);				
				};			
				tryToWin();
			});

			it('should display in the Win Chart the winning combination highlighted', () => {
				//We need to wait until the player wins, so we will loop this method until we get a victory			
				const tryToWin = () => {

					//This method will spin the slotmachine, wait until the reel stops and check victory conditions
					//If positive, he will continue from here, if not, the function tryToWin will run again
					homeScreen.playOnceCheckForVictory()
					.then(() => {

						//Checking if the Won Highlight is displayed
						expect(homeScreen.isWonHighlighted()).toBe(true);							
					}, tryToWin);				
				};			
				tryToWin();
			});		

			it('should check if the prize in the Win Chart is displayed in the Last Win field', () => {
				const numberOfRaises = 3;
				//Increasing the bet number to assure independency between tests, in this test I want to increase 5 times
				homeScreen.increaseBetUsingButton(numberOfRaises);
				
				//We need to wait until the player wins, so we will loop this method until we get a victory							
				const tryToWin = () => {

					//We need to get and store the current credits before playing so we can compare it in the end
					homeScreen.getCurrentCredits()
					.then(() => {
						
						homeScreen.playOnceCheckForVictory()
						.then(() => {
							homeScreen.returnPrizeInCredits()
							.then(prizeValue => {
								const timeNeededToAddCreditsInMiliseconds = 60000;
								const lastWinResultsToHaveValue = 
									EC.textToBePresentInElement(homeScreen.lastWinResults, prizeValue);
								browser.wait(lastWinResultsToHaveValue, timeNeededToAddCreditsInMiliseconds);
								
								homeScreen.getlastWinResults()
								.then(lastWinResults => {									
									expect(parseInt(lastWinResults)).toBe(prizeValue);
								});											
							});																											
						}, tryToWin);
					}); 
				};
				
				tryToWin();
			});		


			it('should check if the number of credits increased', () => {	
				const numberOfRaises = 3;
				//Increasing the bet number to assure independency between tests, in this test I want to increase 5 times
				homeScreen.increaseBetUsingButton(numberOfRaises);
				
				//We need to wait until the player wins, so we will loop this method until we get a victory							
				const tryToWin = () => {
					//We need to get and store the current credits before playing so we can compare it in the end
					homeScreen.getCurrentCredits()
					.then(creditsBeforeAddingPrize => {
						//This method will spin the slotmachine, wait until the reel stops and check victory conditions
						//If positive, he will continue from here, if not, the function tryToWin will run again
						homeScreen.playOnceCheckForVictory()
						.then(() => {

							//We need to get the betNumber to use later in the comparison as well
							homeScreen.getBetNumber()
							.then(betNumber => {
								homeScreen.returnPrizeInCredits()
								.then(prizeValue => {
									
									const lastWinElement = homeScreen.lastWinResults;
									const timeNeededToAddCreditsInMiliseconds = 30000;
									const lastWinResultsToHaveValue = 
										EC.textToBePresentInElement(lastWinElement, prizeValue);

									browser.wait(lastWinResultsToHaveValue, timeNeededToAddCreditsInMiliseconds);
	
									//Now, we get the final credits and store it for later comparison
									homeScreen.getCurrentCredits()
	
									//Finally we get and store the last Win results, that will be added
									//to credits minus the betNumber
									.then(finalCreditsAfterPlaying => {
										homeScreen.getlastWinResults()
										.then(lastWinResults => {
											const finalCredits = parseInt(creditsBeforeAddingPrize) + parseInt(lastWinResults) - parseInt(betNumber);
											expect(parseInt(finalCreditsAfterPlaying)).toBe(finalCredits);
										});											
									});					
								});																											
							});
						}, tryToWin);
					}); 
				};
				
				tryToWin();
				
			});		
		});	
	});
});