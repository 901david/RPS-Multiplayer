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
  var databaseRef = firebase.database();
  var databaseRefPOne = firebase.database().ref("/Player/One");
  var databaseRefPTwo = firebase.database().ref("/Player/Two");
  var databaseRefChat = firebase.database().ref("/Chat");
  


// Definition of Variables
var userChoice; //Choice made R, P, S
var usernameInput; //Name user enters
var defaultUserName = "Guest";
var wins = 0;
var losses = 0;

// Do something when submit is clicked
// - Update firebase database
// - Update local html "Hi Pavan you are player 1"
// -- Overwrite input and submit with this text div

// Update page when value of snapshot changes
// - Updates player boxes

// Actual JS
// This simply grabs the username input and sets it to a variable
function getUserName () {
	$("#nameSubmission").click(function (){
		if (($("#nameInput").val().trim()) === "") {
			usernameInput = defaultUserName
			
			}
			else {
			usernameInput = $("#nameInput").val().trim();
			
			};
			console.log(usernameInput);
			shouldWeAddAnother();
	});
};
;
function shouldWeAddAnother () {
			if (databaseRef.ref("/Player/One").name === undefined) {
			databaseRefPOne.set({
			name: usernameInput,
			wins: 0,
			losses: 0
			});
			}
			else if (databaseRef.ref("/Player/Two").name === undefined){
			databaseRefPTwo.set({
			name: usernameInput,
			wins: 0,
			losses: 0
			});
			}
			else {
			alert("Sorry there are already two players.  You will have to wait your turn.");
			}	
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


$(document).ready(function(){
$("#nameSpotLeft").html("Waiting on Other Player");
$("#nameSpotRight").html("Waiting on Other Player");
getUserName();



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

