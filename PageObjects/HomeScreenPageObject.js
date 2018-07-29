var HomeScreen = function () {

	//Bet Container Elements
	this.lastWinResults = element(by.id('lastWin'));
	this.creditsResults = element(by.id('credits'));
	this.betNumber = element(by.id('bet'));
	this.betSpinUp = element(by.id('betSpinUp'));
	this.betSpinDown = element(by.id('betSpinDown'));
	this.spinButton = element(by.id('spinButton'));
	this.spinButtonDisabled = $('#spinButton.disabled');

	//Win Chart Elements
	this.prizes = $$('span.tdPayout');
	this.wonHighlight = $$('.won');

	//Slot Machine Elements
	this.firstReel = element(by.id('reel1'));
	this.secondReel = element(by.id('reel2'));
	this.thirdReel = element(by.id('reel3'));

	//Test Elements
	this.slotsInnerContainer = element(by.id('SlotsInnerContainer'));

	//Action Methods
	this.spinSlotMachine = () => { this.spinButton.click(); };

	//Reel texture position of the prizes for slotMachine1 and reelSet1
	this.prize6 = '-1234px';
	this.prize4 = '-994px';
	this.prize2 = '-754px';
	this.prize5 = '-1114px';
	this.prize1 = '-634px';
	this.prize3 = '-874px';

	this.increaseBetUsingButton = numberOfRaises => {
		for (i = 0; i < numberOfRaises; i++) {
			this.betSpinUp.click();
		}
	};

	this.decreaseBetUsingButton = numberOfDecreases => {
		for (i = 0; i < numberOfDecreases; i++) {
			this.betSpinDown.click();
		};
	};

	this.getlastWinResults = () => {
		return this.lastWinResults.getText();
	};

	this.getCurrentCredits = () => {
		return this.creditsResults.getText();
	};

	this.getCurrentCredits2 = () => {
		return this.creditsResults.getText();
	};

	this.calculateCreditsResults = (valueBeforeSpinning, valueAfterSpinning) => {
		if (this.lastWinResults.getText() === '') {
			return (valueAfterSpinning - valueBeforeSpinning);
		}
		else {
			return (valueAfterSpinning - (parseInt(this.lastWinResults.getText()) + valueBeforeSpinning));
		}
	};

	this.getBetNumber = () => {
		return this.betNumber.getText();
	};

	this.getPrizeNumber = prizePosition => { this.prizes.get(prizePosition).getText(); };

	this.getPrizeNumbers = () => { this.prizes; };

	this.getFirstReelTexturePosition = () => {
		return this.firstReel.getCssValue('top');
	};

	this.getMiddleReelTexturePosition = () => {
		return this.secondReel.getCssValue('top');
	};

	this.getLastReelTexturePosition = () => {
		return this.thirdReel.getCssValue('top');
	};

	this.isWonHighlighted = () => { return this.wonHighlight.get(0).isDisplayed(); };
 	this.isPrizeHighlighted = () => { return this.wonHighlight.get(1).isDisplayed(); };

	//In this function, we are waiting for the last position of the third reel to stop changing
	this.confirmSlotMachineStoppedSpinning = () => {
		const numberOfSpins = 100;
		var oldTexturePosition = '';

		//When the new position is equal to the old one, we are considering the reel stopped and we break the loop
		for (i = 0; i < numberOfSpins; i++) {
			this.getLastReelTexturePosition().then(newTexturePosition => {
				if (newTexturePosition === oldTexturePosition) { return; };
				oldTexturePosition = newTexturePosition;
			});
		};
	};

	this.prizeLogicForSM1RS1 = (first, middle, last) => {
		//SlotMachine1 ReelSet1 win logic								
		const oneSymbol = prize => 
		first === prize && middle === prize && last === prize;

		const twoSymbols = () => {
		return (first === this.prize3 || first === this.prize1)
			&& (middle === this.prize5 || first === this.prize2)
			&& (last === this.prize4 || first === this.prize6)					
		}

		const threeSymbols = () => {
		return (first === this.prize5 || first === this.prize3 || first === this.prize1)
		&& (middle === this.prize5 || middle === this.prize3 || middle === this.prize1)
		&&	(last === this.prize5 || last === this.prize3 || last === this.prize1)						
		}

		//The result: did the player win? it will return the boolean we wanted
		return hasWon = oneSymbol(this.prize6) || oneSymbol(this.prize4) || oneSymbol(this.prize2) ||
		oneSymbol(this.prize5) || oneSymbol(this.prize1) || oneSymbol(this.prize3) ||
		twoSymbols() || threeSymbols();
	};

	
	this.playOnceCheckForVictory = () => {
		this.spinSlotMachine();	
		this.confirmSlotMachineStoppedSpinning();	
		return this.didThePlayerWinInSlotMachineReelSet(1, 1);
	};
			
	this.didThePlayerWinInSlotMachineReelSet = (machineNumber, reelSetNumber) => {
		//Getting all the 3 texture position of the 3 reels
		return protractor.promise.all([
			this.getFirstReelTexturePosition(), 
			this.getMiddleReelTexturePosition(), 
			this.getLastReelTexturePosition()
		])
		.then(values => {
			const [first, middle, last] = values;

			//We want to check if the player wins, so, we need to create a promise that will return a boolean
			const wonPromise = new protractor.promise.defer();

				if(machineNumber === 1 && reelSetNumber === 1) {
					var hasWon = this.prizeLogicForSM1RS1(first, middle, last);
				}

				//Finally we fulfill or reject our promise based on the boolean we got from above and pass it
				//to the return of our promise. 
				if(!hasWon) {
					wonPromise.reject(hasWon);		
				}
				else {
					wonPromise.fulfill(hasWon);
				}
			return wonPromise.promise;
		});
	};

	//This will get the current array of prizes of in the Win Chart 
	this.getArrayOfPrizesUpdated = () => {
		const numberOfPrizes = 9;
		
		const displayedPrizesTextRaw = this.prizes.map(elm => elm.getText());

		return displayedPrizesTextRaw.then(rawPrizes => {
			const prizesArrayPromise = new protractor.promise.defer();

			const displayedPrizesSliced = rawPrizes.slice(0, numberOfPrizes);
			const displayedPrizesParsedToInteger = displayedPrizesSliced.map(num => parseInt(num, 10));	
			const gotTheArray = displayedPrizesParsedToInteger != undefined ? true: false;
			
			if(!gotTheArray) {
				prizesArrayPromise.reject('Rejected');		
			}
			else {
				prizesArrayPromise.fulfill(displayedPrizesParsedToInteger);
			}
			return prizesArrayPromise.promise;
		});									
	};

	//This function will get all reel positions after winning. Then, the test will check which 
	//Combination won based on the reel positions. Knowing the winning prize it will look for it 
	//in the displayed Win Chart for a match and return the value of the prize. 
	this.returnPrizeInCredits = () => {
		//Getting all the 3 texture position of the 3 reels
		return protractor.promise.all([
			this.getFirstReelTexturePosition(), 
			this.getMiddleReelTexturePosition(), 
			this.getLastReelTexturePosition()
		])
		.then(values => {
			const [first, middle, last] = values;			
		
			return this.getArrayOfPrizesUpdated().then(prizesArray => {
				//We want to check if the player wins, so, we need to create a promise that will return a boolean
				const wonPromise = new protractor.promise.defer();

				const oneSymbol = prize => 
				first === prize && middle === prize && last === prize;
		
				const twoSymbols = () => {
				return (first === this.prize3 || first === this.prize1)
					&& (middle === this.prize5 || first === this.prize2)
					&& (last === this.prize4 || first === this.prize6)					
				}
		
				const threeSymbols = () => {
				return (first === this.prize5 || first === this.prize3 || first === this.prize1)
				&& (middle === this.prize5 || middle === this.prize3 || middle === this.prize1)
				&&	(last === this.prize5 || last === this.prize3 || last === this.prize1)						
				}

				//We need to confirm that a prize won to return the value of the prize
				//Inspecting the Win chart elements, I discovered the name of the icons
				//For example, prize6 is match of 3 BIG WIN icons for slot machine 1 reel set 1
				const firstPrizeWon = oneSymbol(this.prize6);
				const secondPrizeWon = oneSymbol(this.prize4);
				const thirdPrizeWon = oneSymbol(this.prize2);
				const forthPrizeWon = twoSymbols();
				const fifthPrizeWon = oneSymbol(this.prize5);
				const sixthPrizeWon = oneSymbol(this.prize1);
				const seventhPrizeWon = oneSymbol(this.prize3);
				const eighthPrizeWon = threeSymbols();
				
				const hasWon = firstPrizeWon || secondPrizeWon || thirdPrizeWon || forthPrizeWon || fifthPrizeWon
				|| sixthPrizeWon || seventhPrizeWon || eighthPrizeWon;

				var valueToBeReturned;
				
				//For example, if the eighth row of the Win Chart is the winning combination,
				//I can assign the prize to be returned based on the array value  
				//I got from the prizes array before
				if(firstPrizeWon) { valueToBeReturned =  prizesArray[0]; };
				if(secondPrizeWon) { valueToBeReturned = prizesArray[1]; };
				if(thirdPrizeWon) { valueToBeReturned = prizesArray[2]; };
				if(forthPrizeWon) { valueToBeReturned = prizesArray[3]; };
				if(fifthPrizeWon) { valueToBeReturned = prizesArray[4]; };
				if(sixthPrizeWon) { valueToBeReturned = prizesArray[5]; };
				if(seventhPrizeWon) { valueToBeReturned = prizesArray[6]; };
				if(eighthPrizeWon) { valueToBeReturned = prizesArray[7]; };
				console.log(valueToBeReturned);
				if(!hasWon) {
					wonPromise.reject(valueToBeReturned);		
				}
				else {
					wonPromise.fulfill(valueToBeReturned);
				}
			return wonPromise.promise;
			});											
		});
	};
};

module.exports = HomeScreen;