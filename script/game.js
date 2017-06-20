// Defining and initializing FIrebase
var config = {
	apiKey: "AIzaSyBjl-QYq5haDTWJJ86zU5uuLfgJO1Ii4s8",
	authDomain: "rps-multiplayer-3f9db.firebaseapp.com",
	databaseURL: "https://rps-multiplayer-3f9db.firebaseio.com",
	projectId: "rps-multiplayer-3f9db",
	storageBucket: "rps-multiplayer-3f9db.appspot.com",
	messagingSenderId: "401672091861"
};
firebase.initializeApp(config);
  // Firebase Refs I want to use
  var databaseRef = firebase.database();
  var databaseRefPlayer = firebase.database().ref("/Player");
  var databaseRefPOne = firebase.database().ref("/Player/One");
  var databaseRefPTwo = firebase.database().ref("/Player/Two");
  var databaseRefChat = firebase.database().ref("/Chat");
  var databaseRefUserGuessedOne = firebase.database().ref("/Player/One/userGuessed");
  var databaseRefUserGuessOne = firebase.database().ref("/Player/One/userGuess");
  var databaseRefUserGuessTwo = firebase.database().ref("/Player/Two/userGuess");
  var databaseRefUserGuessedTwo = firebase.database().ref("/Player/Two/userGuessed");

// Definition of Variables
var userChoice; //Choice made R, P, S
var usernameInput; //Name user enters
var defaultUserName = "Guest"; //Default username if not name is entered
var wins = 0; //Wins starts at 0
var losses = 0; //Losses start at 0
var playerOneChose = false; //This will be used and eventually pushed to server to determine what to display on the screen
var playerOne = 0;
var playerTwo = 0;
var choicesToShowTwo = $("<p class='choices' data-player='Two' data-choice='rock'>Rock</p><p class='choices' data-player='Two' data-choice='paper'>Paper</p><p class='choices' data-player='Two' data-choice='scissors'>Scissors</p>");
// This simply grabs the username input and sets it to a variable -than calls the function to determine if anotehr player should be added.
function getUserName () {
	$("#nameSubmission").click(function (){
		if (($("#nameInput").val().trim()) === "") {
			usernameInput = defaultUserName;
		}
		else {
			usernameInput = $("#nameInput").val().trim();
		};
		console.log(usernameInput);
		shouldWeAddAnother();
		if (playerOne === 1) {
			$("#nameArea").empty().append("<p class='headSize'>" + usernameInput + " you are Player 1!");
			databaseRefPOne.child("name").on("value", function (snapshot) {
				console.log(snapshot.val());
				$("#nameSpotLeft").html(snapshot.val()).addClass("slightlyBigger");
			}, function (error) {
				alert("Something went wrong...OOPS!");
			});	
			$("#scoreOne").append('<br/><p>Wins: <span id="winsTwo">0</span>      Losses: <span id="lossesTwo">0</span></p>');
		}
		if ((playerOne === 1) && (playerTwo === 2)) {
			databaseRefPTwo.child("name").on("value", function (snapshot) {
				addPlayerTwoName();
			}, function (error) {
				alert("Ouchie...something in this program had a boo  boo.");
			});
		};

	});

};
// Determines if we have two players or not btu does not allow 3 or more
function shouldWeAddAnother () {
	databaseRefPlayer.once("value", function (snapshot) {
		if (!(snapshot.child("One").exists())) {
			playerOne = 1;
			databaseRefPOne.set({
				name: usernameInput,
				wins: 0,
				losses: 0
			});
			databaseRefUserGuessedOne.set({chose: false});
		}
		else if (!(snapshot.child("Two").exists())) {
			playerTwo = 2;
			databaseRefPTwo.set({
				name: usernameInput,
				wins: 0,
				losses: 0
			});
			databaseRefUserGuessedTwo.set({chose: false});
		}	
		else {
			alert("Too many players");
		}

	}), function (error) {
		alert("OOPS -- Something went wrong");
	};
	if (playerTwo === 2) {
		databaseRefPOne.child("name").on("value", function (snapshot) {
			console.log(snapshot.val());
			$("#nameSpotLeft").html(snapshot.val()).addClass("slightlyBigger");
		}, function (error) {
			alert("Something went wrong...OOPS!");
		});

		$("#choicesToShowOne").empty();
	}
};

// This function will change the Dom independently while players make a choice.....hopefully
function addPlayerTwoName () {
	databaseRefPTwo.child("name").on("value", function (snapshot) {
		$("#nameArea").empty().append("<p class='headSize'>" + snapshot.val() + " you are Player 2!");
		
	}, function (error) {
			//Handle Error
		});
	
};
// This function uses basic logic to determine who wins
function iAmPrettySureIWon () {
	var userChoicePOne;
	var userChoicePTwo;
	var playOneChose;
	var playTwoChose;
	databaseRefUserGuessOne.child("choice").on("value", function (snapshot){
		userChoicePOne = snapshot.val();
	}, 
	function (error) {
		alert("Oops we have an issue.....")
	});
	databaseRefUserGuessTwo.child("choice").on("value", function (snapshot){
		userChoicePTwo = snapshot.val();
	}, 
	function (error) {
		alert("Oops we have an issue.....")
	});
	databaseRefUserGuessedOne.child("chose").on("value", function (snapshot){
		playOneChose = snapshot.val();
		console.log("Player One Has Chosen? " + playOneChose)
	}, 
	function (error) {
		alert("Oops we have an issue.....")
	});
	databaseRefUserGuessedTwo.child("chose").on("value", function (snapshot){
		playTwoChose = snapshot.val();
	}, 
	function (error) {
		alert("Oops we have an issue.....")
	});
	if ((playOneChose === true) && (playTwoChose === true)) {
		whatDidYouPickOne(userChoicePOne);
		whatDidYouPickTwo(userChoicePTwo);
		if (userChoicePOne === "rock") {
			
				if (userChoicePTwo === "rock") {
				$("#middleBox").append("<h3>You Tied!</h3>");
				}
				else if (userChoicePTwo === "paper") { 
				$("#middleBox").append("<h3>Player 2 Wins!</h3>");
				}
				else {
				$("#middleBox").append("<h3>Player 1 Wins!</h3>");
				};
			}
			
		else if (userChoicePOne === "paper") {
				if (userChoicePTwo === "rock") {
				$("#middleBox").append("<h3>Player 1 Wins!</h3>");
				}
				else if (userChoicePTwo === "paper") { 
				$("#middleBox").append("<h3>You Tied!</h3>");
				}
				else {
				$("#middleBox").append("<h3>Player 2 Wins!</h3>");
				};
		}
		else if (userChoicePOne === "scissors") {
				if (userChoicePTwo === "rock") {
				$("#middleBox").append("<h3>Player 2 Wins!</h3>");
				}
				else if (userChoicePTwo === "paper") { 
				$("#middleBox").append("<h3>Player 1 Wins!</h3>");
				}
		}
				else {
				$("#middleBox").append("<h3>You Tied!</h3>");
			};
	};	
};
// This function takes the users selection and decides what player gave that input and also where to set on server
function WhatAndWhereToPush () {
	switch (userChoice) {
		case "rock":
		if (userData === "One") {
			databaseRefUserGuessOne.set({
				choice: "rock"
			});
		}
		else if (userData === "Two") {
			databaseRefUserGuessTwo.set({
				choice: "rock"
			});;
		}
		break;
		case "paper":
		if (userData === "One") {
			databaseRefUserGuessOne.set({
				choice: "paper"
			});
		}
		else if (userData === "Two") {
			databaseRefUserGuessTwo.set({
				choice: "paper"
			});
		}
		break;
		case "scissors":
		if (userData === "One") {
			databaseRefUserGuessOne.set({
				choice: "scissors"
			});
		}
		else if (userData === "Two") {
			databaseRefUserGuessTwo.set({
				choice: "scissors"
			});
		}
		break;
		default:
		alert("nothing chosen");
	}	
};

// This function will generate the choices on the screen and then call another function to determine what to send off.
function generateChoices () {
	databaseRefPlayer.on("child_added", function (snapshot) {
		databaseRefPlayer.once("value", function (snapshot) {
			if ((snapshot.child("One").exists()) && (snapshot.child("Two").exists())) {
				$("#middleBox").html("<img class='img-responsive' src='images/hand-motion.gif'>");
				if (playerOne === 1){
					var choicesToShowOne = $("<p class='choices' data-player='One' data-choice='rock'>Rock</p><p class='choices' data-player='One' data-choice='paper'>Paper</p><p class='choices' data-player='One' data-choice='scissors'>Scissors</p>");
					$("#choicesToShowOne").html(choicesToShowOne);
					$(".choices").on("click", function () {
						databaseRefUserGuessedOne.set({chose: true });
						userChoice = $(this).attr("data-choice");
						userData = $(this).attr("data-player");
						WhatAndWhereToPush();
						whatDidYouPickOne(userChoice);
						iAmPrettySureIWon();	
					});
				}
				if (playerTwo === 2) {
					$("#choicesToShowOne").empty();
					$("#choicesToShowTwo").html(choicesToShowTwo);
					$("#scoreTwo").append('<br/><p>Wins: <span id="winsTwo">0</span>      Losses: <span id="lossesTwo">0</span></p>');
					$(".choices").on("click", function () {
						databaseRefUserGuessedTwo.set({chose: true });
						userChoice = $(this).attr("data-choice");
						userData = $(this).attr("data-player");
						WhatAndWhereToPush();
						whatDidYouPickTwo(userChoice);
						iAmPrettySureIWon();	
					});
				}

							
			}
		}), function (error) {alert("OOPS -- Something went wrong");
	}, 
	function (error) {alert("OOPS -- Something went wrong");
};
});
}


// This function determines when to show what the players chose and then tell who won
function whatDidYouPickOne (x) {
	switch (x) {
		case "rock":
		$("#choicesToShowOne").html("<img alt='rock' src='images/rock.png' class='img-responsive col-xs-7 col-xs-offset-2 col-sm-7 col-sm-offset-2 col-md-7 col-md-offset-2 col-lg-7 col-lg-offset-2'>")
		break;
		case "paper":
		$("#choicesToShowOne").html("<img alt='paper' src='images/paper.png' class='img-responsive col-xs-8 col-xs-offset-2 col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-8 col-lg-offset-2'>")
		break;
		case "scissors":
		$("#choicesToShowOne").html("<img alt='scissors' src='images/scissors.png' class='img-responsive col-xs-8 col-xs-offset-2 col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-8 col-lg-offset-2'>")
		break;
		default:
		alert("nothing chosen");
	}
	$("#middleBox").empty();
}
function whatDidYouPickTwo (x) {
	switch (x) {
		case "rock":
		$("#choicesToShowTwo").html("<img alt='rock' src='images/rock.png' class='img-responsive col-xs-7 col-xs-offset-2 col-sm-7 col-sm-offset-2 col-md-7 col-md-offset-2 col-lg-7 col-lg-offset-2'>")
		break;
		case "paper":
		$("#choicesToShowTwo").html("<img alt='paper' src='images/paper.png' class='img-responsive col-xs-8 col-xs-offset-2 col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-8 col-lg-offset-2'>")
		break;
		case "scissors":
		$("#choicesToShowTwo").html("<img alt='scissors' src='images/scissors.png' class='img-responsive col-xs-8 col-xs-offset-2 col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-8 col-lg-offset-2'>")
		break;
		default:
		alert("nothing chosen");
	}
	$("#middleBox").empty();
}
// This function will control chat
function talkShitGetHit () {
	var tempvar;
	$("#chatSubmit").click(function () {
		tempvar = $("#chatInput").val().trim();
		databaseRefChat.push(usernameInput + ": " + tempvar);
		$("#chatInput").val("");
	});
	databaseRefChat.on("child_added", function(snapshot) {
		$(".boxCreate").append("<p>" + snapshot.val() + "</p>");	
		}, function (error) {//Handle Errors
		});
};
$(document).ready(function(){
	databaseRefPTwo.child("name").on("value", function (snapshot) {
		$("#nameSpotRight").html(snapshot.val()).addClass("slightlyBigger");
	}, function (error) {
			alert("Oops looks like we srewed up.");
		});
	databaseRefPOne.child("name").on("value", function (snapshot) {
		$("#nameSpotLeft").html(snapshot.val()).addClass("slightlyBigger");
	}, function (error) {
			alert("Oops looks like we srewed up.");
		});
	getUserName();
	generateChoices();
	talkShitGetHit();
});





