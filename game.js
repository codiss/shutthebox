function main(){
	makeBoard();

	//set variables
	var diceValues = [];
	var currentSelected = [];
	var closedAndDice = [];
	var message = "";
	var openTabs = [1,2,3,4,5,6,7,8,9];
	var currentSub = 0;
	var closeString = "";
	var closeBox = "";
	var mySum = 0;
	var lastTwo = 0;
	var win = false;

	//new game
	$("#newButton").on("click", function(){
		clearBoard();

		diceValues = [];
		currentSelected = [];
		openTabs = [1,2,3,4,5,6,7,8,9];

	});

	//handles the roll button and checks for loss
	$("#rollButton").on("click", function(){
		diceValues = rollClick(diceValues);
		if(lose(diceValues[2], openTabs)) {
			displayOnBoard("You lose!", false);
		};

	});

	$(".checkBox").on("click", function(){

		//get tabs and diceValues back as an array, then seperate them
		closedAndDice = checked(openTabs, diceValues);
		openTabs = closedAndDice[0];
		diceValues = closedAndDice[1];				
	});
}

function rollClick(diceValues){
	//returns two dice and there sum, also temporarily disables roll button

	diceValues[0] = rollDie();
	diceValues[1] = rollDie();
	diceValues[2] = diceValues[0] + diceValues[1];

	$("#die1").html("<img src = \"dice/" + diceValues[0] + ".png\">");
	$("#die2").html("<img src = \"dice/" + diceValues[1] + ".png\">");

	$("#rollButton").attr("disabled","disabled");
	return diceValues;

}

function rollDie(){
	//returns random int between 1 and 6
	return Math.floor(Math.random() * 6) + 1;
}

function checked(openTabs, diceValues){
	//get subtotal from all checked boxes
	currentSub = 0;
	currentSelected = [];

	//use index of every checkBox class item to  calculate current subtotal
	$(".checkBox").each(function(index, element){
		if($(element).prop("checked")){currentSelected.push(index + 1);
																	currentSub += index + 1;};
	});
	$("#subtotal").html(currentSub);
	
	//check if subtotal matches dice subtotal
	if(currentSub == diceValues[2]) {
		openTabs = closeTabs(openTabs);
		diceValues = [0,0,0]
		currentSub = 0;
	}

	return [openTabs, diceValues];
}

function closeTabs(openTabs) {
	//X out numbers, disable check boxes, reset dice, and check if game is won.

	//modify board and remove closures from list of open tabs
	for(i = 0; i < currentSelected.length; i++){
		closeString = ("#num" + currentSelected[i]);
		closeBox = ("#" + currentSelected[i]);
		$(closeBox).prop("checked", false);
		$(closeBox).prop("disabled", true);
		$(closeString).html(" ");

		openTabs.splice(openTabs.indexOf(currentSelected[i]), 1);
	}

	//check for win and respond accordingly
	if(openTabs.length == 0) {
		displayOnBoard("You win!", true);
		return;
	}

	//reset dice to re-roll
	$("#rollButton").attr("disabled", false);
	$("#die1").html("<img src = \"dice/blank.png\">");
	$("#die2").html("<img src = \"dice/blank.png\">");


	return openTabs;
}

function makeBoard() {
	//Uses a string to construct the initial html of the board as it goes along
	//Not necessary at this stage, but I built to be easily modified if I ever want to add options with different
	//numbers of tabs

	boardStr = "<table><tr id = \"numbers\">";

	// create content for numbers row
	for(i = 1; i < 10; i++) {
		boardStr += "<td id = \"num" + i + "\">" + i + "</td>";
	}

	boardStr += "</tr>";

	// create buttons row
	boardStr += "<tr id = \"picks\">";
	for(i = 1; i < 10; i++) {
		boardStr += "<td><input type =\"checkbox\" id = \"" + i + "\" class = \"checkBox\"></td>";
	}
	boardStr += "</tr>";

	//create roll row
	boardStr += "<tr><td colspan = \"3\"><input type=\"button\" value=\"Roll\" id=\"rollButton\"></td>" + 
								 "<td id =\"die1\" colspan = \"3\"><img src = \"dice/blank.png\"></td>" + 
								 "<td id =\"die2\" colspan = \"3\"><img src = \"dice/blank.png\"></td></tr>";
	//create subtotal row
	$("#board").html(boardStr + "<tr><td id =\"label\" colspan = \"4\">Subtotal</td>" +
									 "<td id = \"subtotal\">0</td>" +
										"<td colspan = \"4\"><input type=\"button\" value=\"New Game\" id=\"newButton\"></td></tr></table>");
}	

function clearBoard() {
	//Takes all the parts of the board that are modified during the game and resets them

	for(i = 1; i < 10; i++) {
		$("#num" + i).html(i);
		$("#" + i).attr("checked", false);
		$("#" + i).attr("disabled", false);
	}

	$("#rollButton").attr("disabled", false);
	$("#die1").html("<img src = \"dice/blank.png\">");
	$("#die2").html("<img src = \"dice/blank.png\">");
	$("#label").html("Subtotal");
	$("#subtotal").html("0");

}

function lose(target, openTabs) {
	//Checks dice total against all possible combinations of up 3 of the remaining tabs
	//Starts with looping through first tabs, checking, looping following tabs, checking, thrid, checking
	//Also makes sure that the player won't be left with only a 1 on the board, (It being impossible to roll with 2 die)
	//I would really like to make this more efficient, and able to handle at least 4 die,
	//As 3 handles a 9 tab game fine, but 1 + 2 + 3 + 4 = 10 and any game with more than 9 tabs will need deeper tab checks

	mySum = tabSum(openTabs);
	
	if ((mySum - target) == 1){
		return true;
	}

	for (i = 0; i < openTabs.length; i++){
		if (openTabs[i] == target) {
			return false;
		}
		for (i2 = 0; i2 < i; i2++) {
			if (openTabs[i2] == (target - openTabs[i])) {
				return false;
			}

			for (i3 = 0; i3 < i2; i3++) {
				lastTwo = openTabs[i] + openTabs[i2];
				if (openTabs[i3] == (target - lastTwo)) {
					return false
				}
			}
		}
	}

	return true;

}

function displayOnBoard(message, win) {
	//Takes in a message and displays it in the subtotal section
	//The inner HTML will accept :( as a string but not :)

	$("#label").html(message);
	if(win) {
		$("#subtotal").html(":)");
	} else {
		$("#subtotal").html(":(");
	}
	


}

function tabSum(tabs) {
	//Reduces an array to the sum of it's content

	mySum = 0;
	for(i = 0; i < tabs.length; i++) {
		mySum += tabs[i];
	}
	return mySum;
}

main();
