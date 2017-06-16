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
  var database = firebase.database();
  console.log(database);


// Definition of Variables
var userChoice; //Choice made R, P, S
var usernameInput; //Name user enters
var playerOne = {};
var playerTwo = {};
var defaultUserName = "Guest";



// Actual JS
// These function control player names
function generatePlayerNameOne () {
$("#nameSubmission").click(function (){
	if (($("#nameInput").val().trim()) === "") {
		usernameInput = defaultUserName
		$("#nameArea").html("<h3>" + usernameInput + " You are Player 1</h3>");
	$("#nameSpotLeft").html(usernameInput);
	}
	else {
usernameInput = $("#nameInput").val().trim();
$("#nameArea").html("<h3>" + usernameInput + " You are Player 1</h3>");
$("#nameSpotLeft").html(usernameInput);
};
generateChoices();
talkShitGetHit(usernameInput);
});
};
function generatePlayerNameTwo () {
$("#nameSubmission").click(function (){
	if (($("#nameInput").val().trim()) === "") {
		usernameInput = defaultUserName
		$("#nameArea").html("<h3>" + usernameInput + " You are Player 2</h3>");
	$("#nameSpotRight").html(usernameInput);
	}
	else {
usernameInput = $("#nameInput").val().trim();
$("#nameArea").html("<h3>" + usernameInput + " You are Player 2</h3>");
$("#nameSpotRight").html(usernameInput);
};
});
};
// This function will control chat
function talkShitGetHit (user) {
	var tempvar;
	$("#chatSubmit").click(function () {
		tempvar = $("#chatInput").val().trim();
		console.log(tempvar);
		$("#chatInput").val("");
		$(".boxCreate").append("<p>" + user + ":  " + tempvar + "</p>");
	});
};
//
// This functoin creates the choices on the screen applies and onclick to themand then saves their choice to a variable for comparison.
function generateChoices () {
	$("#middleBox").html("<img class='img-responsive' src='images/hand-motion.gif'>");
	var choicesToShow = $("<p class='choices' data-choice='rock'>Rock</p><p class='choices' data-choice='paper'>Paper</p><p class='choices' data-choice='scissors'>Scissors</p>");
	$(".choicesToShow").html(choicesToShow);
	$(".choices").click(function () {
	userChoice = $(this).attr("data-choice");
	console.log(userChoice);
	switch (userChoice) {
		case "rock":
		$(".choicesToShow").html("<img alt='rock' src='images/rock.png' class='img-responsive col-xs-7 col-xs-offset-2 col-sm-7 col-sm-offset-2 col-md-7 col-md-offset-2 col-lg-7 col-lg-offset-2'>")
		break;
		case "paper":
		$(".choicesToShow").html("<img alt='paper' src='images/paper.png' class='img-responsive col-xs-8 col-xs-offset-2 col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-8 col-lg-offset-2'>")
		break;
		case "scissors":
		$(".choicesToShow").html("<img alt='scissors' src='images/scissors.png' class='img-responsive col-xs-8 col-xs-offset-2 col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-8 col-lg-offset-2'>")
		break;
		default:
		alert("nothing chosen");
	}
	});
	
};

// This function will display the chosen image for both players




// This function uses a switch statement to determine who wins





$(document).ready(function(){
$("#nameSpotLeft").html("Waiting on Other Player");
$("#nameSpotRight").html("Waiting on Other Player");
$("#score").html('<p id="keepInPlace">Wins: <span id="wins">0          </span>Losses: <span id="losses">0 </span>       </p>');
generatePlayerNameOne();







});