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
	this.spinRoulette = function() {		
		this.spinButton.click();		
	};
	
	this.increaseBetUsingButton = function(numberOfRaises) {
		for (i = 0; i < numberOfRaises; i++) {
			this.betSpinUp.click();
		}		
	};
	
	this.decreaseBetUsingButton = function(numberOfDecreases) {
		for (i = 0; i < numberOfDecreases; i++) {
			this.betSpinDown.click();
		};	
	};
	
	this.getlastWinResults = function() {
		return this.lastWinResults.getText();
	};
	
	this.getCurrentCredits = function() {
		return this.creditsResults.getText();
	};

	this.calculateCreditsResults = function(valueBeforeSpinning, valueAfterSpinning) {
		if(this.lastWinResults.getText() === '') {
			return (valueAfterSpinning - valueBeforeSpinning);
		}
		else {
			return (valueAfterSpinning - (parseInt(this.lastWinResults.getText()) + valueBeforeSpinning));
		}
	};
	
	this.getBetNumber = function() {
		return this.betNumber.getText();
	};
	
	this.getPrizeNumber = function(prizePosition) {
		return this.prizes.get(prizePosition).getText();
	};

	this.getPrizeNumbers = function() {
		return this.prizes;
	};
};

module.exports = HomeScreen;