var HomeScreen = function () {

	//Bet Container Elements
	this.lastWinResults = element(by.id('lastWin'));
	this.creditsResults = element(by.id('credits'));
	this.betNumber = element(by.id('bet'));
	this.betSpinUp = element(by.id('betSpinUp'));
	this.betSpinDown = element(by.id('betSpinDown'));
	this.spinButton = element(by.id('spinButton'));
	this.spinButtonDisabled = element(by.css('.disabled'));

	//Win Chart Elements
	this.prizes = element.all(by.css('span.tdPayout'));
	this.wonHighlight = element(by.css('won'));

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

	//In this function, we are waiting for the credits value stop incrementing after the player has won
	this.confirmCreditsWereAdded = () => {
		return this.getlastWinResults()
		.then(lastWinResults => {
			const promiseCreditsAdded = new protractor.promise.defer();
			const didLastWinGotUpdated = lastWinResults != undefined ? true :  false;
			
			if(didLastWinGotUpdated) {
				promiseCreditsAdded.fulfill(didLastWinGotUpdated);
			}
			else {
				promiseCreditsAdded.reject(didLastWinGotUpdated);
			}
			return promiseCreditsAdded;
		});				
	};

	this.playOnceCheckForVictory = () => {
		this.spinSlotMachine();	
		this.confirmSlotMachineStoppedSpinning();	
		return this.didThePlayerWinInSlotMachine1ReelSet1();
	};

	this.didThePlayerWinInSlotMachine1ReelSet1 = () => {
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
				const hasWon = oneSymbol(this.prize6) || oneSymbol(this.prize4) || oneSymbol(this.prize2) ||
				oneSymbol(this.prize5) || oneSymbol(this.prize1) || oneSymbol(this.prize3) ||
				twoSymbols() || threeSymbols();
				
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

	
};

module.exports = HomeScreen;