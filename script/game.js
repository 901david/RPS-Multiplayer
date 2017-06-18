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
  var databaseRefPlayer = firebase.database().ref("/Player");
  var databaseRefPOne = firebase.database().ref("/Player/One");
  var databaseRefPTwo = firebase.database().ref("/Player/Two");
  var databaseRefChat = firebase.database().ref("/Chat");
  


// Definition of Variables
var userChoice; //Choice made R, P, S
var usernameInput; //Name user enters
var defaultUserName = "Guest";
var wins = 0;
var losses = 0;

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
				databaseRefPlayer.once("value", function (snapshot) {
				if (!(snapshot.child("One").exists())) {
				databaseRefPOne.set({
				name: usernameInput,
				wins: 0,
				losses: 0
				});
				}
				else if (!(snapshot.child("Two").exists())) {
				databaseRefPTwo.set({
				name: usernameInput,
				wins: 0,
				losses: 0
				});
				}
				else {
				alert("Too many players");
				}
				
			}, function (error) {
				alert("OOPS -- Something went wrong");
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
	databaseRefPlayer.on("child_added", function (snapshot) {
		databaseRefPlayer.once("value", function (snapshot) {
				if ((snapshot.child("One").exists()) && (snapshot.child("Two").exists())) {
					$("#middleBox").html("<img class='img-responsive' src='images/hand-motion.gif'>");
					var choicesToShowOne = $("<p class='choices' data-player='One' data-choice='rock'>Rock</p><p class='choices' data-player='One' data-choice='paper'>Paper</p><p class='choices' data-player='One' data-choice='scissors'>Scissors</p>");
					var choicesToShowTwo = $("<p class='choices' data-player='Two' data-choice='rock'>Rock</p><p class='choices' data-player='Two' data-choice='paper'>Paper</p><p class='choices' data-player='Two' data-choice='scissors'>Scissors</p>");
					$("#choicesToShowOne").html(choicesToShowOne);
					$("#choicesToShowTwo").html(choicesToShowTwo);
					$(".choices").click(function () {
					userChoice = $(this).attr("data-choice");
					userData = $(this).attr("data-player");
					switch (userChoice) {
						case "rock":
						if (userData === "One") {
							databaseRefPOne.push({
								choice: "rock"
							});
						}
						else {
							databaseRefPOne.push({
								choice: "rock"
							});;
						}
						break;
						case "paper":
						if (userData === "One") {
							databaseRefPOne.push({
								choice: "paper"
							});
						}
						else {
							databaseRefPTwo.push({
								choice: "paper"
							});
						}
						break;
						case "scissors":
						if (userData === "One") {
							databaseRefPOne.push({
								choice: "scissors"
							});
						}
						else {
							databaseRefPTwo.push({
								choice: "scissors"
							});
						}
						break;
						default:
						alert("nothing chosen");
					}
	});
				}
			}, function (error) {
				alert("OOPS -- Something went wrong");
				});
	},function (error) {
		// Error handlind
	});
			
};


$(document).ready(function(){
$("#nameSpotLeft").html("Waiting on Other Player");
$("#nameSpotRight").html("Waiting on Other Player");
getUserName();
generateChoices();


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

