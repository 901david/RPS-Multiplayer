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
  var databaseRefUserGuessed = firebase.database().ref("/Player/One/userGuessed");
  var databaseRefUserGuess = firebase.database().ref("/Player/One/userGuess");


// Definition of Variables
var userChoice; //Choice made R, P, S
var usernameInput; //Name user enters
var defaultUserName = "Guest"; //Default username if not name is entered
var wins = 0; //Wins starts at 0
var losses = 0; //Losses start at 0
var playerOneChose = false; //This will be used and eventually pushed to server to determine what to display on the screen

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
			$("#nameArea").empty().append("<p class='headSize'>" + usernameInput + " you are Player 1!");
			databaseRefPOne.child("name").on("value", function (snapshot) {
				console.log(snapshot.val());
				$("#nameSpotLeft").html(snapshot.val()).addClass("slightlyBigger");
			}, function (error) {
			//Handle Error
			});
			$("#scoreOne").append('<br/><p>Wins: <span id="winsTwo">0</span>      Losses: <span id="lossesTwo">0</span></p>');

	});
			
};

// This function uses basic logic to determine who wins
function iAmPrettySureIWon () {
	switch (userChoicePOne) {
		case ("rock"):
			switch (userChoicePTwo) {
				case ("rock"):
				// Tie
				case ("paper"): 
				// Player Two Wins
				case ("scissors"):
				// Player One Wins
				}
		case ("paper"):
			switch (userChoicePTwo) {
				case ("rock"):
				// Player 1 Wins
				case ("paper"): 
				// tie
				case ("scissors"):
				// Player Two Wins
				}
		case ("scissors"):
			switch (userChoicePTwo) {
				case ("rock"):
				// Player 2 Wins
				case ("paper"): 
				// Player 1 Wins
				case ("scissors"):
				// Tie
				}
				};
			};
// Determines if we have two players or not btu does not allow 3 or more
function shouldWeAddAnother () {
				databaseRefPlayer.once("value", function (snapshot) {
				if (!(snapshot.child("One").exists())) {
				databaseRefPOne.set({
				name: usernameInput,
				wins: 0,
				losses: 0
				});
				databaseRefUserGuessed.set({chose: false});
				}
				else if (!(snapshot.child("Two").exists())) {
				databaseRefPTwo.set({
				name: usernameInput,
				wins: 0,
				losses: 0
				});
				$("#nameArea").empty().append("<p class='headSize'>" + usernameInput + " you are Player 2!");
				databaseRefPTwo.child("name").on("value", function (snapshot) {
				console.log(snapshot.val());
				$("#nameSpotRight").html(snapshot.val()).addClass("slightlyBigger");
			}, function (error) {
			//Handle Error
			});
			$("#scoreOne").append('<br/><p>Wins: <span id="winsTwo">0</span>      Losses: <span id="lossesTwo">0</span></p>');
				}
				else {
				alert("Too many players");
				}
				
			}, function (error) {
				alert("OOPS -- Something went wrong");
				});	
};
// This function will control chat
function talkShitGetHit () {
	var tempvar;
	$("#chatSubmit").click(function () {
		tempvar = $("#chatInput").val().trim();
		databaseRefChat.push(usernameInput + ": " + tempvar);
		$("#chatInput").val("");
		databaseRefChat.on("child_added", function(snapshot) {
			console.log(snapshot.val());
			// $(".boxCreate").append("<p>" + snapshot.val() + "</p>");	
		}, function (error) {//Handle Errors
		});
	});

};
// This function takes the users selection and decides what player gave that input and also where to set on server
function WhatAndWhereToPush () {
	switch (userChoice) {
						case "rock":
						if (userData === "One") {
							databaseRefUserGuess.set({
								choice: "rock"
							});
						}
						else {
							databaseRefUserGuess.set({
								choice: "rock"
							});;
						}
						break;
						case "paper":
						if (userData === "One") {
							databaseRefUserGuess.set({
								choice: "paper"
							});
						}
						else {
							databaseRefUserGuess.set({
								choice: "paper"
							});
						}
						break;
						case "scissors":
						if (userData === "One") {
							databaseRefUserGuess.set({
								choice: "scissors"
							});
						}
						else {
							databaseRefUserGuess.set({
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
					var choicesToShowOne = $("<p class='choices' data-player='One' data-choice='rock'>Rock</p><p class='choices' data-player='One' data-choice='paper'>Paper</p><p class='choices' data-player='One' data-choice='scissors'>Scissors</p>");
					var choicesToShowTwo = $("<p class='choices' data-player='Two' data-choice='rock'>Rock</p><p class='choices' data-player='Two' data-choice='paper'>Paper</p><p class='choices' data-player='Two' data-choice='scissors'>Scissors</p>");
					if (playerOneChose === false) {
					$("#leftBox").addClass("yourTurn");
					$("#choicesToShowOne").html(choicesToShowOne);
					$(".choices").click(function () {
					databaseRefUserGuessed.set({chose: true });
					userChoice = $(this).attr("data-choice");
					userData = $(this).attr("data-player");
					WhatAndWhereToPush()
					databaseRefUserGuessed.once("value", function (snapshot) {
					if (databaseRefUserGuessed.child("chose") === true) {
					$("#choicesToShowTwo").html(choicesToShowTwo);
					}
					}, function (error) {alert("Oops something went wrong");});
						});
					}
					else if ((playerOneChose === true) && (playerTwoChose === false)) {
					$("#choicesToShowOne").empty();
					$("#choicesToShowTwo").html(choicesToShowTwo);
					$(".choices").click(function () {
					playerTwoChose = true;
					userChoice = $(this).attr("data-choice");
					userData = $(this).attr("data-player");
					WhatAndWhereToPush()
						});
					}
					else if ((playerOneChose === true) && (playerTwoChose === true)) {
						alert("display who won");
					}	
		}
	}, function (error) {alert("OOPS -- Something went wrong");
						})

	}, function (error) {alert("OOPS -- Something went wrong");
						});
	
};
$(document).ready(function(){
$("#nameSpotLeft").html("Waiting on Other Player");
$("#nameSpotRight").html("Waiting on Other Player");
getUserName();
generateChoices();
talkShitGetHit();

});








// Listen even info to add back in once I get data storing properly.
// if (!(databaseRef.hasChild("PlayerOne"))) {}
// else if (databaseRef.hasChild("PlayerOne")) {}
// 		else {
// 		console.log("3rd");
// 		alert("Too many players! - Sorry");
// 	}	




// 		$("#nameArea").html("<h3>" + usernameInputOne + " You are Player 1</h3>");
// 		$("#nameSpotLeft").html(usernameInputOne);

// 		$("#nameArea").html("<h3>" + usernameInputOne + " You are Player 1</h3>");
// 		$("#nameSpotLeft").html(usernameInputOne);

// 		$("#nameArea").html("<h3>" + usernameInputTwo + " You are Player 2</h3>");
// 		$("#nameSpotLeft").html(usernameInputTwo);
// 		$("#nameArea").html("<h3>" + usernameInputTwo + " You are Player 2</h3>");
// 		$("#nameSpotLeft").html(usernameInputTwo);

// switch (userChoice) {
// 						case "rock":
// 						$(".choicesToShow").html("<img alt='rock' src='images/rock.png' class='img-responsive col-xs-7 col-xs-offset-2 col-sm-7 col-sm-offset-2 col-md-7 col-md-offset-2 col-lg-7 col-lg-offset-2'>")
// 						break;
// 						case "paper":
// 						$(".choicesToShow").html("<img alt='paper' src='images/paper.png' class='img-responsive col-xs-8 col-xs-offset-2 col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-8 col-lg-offset-2'>")
// 						break;
// 						case "scissors":
// 						$(".choicesToShow").html("<img alt='scissors' src='images/scissors.png' class='img-responsive col-xs-8 col-xs-offset-2 col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-8 col-lg-offset-2'>")
// 						break;
// 						default:
// 						alert("nothing chosen");
// 					}

// 
