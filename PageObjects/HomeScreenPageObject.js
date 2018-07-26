var HomeScreen = function() {
	
	//Bet Container Elements
	this.lastWinResults = element(by.id('lastWin'));
	this.creditsResults = element(by.id('credits'));
	this.betNumber = element(by.id('bet'));
	this.betSpinUp = element(by.id('betSpinUp'));
	this.betSpinDown = element(by.id('betSpinDown'));
	this.spinButton = element(by.id('spinButton'));

	//Win Chart Elements
	this.prizes = element.all(by.css('span.tdPayout'));

	//Test Elements
	this.slotsInnerContainer = element(by.id('SlotsInnerContainer'));
	
	//Action Methods
	this.spinRoulette = () => { this.spinButton.click(); };
	
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
	
	this.getlastWinResults = () => { this.lastWinResults.getText(); };
	
	this.getCurrentCredits = () => { this.creditsResults.getText(); };

	this.calculateCreditsResults = (valueBeforeSpinning, valueAfterSpinning) => {
		if(this.lastWinResults.getText() === '') {
			return (valueAfterSpinning - valueBeforeSpinning);
		}
		else {
			return (valueAfterSpinning - (parseInt(this.lastWinResults.getText()) + valueBeforeSpinning));
		}
	};
	
	this.getBetNumber = () => {	this.betNumber.getText(); };
	
	this.getPrizeNumber = prizePosition => { this.prizes.get(prizePosition).getText(); };

	this.getPrizeNumbers = () => { this.prizes; };
};

module.exports = HomeScreen;